'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

type PreviewResult = {
  valid: Array<{ question_id: string; prompt: string; wz_level: string; domain: string; skill: string }>;
  errors: Array<{ row: number; message: string }>;
  updates: string[];
  inserts: string[];
};

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'preview' | 'commit' | null>(null);

  async function submit(mode: 'preview' | 'commit') {
    if (!file) {
      setError('Please choose a CSV file first.');
      return;
    }

    setLoading(mode);
    setError(null);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('mode', mode);

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: form,
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Import request failed.');

      setPreview(result.preview || null);
      setMessage(mode === 'preview'
        ? 'Preview generated. Review inserts, updates, and row errors below.'
        : `Import completed. ${result.insertedOrUpdated} rows were inserted or updated.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import request failed.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Question bank import" subtitle="Upload externally tagged WZ CSV files, preview them, then write valid rows into the database.">
          <div className="grid grid-2">
            <div>
              <label className="label">Upload CSV export</label>
              <input className="input" type="file" accept=".csv" onChange={(event) => setFile(event.target.files?.[0] || null)} />
              <p className="helper">Expected fields: question_id, prompt, answer, teacher_explanation, wz_level, domain, skill.</p>
            </div>
            <div>
              <label className="label">Import rules</label>
              <ul className="list">
                <li>Preview before commit</li>
                <li>Update existing questions by <strong>question_id / external_key</strong></li>
                <li>Store all external tags exactly as provided</li>
                <li>Do not auto-invent official WZ banks</li>
              </ul>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="button secondary" onClick={() => submit('preview')} disabled={loading !== null}>
              {loading === 'preview' ? 'Generating preview...' : 'Preview import'}
            </button>
            <button className="button" onClick={() => submit('commit')} disabled={loading !== null}>
              {loading === 'commit' ? 'Writing to database...' : 'Commit valid rows'}
            </button>
          </div>
          {message ? <p style={{ color: 'var(--success)', marginTop: 16 }}>{message}</p> : null}
          {error ? <p style={{ color: 'var(--danger)', marginTop: 16 }}>{error}</p> : null}
        </SectionCard>

        <SectionCard title="Preview results">
          {preview ? (
            <div className="grid">
              <div className="grid grid-3">
                <div className="card" style={{ padding: 16 }}><strong>{preview.valid.length}</strong><div className="helper">Valid rows</div></div>
                <div className="card" style={{ padding: 16 }}><strong>{preview.inserts.length}</strong><div className="helper">New inserts</div></div>
                <div className="card" style={{ padding: 16 }}><strong>{preview.updates.length}</strong><div className="helper">Updates</div></div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ marginTop: 0 }}>Valid rows</h3>
                <table className="table-lite">
                  <thead>
                    <tr><th>question_id</th><th>WZ</th><th>Domain</th><th>Skill</th></tr>
                  </thead>
                  <tbody>
                    {preview.valid.slice(0, 20).map((row) => (
                      <tr key={row.question_id}>
                        <td>{row.question_id}</td>
                        <td>{row.wz_level}</td>
                        <td>{row.domain}</td>
                        <td>{row.skill}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ marginTop: 0 }}>Row errors</h3>
                {preview.errors.length ? (
                  <ul className="list">
                    {preview.errors.map((item, index) => <li key={`${item.row}-${index}`}>Row {item.row}: {item.message}</li>)}
                  </ul>
                ) : <p className="helper">No row validation errors.</p>}
              </div>
            </div>
          ) : (
            <p className="helper">Run a preview to inspect inserts, updates, and row errors before writing to the database.</p>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
