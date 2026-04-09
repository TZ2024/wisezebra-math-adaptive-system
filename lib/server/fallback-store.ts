import { buildSessionProfile, generatePracticeMix, initializeDomainConfidence, pickNextQuestion, shouldStopAssessment, updateDomainState } from '@/lib/adaptive-engine';
import { sampleQuestions } from '@/lib/mock-data';
import type { DomainConfidence, PracticePackageType, QuestionRecord, SessionAnswer, SessionProfile } from '@/types';

type MemorySession = {
  id: string;
  session_code: string;
  student_name: string;
  parent_email: string | null;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  max_question_count: number;
  answers: SessionAnswer[];
  profile: SessionProfile | null;
};

const store = new Map<string, MemorySession>();

function normalizeAnswer(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function isFallbackModeEnabled() {
  return true;
}

export function createFallbackStudentSession(input: { studentName: string; parentEmail?: string | null }) {
  const id = `fallback-${Date.now()}`;
  const session: MemorySession = {
    id,
    session_code: id,
    student_name: input.studentName,
    parent_email: input.parentEmail ?? null,
    status: 'in_progress',
    started_at: new Date().toISOString(),
    completed_at: null,
    max_question_count: 18,
    answers: [],
    profile: null,
  };
  store.set(id, session);
  return session;
}

export function getFallbackStudentSession(sessionId: string) {
  const session = store.get(sessionId);
  if (!session) throw new Error('Fallback session not found.');
  return session;
}

export function getFallbackCurrentDiagnosticQuestion(sessionId: string) {
  const session = getFallbackStudentSession(sessionId);
  if (session.status === 'completed' && session.profile) {
    return { completed: true as const, profile: session.profile };
  }

  const states: DomainConfidence[] = initializeDomainConfidence();
  for (const answer of session.answers) {
    const index = states.findIndex((item) => item.domain === answer.domain);
    if (index >= 0) states[index] = updateDomainState(states[index], answer, session.answers.filter((item) => item.questionId !== answer.questionId));
  }

  const nextQuestion = pickNextQuestion(sampleQuestions, states, session.answers);
  if (!nextQuestion) {
    const profile = buildSessionProfile(states);
    session.profile = profile;
    session.status = 'completed';
    session.completed_at = new Date().toISOString();
    return { completed: true as const, profile };
  }

  return {
    completed: false as const,
    question: nextQuestion,
    answered: session.answers.length,
    maxQuestionCount: session.max_question_count,
    liveState: states,
  };
}

export function runFallbackDiagnosticStep(input: { sessionId: string; response: string }) {
  const session = getFallbackStudentSession(input.sessionId);
  const states: DomainConfidence[] = initializeDomainConfidence();

  for (const answer of session.answers) {
    const index = states.findIndex((item) => item.domain === answer.domain);
    if (index >= 0) states[index] = updateDomainState(states[index], answer, session.answers.filter((item) => item.questionId !== answer.questionId));
  }

  const currentQuestion = pickNextQuestion(sampleQuestions, states, session.answers);
  if (!currentQuestion) {
    const profile = buildSessionProfile(states);
    session.profile = profile;
    session.status = 'completed';
    session.completed_at = new Date().toISOString();
    return { finished: true as const, session, profile, profileId: `${session.id}-profile`, nextQuestion: null };
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
  session.answers.push(newAnswer);

  const domainIndex = states.findIndex((item) => item.domain === newAnswer.domain);
  if (domainIndex >= 0) states[domainIndex] = updateDomainState(states[domainIndex], newAnswer, session.answers.slice(0, -1));

  const stopReason = shouldStopAssessment(states, session.answers.length);
  if (stopReason) {
    const profile = buildSessionProfile(states);
    session.profile = profile;
    session.status = 'completed';
    session.completed_at = new Date().toISOString();
    return { finished: true as const, session, profile, profileId: `${session.id}-profile`, nextQuestion: null };
  }

  const nextQuestion = pickNextQuestion(sampleQuestions, states, session.answers);
  return {
    finished: false as const,
    session,
    progress: {
      answered: session.answers.length,
      maxQuestionCount: session.max_question_count,
    },
    liveState: states,
    nextQuestion,
  };
}

export function getFallbackResult(sessionId: string) {
  const session = getFallbackStudentSession(sessionId);
  if (!session.profile) throw new Error('Diagnostic is not complete yet.');

  return {
    session: {
      id: session.id,
      sessionCode: session.session_code,
      studentName: session.student_name,
      parentEmail: session.parent_email,
    },
    profile: session.profile,
    profileId: `${session.id}-profile`,
  };
}

export function buildFallbackPracticeSet(packageType: PracticePackageType) {
  const profile = buildSessionProfile(initializeDomainConfidence());
  const questions = generatePracticeMix(profile, sampleQuestions as QuestionRecord[]);
  return { questions };
}
