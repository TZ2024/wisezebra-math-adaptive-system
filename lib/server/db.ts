import { getSupabaseAdmin } from '@/lib/supabase';
import { buildSessionProfile, generatePracticeMix, initializeDomainConfidence, pickNextQuestion, shouldStopAssessment, updateDomainState } from '@/lib/adaptive-engine';
import type { DomainConfidence, PracticePackageType, QuestionRecord, SessionAnswer, SessionProfile, SessionProfileRecord, StudentSessionRecord } from '@/types';

function db() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase admin client is not configured.');
  return client;
}

function normalizeAnswer(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function mapQuestion(row: any): QuestionRecord {
  return {
    id: row.id,
    prompt: row.prompt,
    answer: row.answer,
    wzLevel: row.wz_level,
    domain: row.domain,
    skill: row.skill,
    michiganStandard: row.michigan_standard ?? undefined,
    kumonReference: row.kumon_reference ?? undefined,
    difficulty: row.difficulty,
    status: row.status,
    commonErrors: row.common_errors ?? [],
    hints: row.hints ?? [],
    teacherExplanation: row.teacher_explanation,
  };
}

function mapProfile(row: any): SessionProfileRecord {
  return {
    id: row.id,
    session_id: row.session_id,
    overall_wz_level: row.overall_wz_level,
    strengths: row.strengths ?? [],
    support_areas: row.support_areas ?? [],
    recommended_next_practice: row.recommended_next_practice ?? [],
    domain_confidence: row.domain_confidence ?? [],
    stopped_reason: row.stopped_reason,
    created_at: row.created_at,
  };
}

export async function fetchApprovedQuestions() {
  const { data, error } = await db()
    .from('questions')
    .select('*')
    .eq('status', 'approved')
    .order('wz_level', { ascending: true })
    .order('difficulty', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapQuestion);
}

export async function createStudentSession(input: { studentName: string; parentEmail?: string | null }) {
  const sessionCode = `wz-${Date.now()}`;
  const { data, error } = await db()
    .from('student_sessions')
    .insert({
      session_code: sessionCode,
      student_name: input.studentName,
      parent_email: input.parentEmail ?? null,
      status: 'in_progress',
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as StudentSessionRecord;
}

export async function getStudentSession(sessionId: string) {
  const { data, error } = await db().from('student_sessions').select('*').eq('id', sessionId).single();
  if (error) throw error;
  return data as StudentSessionRecord;
}

export async function saveSessionAnswer(input: { sessionId: string; question: QuestionRecord; response: string; correct: boolean }) {
  const { data, error } = await db()
    .from('session_answers')
    .insert({
      session_id: input.sessionId,
      question_id: input.question.id,
      student_response: input.response,
      is_correct: input.correct,
      domain: input.question.domain,
      skill: input.question.skill,
      wz_level: input.question.wzLevel,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getSessionAnswers(sessionId: string): Promise<SessionAnswer[]> {
  const { data, error } = await db()
    .from('session_answers')
    .select('question_id, student_response, is_correct, domain, skill, wz_level')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    questionId: row.question_id,
    correct: row.is_correct,
    domain: row.domain,
    skill: row.skill,
    wzLevel: row.wz_level,
    response: row.student_response ?? undefined,
  }));
}

export async function saveSessionProfile(sessionId: string, profile: SessionProfile) {
  const { data, error } = await db()
    .from('session_profiles')
    .upsert({
      session_id: sessionId,
      overall_wz_level: profile.overallLevel,
      strengths: profile.strengths,
      support_areas: profile.supportAreas,
      recommended_next_practice: profile.recommendedNextPractice,
      domain_confidence: profile.domainConfidence,
      stopped_reason: profile.stoppedReason,
    }, { onConflict: 'session_id' })
    .select('*')
    .single();

  if (error) throw error;
  return mapProfile(data);
}

export async function getSessionProfile(sessionId: string) {
  const { data, error } = await db().from('session_profiles').select('*').eq('session_id', sessionId).maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data) : null;
}

export async function markSessionCompleted(sessionId: string) {
  const { data, error } = await db()
    .from('student_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select('*')
    .single();

  if (error) throw error;
  return data as StudentSessionRecord;
}

export async function runDiagnosticStep(input: { sessionId: string; response: string }) {
  const session = await getStudentSession(input.sessionId);
  const questions = await fetchApprovedQuestions();
  if (!questions.length) throw new Error('No approved questions are available. Import approved WZ-tagged questions first.');

  const answers = await getSessionAnswers(input.sessionId);
  const states: DomainConfidence[] = initializeDomainConfidence();

  for (const answer of answers) {
    const index = states.findIndex((item) => item.domain === answer.domain);
    if (index >= 0) states[index] = updateDomainState(states[index], answer, answers.filter((item) => item.questionId !== answer.questionId));
  }

  const currentQuestion = pickNextQuestion(questions, states, answers);
  if (!currentQuestion) {
    const profile = buildSessionProfile(states);
    const savedProfile = await saveSessionProfile(input.sessionId, profile);
    await markSessionCompleted(input.sessionId);
    return { finished: true as const, session, profile, savedProfile, nextQuestion: null };
  }

  const correct = normalizeAnswer(input.response) === normalizeAnswer(currentQuestion.answer);
  const newAnswer: SessionAnswer = {
    questionId: currentQuestion.id,
    correct,
    domain: currentQuestion.domain,
    skill: currentQuestion.skill,
    wzLevel: currentQuestion.wzLevel,
    response: input.response,
  };

  await saveSessionAnswer({ sessionId: input.sessionId, question: currentQuestion, response: input.response, correct });

  const domainIndex = states.findIndex((item) => item.domain === newAnswer.domain);
  if (domainIndex >= 0) states[domainIndex] = updateDomainState(states[domainIndex], newAnswer, answers);

  const totalAnswers = answers.length + 1;
  const stopReason = shouldStopAssessment(states, totalAnswers);

  if (stopReason) {
    const profile = buildSessionProfile(states);
    const savedProfile = await saveSessionProfile(input.sessionId, profile);
    await markSessionCompleted(input.sessionId);
    return { finished: true as const, session, profile, savedProfile, nextQuestion: null };
  }

  const refreshedAnswers = [...answers, newAnswer];
  const nextQuestion = pickNextQuestion(questions, states, refreshedAnswers);
  return {
    finished: false as const,
    session,
    progress: {
      answered: totalAnswers,
      maxQuestionCount: session.max_question_count,
    },
    liveState: states,
    nextQuestion,
    answerFeedback: {
      correct,
      expectedAnswer: correct ? null : currentQuestion.answer,
    },
  };
}

export async function getCurrentDiagnosticQuestion(sessionId: string) {
  const session = await getStudentSession(sessionId);
  const answers = await getSessionAnswers(sessionId);
  const profile = await getSessionProfile(sessionId);

  if (session.status === 'completed' && profile) {
    return { completed: true as const, profile };
  }

  const questions = await fetchApprovedQuestions();
  if (!questions.length) throw new Error('No approved questions are available. Import approved WZ-tagged questions first.');

  const states: DomainConfidence[] = initializeDomainConfidence();
  for (const answer of answers) {
    const index = states.findIndex((item) => item.domain === answer.domain);
    if (index >= 0) states[index] = updateDomainState(states[index], answer, answers.filter((item) => item.questionId !== answer.questionId));
  }

  const nextQuestion = pickNextQuestion(questions, states, answers);
  if (!nextQuestion) {
    const built = buildSessionProfile(states);
    const savedProfile = await saveSessionProfile(sessionId, built);
    await markSessionCompleted(sessionId);
    return { completed: true as const, profile: savedProfile };
  }

  return {
    completed: false as const,
    question: nextQuestion,
    answered: answers.length,
    maxQuestionCount: session.max_question_count,
    liveState: states,
  };
}

export async function createPracticeSet(input: { sessionId: string; profileId: string; packageType: PracticePackageType; questionIds: string[] }) {
  const { data: setData, error: setError } = await db()
    .from('practice_sets')
    .insert({
      session_id: input.sessionId,
      profile_id: input.profileId,
      current_mix_pct: 60,
      review_mix_pct: 25,
      challenge_mix_pct: 15,
    })
    .select('*')
    .single();

  if (setError) throw setError;

  const multiplier = input.packageType === 'weekly' ? 5 : 1;
  const items = Array.from({ length: multiplier }).flatMap((_, packIndex) =>
    input.questionIds.map((questionId, index) => ({
      practice_set_id: setData.id,
      question_id: questionId,
      bucket: packIndex === 0 ? 'current' : `day_${packIndex + 1}`,
      sort_order: packIndex * 100 + index,
    })),
  );

  const { error: itemError } = await db().from('practice_items').insert(items);
  if (itemError) throw itemError;

  return setData;
}

export async function createTeacherPacket(input: { sessionId: string; profileId: string; practiceSetId?: string | null; parentEmail?: string | null; packetBody: string }) {
  const { data, error } = await db()
    .from('teacher_packets')
    .insert({
      session_id: input.sessionId,
      profile_id: input.profileId,
      practice_set_id: input.practiceSetId ?? null,
      parent_email: input.parentEmail ?? null,
      packet_subject: 'WiseZebra Teacher Diagnostic Packet',
      packet_body: input.packetBody,
      delivery_status: 'queued',
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function buildPracticeSetFromProfile(input: { sessionId: string; profileId: string; packageType: PracticePackageType }) {
  const questions = await fetchApprovedQuestions();
  const profileRecord = await getSessionProfile(input.sessionId);
  if (!profileRecord) throw new Error('No completed diagnostic profile found for this session.');

  const profile: SessionProfile = {
    overallLevel: profileRecord.overall_wz_level,
    strengths: profileRecord.strengths,
    supportAreas: profileRecord.support_areas,
    recommendedNextPractice: profileRecord.recommended_next_practice,
    domainConfidence: profileRecord.domain_confidence,
    stoppedReason: profileRecord.stopped_reason,
  };

  const selected = generatePracticeMix(profile, questions);
  if (!selected.length) throw new Error('No approved practice questions are available for this profile.');

  const practiceSet = await createPracticeSet({
    sessionId: input.sessionId,
    profileId: input.profileId,
    packageType: input.packageType,
    questionIds: selected.map((item) => item.id),
  });

  return { practiceSet, questions: selected, profile };
}
