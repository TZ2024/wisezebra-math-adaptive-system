'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { sampleQuestions } from '@/lib/mock-data';

export default function DiagnosticPage() {
  const firstQuestion = sampleQuestions[0];

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Diagnostic in progress" subtitle="Just answer the questions one by one.">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div className="badge">Question 1</div>
            <div className="helper">Take your time and do your best.</div>
          </div>
          <div className="card" style={{ padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.4 }}>{firstQuestion?.prompt}</div>
          </div>
          <label className="label" style={{ marginTop: 16 }}>Your answer</label>
          <input className="input" placeholder="Type your answer here" />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="button">Submit answer</button>
            <Link className="button secondary" href="/student/results">Finish sample diagnostic</Link>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
