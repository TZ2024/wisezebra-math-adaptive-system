import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { ProgressBar } from '@/components/ProgressBar';

const domainRows = [
  ['Number and Place Value', 84],
  ['Operations and Fluency', 82],
  ['Fractions, Decimals, Measurement, and Ratio', 73],
  ['Geometry, Data, and Word Problems', 79],
  ['Signed Numbers and Prealgebra Bridge', 68],
] as const;

export default function TeacherReportPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Teacher diagnostic report" subtitle="Internal view only. This is the version emailed to wisezebrami@gmail.com.">
          <div className="grid grid-2">
            <div>
              <p><strong>Student</strong>: Ava</p>
              <p><strong>Session ID</strong>: demo-001</p>
              <p><strong>Overall placement</strong>: WZ 10</p>
              <p><strong>Teacher delivery</strong>: wisezebrami@gmail.com</p>
            </div>
            <div>
              <p><strong>Placement reasoning</strong>: consistent success in operations and geometry, mixed confidence in fractions, lower confidence in bridge concepts.</p>
              <p><strong>Recommendation</strong>: assign one core practice set first, then bridge reinforcement midweek.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Domain confidence">
          <div className="grid">
            {domainRows.map(([label, value]) => (
              <ProgressBar key={label} label={label} value={value} />
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-2">
          <SectionCard title="Common errors and hints">
            <ul className="list">
              <li>Fractions: student tried to add numerators and denominators directly.</li>
              <li>Signed numbers: comparison improved when number line support was added.</li>
              <li>Ratios: needs one-step unit rate framing before multi-step word problems.</li>
            </ul>
          </SectionCard>
          <SectionCard title="Suggested teaching notes">
            <ul className="list">
              <li>Use visual models before symbolic fraction work.</li>
              <li>Bridge from multiplication fluency into ratio language.</li>
              <li>Introduce negative numbers with real-world temperature and elevation contexts.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
