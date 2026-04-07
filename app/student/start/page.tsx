import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

export default function StudentStartPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container">
        <SectionCard title="Student start" subtitle="Guest mode only for version 1.">
          <div className="grid grid-2">
            <div>
              <label className="label">Student name</label>
              <input className="input" placeholder="Enter student name" defaultValue="Ava" />
            </div>
            <div>
              <label className="label">Parent email (optional)</label>
              <input className="input" placeholder="parent@example.com" defaultValue="parent@example.com" />
            </div>
          </div>
          <p className="helper">Students do not register. Teachers receive the explanation layer later, but students only see child-friendly questions and practice.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link className="button" href="/student/diagnostic">Begin diagnostic</Link>
            <Link className="button secondary" href="/">Back</Link>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
