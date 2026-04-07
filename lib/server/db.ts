import { getSupabaseAdmin } from '@/lib/supabase';
import type { SessionProfile } from '@/types';

function db() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase admin client is not configured.');
  return client;
}

export async function createStudentSession(input: { studentName: string; parentEmail?: string | null }) {
  const sessionCode = `wz-${Date.now()}`;
  const { data, error } = await db()
    .from('student_sessions')
    .insert({
      session_code: sessionCode,
      student_name: input.studentName,
      parent_email: input.parentEmail ?? null,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function saveSessionProfile(sessionId: string, profile: SessionProfile) {
  const { data, error } = await db()
    .from('session_profiles')
    .insert({
      session_id: sessionId,
      overall_wz_level: profile.overallLevel,
      strengths: profile.strengths,
      support_areas: profile.supportAreas,
      recommended_next_practice: profile.recommendedNextPractice,
      domain_confidence: profile.domainConfidence,
      stopped_reason: profile.stoppedReason,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function createPracticeSet(input: { sessionId: string; profileId: string; packageType: 'single' | 'weekly'; questionIds: string[] }) {
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
