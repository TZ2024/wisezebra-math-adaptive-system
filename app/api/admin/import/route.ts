import { NextResponse } from 'next/server';
import { parseCsv, previewQuestionImport } from '@/lib/import/question-import';
import { getSupabaseAdmin } from '@/lib/supabase';

async function fetchExistingExternalKeys() {
  const client = getSupabaseAdmin();
  if (!client) return new Set<string>();

  const { data, error } = await client.from('questions').select('external_key');
  if (error) throw error;
  return new Set((data ?? []).map((item: any) => item.external_key).filter(Boolean));
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const mode = String(form.get('mode') || 'preview');

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'File is required.' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCsv(text);
    const existingIds = await fetchExistingExternalKeys();
    const preview = previewQuestionImport(rows, existingIds);

    if (mode === 'preview') {
      return NextResponse.json({ ok: true, mode: 'preview', preview });
    }

    const client = getSupabaseAdmin();
    if (!client) {
      return NextResponse.json({ ok: false, error: 'Supabase admin client is required to write imported questions.' }, { status: 500 });
    }

    const payload = preview.valid.map((row) => ({
      external_key: row.question_id,
      prompt: row.prompt,
      answer: row.answer,
      teacher_explanation: row.teacher_explanation,
      common_errors: row.common_errors ? row.common_errors.split('|').map((item) => item.trim()).filter(Boolean) : [],
      hints: row.hints ? row.hints.split('|').map((item) => item.trim()).filter(Boolean) : [],
      wz_level: row.wz_level,
      domain: row.domain,
      skill: row.skill,
      michigan_standard: row.michigan_standard || null,
      kumon_reference: row.kumon_reference || null,
      difficulty: Number(row.difficulty || 3),
      status: row.status || 'draft',
    }));

    const { error } = await client.from('questions').upsert(payload, { onConflict: 'external_key' });
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      mode: 'commit',
      insertedOrUpdated: payload.length,
      preview,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Failed to import question file.' }, { status: 500 });
  }
}
