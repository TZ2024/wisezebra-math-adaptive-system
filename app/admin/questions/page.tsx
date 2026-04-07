import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { sampleQuestions } from '@/lib/mock-data';

export default function AdminQuestionsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Question bank filters">
          <div className="grid grid-3">
            <input className="input" placeholder="Filter by WZ level" />
            <input className="input" placeholder="Filter by domain" />
            <input className="input" placeholder="Filter by Michigan standard or Kumon reference" />
          </div>
        </SectionCard>
        <SectionCard title="Questions">
          <div className="grid">
            {sampleQuestions.map((question) => (
              <div key={question.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <strong>{question.prompt}</strong>
                    <div className="helper">{question.wzLevel} • {question.domain} • {question.skill}</div>
                    <div className="helper">Michigan: {question.michiganStandard} • Kumon: {question.kumonReference}</div>
                  </div>
                  <span className="badge">{question.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
