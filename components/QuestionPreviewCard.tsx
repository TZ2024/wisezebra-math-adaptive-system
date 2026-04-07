export function QuestionPreviewCard({ prompt, meta }: { prompt: string; meta: string }) {
  return (
    <div className="card" style={{ padding: 18, borderRadius: 18 }}>
      <div className="badge" style={{ marginBottom: 10 }}>Question Preview</div>
      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.5 }}>{prompt}</div>
      <div className="helper" style={{ marginTop: 10 }}>{meta}</div>
    </div>
  );
}
