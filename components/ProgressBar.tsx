export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? <div className="helper" style={{ marginBottom: 6 }}>{label}</div> : null}
      <div style={{ width: '100%', background: '#edf1f7', borderRadius: 999, overflow: 'hidden', height: 12 }}>
        <div style={{ width: `${clamped}%`, background: 'linear-gradient(90deg, #5b6dfc, #7c5cff)', height: '100%' }} />
      </div>
    </div>
  );
}
