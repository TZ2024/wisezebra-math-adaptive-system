'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { buildSessionProfile, initializeDomainConfidence } from '@/lib/adaptive-engine';

const samplePdfPayload = {
  studentName: 'Ava',
  wzLevel: 'WZ 10',
  strengths: ['Operations and Fluency at WZ 9', 'Geometry, Data, and Word Problems at WZ 10'],
  supportAreas: ['Signed Numbers and Prealgebra Bridge needs support before WZ 12'],
  recommendedNextPractice: ['60% practice at WZ 10', '25% spiral review from WZ 9', '15% challenge from WZ 11'],
};

async function downloadPrintable(packageType: 'single' | 'weekly') {
  const response = await fetch('/api/pdf/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...samplePdfPayload, packageType }),
  });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wisezebra-practice-${packageType}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ResultsPage() {
  const profile = buildSessionProfile(initializeDomainConfidence().map((state, index) => ({
    ...state,
    confidence: [0.84, 0.78, 0.73, 0.8, 0.69][index],
    total: 3,
    correct: [3, 2, 2, 2, 1][index],
    levelIndex: 7 + index,
  })));

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Your diagnostic result" subtitle="Your result and next step are all here in one place.">
          <div className="grid grid-2">
            <div>
              <div className="helper">Your current WiseZebra level</div>
              <div className="kpi">{profile.overallLevel}</div>
            </div>
            <div>
              <div className="helper">Recommended next step</div>
              <div style={{ fontWeight: 700 }}>Continue with personalized practice at your level, with some review and challenge mixed in.</div>
            </div>
          </div>

          <div className="grid grid-3" style={{ marginTop: 16 }}>
            <div>
              <h3>Strengths</h3>
              <ul className="list">{profile.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Support areas</h3>
              <ul className="list">{profile.supportAreas.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Recommended next practice</h3>
              <ul className="list">{profile.recommendedNextPractice.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Choose your practice package" subtitle="No extra product switch, just continue from your result.">
          <div className="grid grid-2">
            <div className="card" style={{ padding: 20 }}>
              <div className="badge">Quick start</div>
              <h3>1 personalized practice set</h3>
              <div className="kpi">$0.99</div>
              <p className="helper">One targeted printable practice set based on this diagnostic.</p>
              <button className="button" style={{ marginTop: 16 }} onClick={() => downloadPrintable('single')}>Buy and generate PDF</button>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div className="badge">Best value</div>
              <h3>5 personalized practice sets</h3>
              <div className="kpi">$2.99</div>
              <p className="helper">A one-week weekday pack of printable personalized practice.</p>
              <button className="button" style={{ marginTop: 16 }} onClick={() => downloadPrintable('weekly')}>Buy and generate PDFs</button>
            </div>
          </div>
          <div className="card" style={{ padding: 20, marginTop: 16 }}>
            <h3 style={{ marginTop: 0 }}>After purchase</h3>
            <ul className="list">
              <li>Generate printable PDF automatically</li>
              <li>Download immediately</li>
              <li>Teacher packet is sent to WiseZebra internally</li>
            </ul>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link className="button secondary" href="/student/start">Start another diagnostic</Link>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
