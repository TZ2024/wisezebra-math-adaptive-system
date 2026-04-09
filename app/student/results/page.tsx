'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import type { PracticePackageType, SessionProfile } from '@/types';

type ResultPayload = {
  session: {
    id: string;
    sessionCode: string;
    studentName: string;
    parentEmail: string | null;
  };
  profile: SessionProfile;
  profileId: string;
};

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';

  const [data, setData] = useState<ResultPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<PracticePackageType | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing diagnostic session. Please start again.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadResult() {
      try {
        const response = await fetch(`/api/diagnostic/result?sessionId=${encodeURIComponent(sessionId)}`);
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Could not load the diagnostic result.');
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load the diagnostic result.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResult();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function continueToCheckout(packageType: PracticePackageType) {
    if (!data) return;
    setPurchasing(packageType);
    setError(null);

    try {
      const response = await fetch('/api/practice/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: data.session.id,
          profileId: data.profileId,
          packageType,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Could not start checkout.');

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      throw new Error('Checkout URL was not returned.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout.');
    } finally {
      setPurchasing(null);
    }
  }

  if (loading) {
    return <div className="container"><SectionCard title="Loading result" subtitle="Pulling the completed diagnostic."><div /></SectionCard></div>;
  }

  if (!data) {
    return <div className="container"><SectionCard title="Result unavailable" subtitle={error || 'No completed diagnostic found yet.'}><div /></SectionCard></div>;
  }

  return (
    <div className="container grid">
      <SectionCard title="Your diagnostic result" subtitle="This result comes from the student’s submitted answers.">
        <div className="grid grid-2">
          <div>
            <div className="helper">Student</div>
            <div style={{ fontWeight: 700, fontSize: 22 }}>{data.session.studentName}</div>
            <div className="helper" style={{ marginTop: 10 }}>Current WiseZebra level</div>
            <div className="kpi">{data.profile.overallLevel}</div>
          </div>
          <div>
            <div className="helper">Recommended next step</div>
            <div style={{ fontWeight: 700 }}>Continue with targeted practice based on the completed diagnostic, with review and challenge mixed in.</div>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <div>
            <h3>Strengths</h3>
            <ul className="list">{data.profile.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Support areas</h3>
            <ul className="list">{data.profile.supportAreas.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Recommended next practice</h3>
            <ul className="list">{data.profile.recommendedNextPractice.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Choose your practice package" subtitle="Payment comes first. PDF generation happens only after successful checkout.">
        <div className="grid grid-2">
          <div className="card" style={{ padding: 20 }}>
            <div className="badge">Quick start</div>
            <h3>1 personalized practice set</h3>
            <div className="kpi">$0.99</div>
            <p className="helper">One targeted printable set based on the completed diagnostic.</p>
            <button className="button" style={{ marginTop: 16 }} onClick={() => continueToCheckout('single')} disabled={purchasing !== null}>
              {purchasing === 'single' ? 'Redirecting...' : 'Continue to Checkout'}
            </button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="badge">Best value</div>
            <h3>5 personalized practice sets</h3>
            <div className="kpi">$2.99</div>
            <p className="helper">A weekday pack of personalized printable practice.</p>
            <button className="button" style={{ marginTop: 16 }} onClick={() => continueToCheckout('weekly')} disabled={purchasing !== null}>
              {purchasing === 'weekly' ? 'Redirecting...' : 'Continue to Checkout'}
            </button>
          </div>
        </div>
        <div className="card" style={{ padding: 20, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Real purchase flow</h3>
          <ol className="list">
            <li>Review completed diagnostic result</li>
            <li>Choose package</li>
            <li>Stripe Checkout</li>
            <li>Payment success</li>
            <li>Generate PDF</li>
            <li>Download PDF</li>
          </ol>
        </div>
        {error ? <p style={{ color: 'var(--danger)', marginTop: 16 }}>{error}</p> : null}
        <div style={{ marginTop: 16 }}>
          <button className="button secondary" onClick={() => router.push('/student/start')}>Start another diagnostic</button>
        </div>
      </SectionCard>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main>
      <SiteHeader />
      <Suspense fallback={<div className="container"><SectionCard title="Loading result" subtitle="Pulling the completed diagnostic."><div /></SectionCard></div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
