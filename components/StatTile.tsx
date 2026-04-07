export function StatTile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="helper">{label}</div>
      <div className="kpi" style={{ fontSize: 28 }}>{value}</div>
      {note ? <div className="helper">{note}</div> : null}
    </div>
  );
}
