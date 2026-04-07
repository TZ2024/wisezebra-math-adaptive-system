export function SectionCard({ title, children, subtitle }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {subtitle ? <p className="helper" style={{ marginTop: -4 }}>{subtitle}</p> : null}
      {children}
    </section>
  );
}
