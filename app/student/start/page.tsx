'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

export default function StudentStartPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function beginDiagnostic() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/diagnostic/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, parentEmail }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Could not start the diagnostic.');
      }

      router.push(`/student/diagnostic?sessionId=${encodeURIComponent(result.session.id)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the diagnostic.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <SiteHeader />
      <div className="container">
        <SectionCard title="Start diagnostic" subtitle="Enter the student name to begin the real assessment flow.">
          <div className="grid grid-2">
            <div>
              <label className="label">Student name</label>
              <input className="input" placeholder="Enter student name" value={studentName} onChange={(event) => setStudentName(event.target.value)} />
            </div>
            <div>
              <label className="label">Parent email (optional)</label>
              <input className="input" placeholder="parent@example.com" value={parentEmail} onChange={(event) => setParentEmail(event.target.value)} />
            </div>
          </div>
          <p className="helper">Start with the student name, then continue into the diagnostic.</p>
          {error ? <p style={{ color: 'var(--danger)', marginTop: 16 }}>{error}</p> : null}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="button" onClick={beginDiagnostic} disabled={submitting || !studentName.trim()}>
              {submitting ? 'Starting...' : 'Begin diagnostic'}
            </button>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
