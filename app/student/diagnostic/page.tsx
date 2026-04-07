import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { QuestionPreviewCard } from '@/components/QuestionPreviewCard';
import { ProgressBar } from '@/components/ProgressBar';
import { sampleQuestions } from '@/lib/mock-data';
import { initializeDomainConfidence, pickNextQuestion } from '@/lib/adaptive-engine';

export default function DiagnosticPage() {
  const states = initializeDomainConfidence();
  const firstQuestion = pickNextQuestion(sampleQuestions, states, []);

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <div className="grid grid-2">
          <SectionCard title="Diagnostic in progress" subtitle="Rule-based adaptive engine, starting from the middle range.">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div className="badge">Session demo-001</div>
              <div className="helper">Question 1 of 18 max</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <QuestionPreviewCard
                prompt={firstQuestion?.prompt ?? 'Question preview unavailable'}
                meta={`${firstQuestion?.wzLevel} • ${firstQuestion?.domain} • ${firstQuestion?.skill}`}
              />
            </div>
            <label className="label" style={{ marginTop: 16 }}>Student answer</label>
            <input className="input" placeholder="Type answer" />
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="button">Submit answer</button>
              <Link className="button secondary" href="/student/results">Skip to sample results</Link>
            </div>
          </SectionCard>

          <SectionCard title="Confidence by domain">
            <div className="grid">
              {states.map((state, index) => (
                <ProgressBar key={state.domain} value={[56, 61, 48, 58, 44][index]} label={state.domain} />
              ))}
            </div>
            <p className="helper" style={{ marginTop: 16 }}>
              The engine tracks confidence separately by domain and uses recent success or struggle to move level targeting up or down.
            </p>
          </SectionCard>
        </div>

        <SectionCard title="Adaptive logic snapshot">
          <ul className="list">
            <li>Starts from a middle WZ level by domain</li>
            <li>Moves up after repeated success</li>
            <li>Moves down after repeated struggle</li>
            <li>Keeps confidence by domain and skill</li>
            <li>Stops when enough confidence is reached or max question count is reached</li>
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}
