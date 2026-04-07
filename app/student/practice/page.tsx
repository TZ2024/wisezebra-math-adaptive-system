import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

// Internal/support route only. Public flow should purchase directly from the results page.

const plans = [
  {
    name: 'Single Personalized Practice',
    price: '$0.99',
    detail: '1 custom practice set generated from the diagnostic result',
    features: ['Current level focus', 'Targeted review', 'Child-friendly format'],
  },
  {
    name: '5 Practice Pack',
    price: '$2.99',
    detail: '5 custom weekday practice sets, ideal for one week',
    features: ['Daily progression', 'Review + challenge mix', 'Better teacher follow-through'],
  },
];

export default function StudentPracticePage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Choose your practice plan" subtitle="Student-facing purchase options after the diagnostic.">
          <div className="grid grid-2">
            {plans.map((plan) => (
              <div key={plan.name} className="card" style={{ padding: 20 }}>
                <div className="badge">Practice Offer</div>
                <h3>{plan.name}</h3>
                <div className="kpi">{plan.price}</div>
                <p className="helper">{plan.detail}</p>
                <ul className="list">
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <button className="button" style={{ marginTop: 16 }}>Select this plan</button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
