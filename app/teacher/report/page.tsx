import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

export default function TeacherReportPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Teacher report" subtitle="Internal only. This route should not be linked from any public student page.">
          <div className="card" style={{ padding: 20 }}>
            <p><strong>Status</strong>: Internal shell only</p>
            <p><strong>Purpose</strong>: Teacher-facing report delivery and review</p>
            <p><strong>Next step</strong>: Wire this page to real session, profile, and packet records after admin auth is finalized.</p>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
