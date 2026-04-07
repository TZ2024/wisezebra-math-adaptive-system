import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

export default function AdminPacketsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Teacher packet preview">
          <div className="grid grid-2">
            <div>
              <p><strong>Student</strong>: Ava</p>
              <p><strong>Session ID</strong>: demo-001</p>
              <p><strong>Profile summary</strong>: WZ 10 overall, strong in operations and geometry, needs support in bridge topics.</p>
            </div>
            <div>
              <p><strong>Email status</strong>: queued</p>
              <p><strong>Assigned questions</strong>: 11</p>
              <p><strong>Teaching notes</strong>: Use visual fraction models before moving into ratio comparison tasks.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
