import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { buildSessionProfile, initializeDomainConfidence } from '@/lib/adaptive-engine';

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
        <SectionCard title="Your math result" subtitle="Student-facing summary only.">
          <div className="grid grid-2">
            <div>
              <div className="helper">Your current WiseZebra level</div>
              <div className="kpi">{profile.overallLevel}</div>
            </div>
            <div>
              <div className="helper">Next step</div>
              <div style={{ fontWeight: 700 }}>Practice at your level, plus a little review and challenge.</div>
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

        <SectionCard title="Personalized practice is ready" subtitle="A teacher version of this result is sent to WiseZebra internally.">
          <div className="grid grid-2">
            <div className="card" style={{ padding: 20 }}>
              <div className="badge">Best for trying it now</div>
              <h3>1 personalized practice set</h3>
              <div className="kpi">$0.99</div>
              <p className="helper">One custom set generated from this diagnostic result.</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div className="badge">Best value</div>
              <h3>5 practice sets</h3>
              <div className="kpi">$2.99</div>
              <p className="helper">A full weekday week of personalized practice.</p>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="button" href="/student/practice">Choose a practice option</Link>
            <Link className="button secondary" href="/student/start">Try another demo session</Link>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
