import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { StatTile } from '@/components/StatTile';
import { ProgressBar } from '@/components/ProgressBar';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <section className="hero">
          <div className="hero-panel">
            <div className="badge" style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>Product overview</div>
            <h2 style={{ fontSize: 40, lineHeight: 1.1, marginBottom: 12 }}>Student-facing experience on the outside, teacher intelligence on the inside.</h2>
            <p style={{ fontSize: 18, opacity: 0.95 }}>
              Students finish a diagnostic, see a clear result, and can buy personalized practice. Teachers receive the deeper diagnostic report by email.
            </p>
            <div className="pill-row" style={{ margin: '18px 0 22px' }}>
              <span className="pill">Student result page</span>
              <span className="pill">Teacher email report</span>
              <span className="pill">$0.99 single set</span>
              <span className="pill">$2.99 five-pack</span>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="button" href="/student/start">Open student flow</Link>
              <Link className="button secondary" href="/teacher/report">Open teacher view</Link>
            </div>
          </div>
          <div className="muted-panel">
            <h3 style={{ marginTop: 0 }}>What each audience sees</h3>
            <div className="grid">
              <ProgressBar value={100} label="Student sees result + practice options" />
              <ProgressBar value={100} label="Teacher gets internal report by email" />
              <ProgressBar value={100} label="Admin manages bank, sessions, packets" />
            </div>
            <div className="grid grid-2" style={{ marginTop: 16 }}>
              <StatTile label="Teacher inbox" value="wisezebrami@gmail.com" note="Internal report destination" />
              <StatTile label="Practice offers" value="2" note="Single set or 5-pack" />
            </div>
          </div>
        </section>

        <div className="grid grid-3">
          <StatTile label="Student outcome" value="WZ result" note="Strengths + support areas" />
          <StatTile label="Teacher outcome" value="Full report" note="Explanations, hints, teaching notes" />
          <StatTile label="Monetization" value="0.99 / 2.99" note="Per set or workweek pack" />
        </div>

        <div className="grid grid-2">
          <SectionCard title="Public student pages">
            <ul className="list">
              <li><strong>Student Start</strong>: name required, parent email optional</li>
              <li><strong>Diagnostic</strong>: child-friendly adaptive question flow</li>
              <li><strong>Student Results</strong>: WZ level, strengths, support areas, next step</li>
              <li><strong>Practice Purchase</strong>: $0.99 for one set, $1.99 for five sets</li>
            </ul>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="button" href="/student/results">See result page</Link>
              <Link className="button secondary" href="/student/practice">See practice offers</Link>
            </div>
          </SectionCard>

          <SectionCard title="Internal and teacher pages">
            <ul className="list">
              <li><strong>Teacher Report</strong>: internal evaluation logic, confidence by domain, teaching notes</li>
              <li><strong>Teacher Email</strong>: sent to <strong>wisezebrami@gmail.com</strong></li>
              <li><strong>Admin</strong>: question bank, sessions, profiles, packets, manual assignment</li>
            </ul>
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="button secondary" href="/teacher/report">See teacher report</Link>
              <Link className="button secondary" href="/admin">See admin</Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
