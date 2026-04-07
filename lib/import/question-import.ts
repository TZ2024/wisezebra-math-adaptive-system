export type ImportedQuestionRow = {
  question_id: string;
  prompt: string;
  answer: string;
  teacher_explanation: string;
  common_errors?: string;
  hints?: string;
  wz_level: string;
  domain: string;
  skill: string;
  michigan_standard?: string;
  kumon_reference?: string;
  difficulty?: string;
  status?: string;
};

export type ImportPreviewResult = {
  valid: ImportedQuestionRow[];
  errors: Array<{ row: number; message: string }>;
  updates: string[];
  inserts: string[];
};

const required = ['question_id', 'prompt', 'answer', 'teacher_explanation', 'wz_level', 'domain', 'skill'] as const;

export function parseCsv(text: string): ImportedQuestionRow[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ''])) as ImportedQuestionRow;
  });
}

export function previewQuestionImport(rows: ImportedQuestionRow[], existingIds: Set<string>): ImportPreviewResult {
  const result: ImportPreviewResult = { valid: [], errors: [], updates: [], inserts: [] };

  rows.forEach((row, index) => {
    const missing = required.filter((field) => !row[field]);
    if (missing.length) {
      result.errors.push({ row: index + 2, message: `Missing required fields: ${missing.join(', ')}` });
      return;
    }

    result.valid.push(row);
    if (existingIds.has(row.question_id)) result.updates.push(row.question_id);
    else result.inserts.push(row.question_id);
  });

  return result;
}
