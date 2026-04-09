import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { getAdminSessions } from '@/lib/server/admin';

export default async function AdminSessionsPage() {
  const sessions = await getAdminSessions();

  return (
    <main>
      <SiteHeader />
      <div className="container grid grid-2">
        <SectionCard title="Student sessions" subtitle="Internal diagnostic records from the database.">
          <ul className="list">
            {sessions.map((session: any) => (
              <li key={session.id}>
                <strong>{session.student_name}</strong>
                {' '}• {session.session_code}
                {' '}• {session.session_profiles?.overall_wz_level || 'In progress'}
                {' '}• {session.status}
                {' '}• packet {session.teacher_packets?.delivery_status || 'not created'}
              </li>
            ))}
          </ul>
          {!sessions.length ? <p className="helper">No student sessions found yet.</p> : null}
        </SectionCard>
        <SectionCard title="Internal workflow note" subtitle="Teacher and admin actions stay internal, not public-facing.">
          <ul className="list">
            <li>Student flow should stay clean and student-safe.</li>
            <li>Teacher packets should be reviewed internally.</li>
            <li>Extra practice assignment can be added later after real admin auth is wired.</li>
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}
