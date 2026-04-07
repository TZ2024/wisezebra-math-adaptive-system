import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="container" style={{ paddingBottom: 0 }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <div className="badge">WiseZebra • WZ 1 to WZ 15</div>
          <h1 style={{ margin: '12px 0 6px' }}>Math Adaptive Assessment and Practice System</h1>
          <div className="helper">Child-friendly diagnostic, personalized practice, and teacher-ready support packets.</div>
        </div>
        <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/student/start">Student</Link>
          <Link href="/student/results">Results</Link>
          <Link href="/student/practice">Practice</Link>
          <Link href="/teacher/report">Teacher</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
