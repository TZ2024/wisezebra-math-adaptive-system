import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { StatTile } from '@/components/StatTile';
import { getAdminStats } from '@/lib/server/admin';

const cards = [
  { href: '/admin/questions' as const, title: 'Question bank', copy: 'Review imported and approved tagged questions.' },
  { href: '/admin/import' as const, title: 'Import questions', copy: 'Import externally tagged CSV or Excel question bank files.' },
  { href: '/admin/sessions' as const, title: 'Student sessions', copy: 'Review diagnostic sessions, results, and completion status.' },
  { href: '/admin/packets' as const, title: 'Teacher packets', copy: 'Review generated packets and delivery status.' },
];

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <div className="card" style={{ padding: 18 }}>
          <div className="badge">Internal only</div>
          <p className="helper" style={{ marginTop: 10 }}>This area should stay out of the public student journey and remain behind admin login.</p>
        </div>
        <div className="grid grid-3">
          <StatTile label="Questions" value={String(stats.questionCount)} note="Imported question records" />
          <StatTile label="Completed sessions" value={String(stats.completedSessionCount)} note={`Out of ${stats.sessionCount} total sessions`} />
          <StatTile label="Queued packets" value={String(stats.queuedPacketCount)} note={`Out of ${stats.packetCount} total packets`} />
        </div>
        <div className="grid grid-2">
          {cards.map((card) => (
            <SectionCard key={card.href} title={card.title}>
              <p className="helper">{card.copy}</p>
              <Link className="button" href={card.href}>Open</Link>
            </SectionCard>
          ))}
        </div>
      </div>
    </main>
  );
}
