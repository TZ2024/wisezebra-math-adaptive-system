import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <div className="container">
        <section className="simple-hero card">
          <div className="badge">WiseZebra Math</div>
          <h2 className="simple-hero-title">A clear math diagnostic that leads to the right next step.</h2>
          <p className="simple-hero-subtitle">Students answer one question at a time, get a real result, and continue into personalized practice.</p>
          <div style={{ marginTop: 24 }}>
            <Link className="button" href="/student/start">Start Diagnostic</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
