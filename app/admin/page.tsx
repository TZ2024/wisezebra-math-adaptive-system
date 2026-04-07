import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { StatTile } from '@/components/StatTile';

const cards = [
  { href: '/admin/questions' as const, title: 'Question bank', copy: 'Add, edit, filter, and approve tagged questions.' },
  { href: '/admin/sessions' as const, title: 'Student sessions', copy: 'View diagnostic sessions, answers, and profiles.' },
  { href: '/admin/packets' as const, title: 'Teacher packets', copy: 'Review generated packets and delivery status.' },
];

export default function AdminPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <div className="grid grid-3">
          <StatTile label="Questions" value="6" note="Seeded sample records" />
          <StatTile label="Profiles" value="2" note="Demo student summaries" />
          <StatTile label="Packet status" value="Queued" note="Teacher packet automation layer ready" />
        </div>
        <div className="grid grid-3">
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
