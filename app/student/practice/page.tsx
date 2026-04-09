'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

function PracticeContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';
  const profileId = searchParams.get('profileId') || '';
  const packageType = searchParams.get('packageType') === 'weekly' ? 'weekly' : 'single';
  const paid = searchParams.get('paid') === '1';

  async function downloadPdf() {
    const response = await fetch('/api/pdf/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, profileId, packageType, paid }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      alert(result?.error || 'Could not generate the PDF.');
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wisezebra-practice-${packageType}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container grid">
      <SectionCard
        title={paid ? 'Payment received' : 'Checkout required'}
        subtitle={paid ? 'Now generate the real PDF from the completed diagnostic and selected package.' : 'This page only unlocks after successful payment.'}
      >
        <div className="card" style={{ padding: 20 }}>
          <div className="helper">Session</div>
          <div style={{ fontWeight: 700 }}>{sessionId || 'Missing session'}</div>
          <div className="helper" style={{ marginTop: 12 }}>Package</div>
          <div style={{ fontWeight: 700 }}>{packageType === 'weekly' ? '5 personalized practice sets' : '1 personalized practice set'}</div>
        </div>

        {paid ? (
          <div style={{ marginTop: 16 }}>
            <button className="button" onClick={downloadPdf}>Generate PDF and Download</button>
          </div>
        ) : (
          <p style={{ color: 'var(--danger)', marginTop: 16 }}>Payment is required before PDF generation and download.</p>
        )}
      </SectionCard>
    </div>
  );
}

export default function StudentPracticePage() {
  return (
    <main>
      <SiteHeader />
      <Suspense fallback={<div className="container"><SectionCard title="Loading purchase" subtitle="Preparing the payment result."><div /></SectionCard></div>}>
        <PracticeContent />
      </Suspense>
    </main>
  );
}
