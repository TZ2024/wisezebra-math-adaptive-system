'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import type { DomainConfidence, QuestionRecord } from '@/types';

function DiagnosticContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';

  const [question, setQuestion] = useState<QuestionRecord | null>(null);
  const [answered, setAnswered] = useState(0);
  const [maxQuestionCount, setMaxQuestionCount] = useState(18);
  const [liveState, setLiveState] = useState<DomainConfidence[]>([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing diagnostic session. Please start again.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const resultResponse = await fetch(`/api/diagnostic/result?sessionId=${encodeURIComponent(sessionId)}`);
        const resultData = await resultResponse.json().catch(() => null);
        if (resultResponse.ok && resultData?.ok) {
          router.replace(`/student/results?sessionId=${encodeURIComponent(sessionId)}`);
          return;
        }
      } catch {
      }

      try {
        const response = await fetch(`/api/diagnostic/current?sessionId=${encodeURIComponent(sessionId)}`);
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Could not load the diagnostic.');
        if (cancelled) return;
        setQuestion(result.question);
        setAnswered(result.answered);
        setMaxQuestionCount(result.maxQuestionCount);
        setLiveState(result.liveState || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load the diagnostic.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  const progressLabel = useMemo(() => `Question ${answered + 1}`, [answered]);

  async function submitAnswer() {
    if (!response.trim() || !sessionId) return;
    setSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const submitResponse = await fetch('/api/diagnostic/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, response }),
      });

      const result = await submitResponse.json();
      if (!submitResponse.ok || !result.ok) throw new Error(result.error || 'Could not submit the answer.');

      if (result.finished) {
        router.push(`/student/results?sessionId=${encodeURIComponent(sessionId)}`);
        return;
      }

      setQuestion(result.question);
      setAnswered(result.progress?.answered ?? answered + 1);
      setMaxQuestionCount(result.progress?.maxQuestionCount ?? maxQuestionCount);
      setLiveState(result.liveState || []);
      setFeedback('Answer saved. Moving to the next question.');
      setResponse('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the answer.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container"><SectionCard title="Loading diagnostic" subtitle="Preparing the next question."><div /></SectionCard></div>
    );
  }

  return (
    <div className="container grid">
      <SectionCard title="Diagnostic in progress" subtitle="Answer each question. The assessment updates as you go.">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="badge">{progressLabel}</div>
          <div className="helper">{answered} answered, up to {maxQuestionCount} total.</div>
        </div>

        {question ? (
          <>
            <div className="card" style={{ padding: 20, marginTop: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.4 }}>{question.prompt}</div>
            </div>
            <label className="label" style={{ marginTop: 16 }}>Your answer</label>
            <input className="input" placeholder="Type your answer here" value={response} onChange={(event) => setResponse(event.target.value)} />
          </>
        ) : null}

        {feedback ? <p style={{ color: 'var(--success)', marginTop: 16 }}>{feedback}</p> : null}
        {error ? <p style={{ color: 'var(--danger)', marginTop: 16 }}>{error}</p> : null}

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button className="button" onClick={submitAnswer} disabled={submitting || !response.trim() || !question}>
            {submitting ? 'Submitting...' : 'Submit answer'}
          </button>
        </div>

        <div className="card" style={{ padding: 20, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Live assessment state</h3>
          <div className="grid grid-2">
            {liveState.map((item) => (
              <div key={item.domain}>
                <div style={{ fontWeight: 700 }}>{item.domain}</div>
                <div className="helper">{item.correct}/{item.total} correct, confidence {(item.confidence * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export default function DiagnosticPage() {
  return (
    <main>
      <SiteHeader />
      <Suspense fallback={<div className="container"><SectionCard title="Loading diagnostic" subtitle="Preparing the next question."><div /></SectionCard></div>}>
        <DiagnosticContent />
      </Suspense>
    </main>
  );
}
