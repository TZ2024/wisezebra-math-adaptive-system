import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <section className="card" style={{ padding: 40 }}>
          <div className="badge">WiseZebra Math</div>
          <h2 style={{ marginTop: 16, marginBottom: 12 }}>
            Find your child’s math level and get the right next practice.
          </h2>
          <p className="helper" style={{ maxWidth: 720, fontSize: 18 }}>
            A simple adaptive diagnostic for Grades 1 through 6, followed by
            personalized printable practice.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link className="button" href="/student/start">
              Start Diagnostic
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
