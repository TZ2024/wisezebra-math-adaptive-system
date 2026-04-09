import { getSupabaseAdmin } from '@/lib/supabase';
import type { QuestionRecord } from '@/types';

function db() {
  return getSupabaseAdmin();
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

export async function getAdminQuestionBank() {
  const client = db();
  if (!client) return [];

  const { data, error } = await client
    .from('questions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapQuestion);
}

export async function getAdminStats() {
  const client = db();
  if (!client) {
    return {
      questionCount: 0,
      sessionCount: 0,
      completedSessionCount: 0,
      packetCount: 0,
      queuedPacketCount: 0,
    };
  }

  const [questions, sessions, packets] = await Promise.all([
    client.from('questions').select('id', { count: 'exact', head: true }),
    client.from('student_sessions').select('id,status', { count: 'exact' }),
    client.from('teacher_packets').select('id,delivery_status', { count: 'exact' }),
  ]);

  if (questions.error) throw questions.error;
  if (sessions.error) throw sessions.error;
  if (packets.error) throw packets.error;

  const completedSessions = (sessions.data ?? []).filter((item: any) => item.status === 'completed').length;
  const queuedPackets = (packets.data ?? []).filter((item: any) => item.delivery_status === 'queued').length;

  return {
    questionCount: questions.count ?? 0,
    sessionCount: sessions.count ?? 0,
    completedSessionCount: completedSessions,
    packetCount: packets.count ?? 0,
    queuedPacketCount: queuedPackets,
  };
}

export async function getAdminSessions() {
  const client = db();
  if (!client) return [];

  const { data, error } = await client
    .from('student_sessions')
    .select(`
      id,
      session_code,
      student_name,
      status,
      completed_at,
      session_profiles ( overall_wz_level ),
      teacher_packets ( delivery_status )
    `)
    .order('started_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function getAdminPackets() {
  const client = db();
  if (!client) return [];

  const { data, error } = await client
    .from('teacher_packets')
    .select(`
      id,
      delivery_status,
      packet_subject,
      created_at,
      student_sessions ( student_name, session_code ),
      session_profiles ( overall_wz_level )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}
