import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

export default function AdminImportPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Question bank import" subtitle="Import externally tagged WZ question bank files. No automatic curriculum tagging.">
          <div className="grid grid-2">
            <div>
              <label className="label">Upload CSV or Excel export</label>
              <input className="input" type="file" />
              <p className="helper">Expected key fields: question_id, prompt, answer, teacher_explanation, wz_level, domain, skill.</p>
            </div>
            <div>
              <label className="label">Import rules</label>
              <ul className="list">
                <li>Preview before import</li>
                <li>Update existing questions by <strong>question_id</strong></li>
                <li>Store all external tags exactly as provided</li>
                <li>Edit tags later in admin</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Preview results example">
          <table className="table-lite">
            <thead>
              <tr><th>question_id</th><th>Action</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>wz-fractions-001</td><td>Insert</td><td>Valid</td></tr>
              <tr><td>wz-placevalue-014</td><td>Update</td><td>Valid</td></tr>
              <tr><td>wz-ratio-011</td><td>Insert</td><td>Missing michigan_standard optional only</td></tr>
            </tbody>
          </table>
        </SectionCard>
      </div>
    </main>
  );
}
