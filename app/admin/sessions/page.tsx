import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

const sessions = [
  { id: 'demo-001', student: 'Ava', level: 'WZ 10', status: 'completed', packet: 'queued' },
  { id: 'demo-002', student: 'Lucas', level: 'WZ 13', status: 'completed', packet: 'sent' },
];

export default function AdminSessionsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid grid-2">
        <SectionCard title="Student sessions">
          <ul className="list">
            {sessions.map((session) => (
              <li key={session.id}><strong>{session.student}</strong> • {session.id} • {session.level} • {session.status}</li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Manual extra practice assignment">
          <label className="label">Session ID</label>
          <input className="input" defaultValue="demo-001" />
          <label className="label" style={{ marginTop: 12 }}>Practice notes</label>
          <textarea className="textarea" rows={6} defaultValue="Add two extra signed-number bridge questions and one fraction review item." />
          <button className="button" style={{ marginTop: 16 }}>Assign extra practice</button>
        </SectionCard>
      </div>
    </main>
  );
}
