import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { getAdminQuestionBank } from '@/lib/server/admin';

export default async function AdminQuestionsPage() {
  const questions = await getAdminQuestionBank();

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Question bank" subtitle="Internal only. These records come from imported WZ-tagged question data in the database.">
          <div className="grid grid-3">
            <input className="input" placeholder="Filter by WZ level" disabled />
            <input className="input" placeholder="Filter by domain" disabled />
            <input className="input" placeholder="Filter by Michigan standard or Kumon reference" disabled />
          </div>
        </SectionCard>
        <SectionCard title={`Questions (${questions.length})`} subtitle="Using real stored records, not built-in sample items.">
          <div className="grid">
            {questions.map((question) => (
              <div key={question.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <strong>{question.prompt}</strong>
                    <div className="helper">{question.wzLevel} • {question.domain} • {question.skill}</div>
                    <div className="helper">Michigan: {question.michiganStandard || '—'} • Kumon: {question.kumonReference || '—'}</div>
                  </div>
                  <span className="badge">{question.status}</span>
                </div>
              </div>
            ))}
            {!questions.length ? <p className="helper">No questions found yet. Import tagged WZ questions first.</p> : null}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
