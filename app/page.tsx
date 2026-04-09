import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <section className="customer-hero card">
          <div className="customer-hero-copy">
            <div className="badge">WiseZebra Math</div>
            <h2 className="customer-hero-title">A more confident way to understand a student’s math level and choose the right next practice.</h2>
            <p className="customer-hero-subtitle">
              WiseZebra gives families and students a clear math diagnostic experience, a simple result, and personalized follow-up practice in one clean flow.
            </p>
            <div className="customer-hero-actions">
              <Link className="button" href="/student/start">Start Diagnostic</Link>
            </div>
          </div>
          <div className="customer-hero-panel">
            <div className="customer-panel-card">
              <h3>What families get</h3>
              <ul className="list">
                <li>A calm, student-friendly diagnostic</li>
                <li>A clear level result and next-step recommendation</li>
                <li>Printable practice after the diagnostic</li>
              </ul>
            </div>
            <div className="customer-panel-card">
              <h3>Why it feels better</h3>
              <ul className="list">
                <li>Simple student flow, not a cluttered dashboard</li>
                <li>One clear next action at each step</li>
                <li>Designed to feel polished and trustworthy</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
