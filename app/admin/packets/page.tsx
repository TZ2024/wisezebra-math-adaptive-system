import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';
import { getAdminPackets } from '@/lib/server/admin';

export default async function AdminPacketsPage() {
  const packets = await getAdminPackets();

  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Teacher packets" subtitle="Internal packet records generated from completed diagnostics.">
          <div className="grid">
            {packets.map((packet: any) => (
              <div key={packet.id} className="card" style={{ padding: 16 }}>
                <p><strong>Student</strong>: {packet.student_sessions?.student_name || 'Unknown'}</p>
                <p><strong>Session ID</strong>: {packet.student_sessions?.session_code || '—'}</p>
                <p><strong>Profile</strong>: {packet.session_profiles?.overall_wz_level || '—'}</p>
                <p><strong>Subject</strong>: {packet.packet_subject}</p>
                <p><strong>Email status</strong>: {packet.delivery_status}</p>
              </div>
            ))}
            {!packets.length ? <p className="helper">No teacher packets have been generated yet.</p> : null}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
