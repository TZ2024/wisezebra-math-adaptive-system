import { SiteHeader } from '@/components/SiteHeader';
import { SectionCard } from '@/components/SectionCard';

export default function AdminLoginPage() {
  return (
    <main>
      <SiteHeader />
      <div className="container grid">
        <SectionCard title="Admin login" subtitle="Internal access only.">
          <label className="label">Admin email</label>
          <input className="input" placeholder="wisezebrami@gmail.com" />
          <label className="label" style={{ marginTop: 12 }}>Password</label>
          <input className="input" type="password" placeholder="Enter password" />
          <button className="button" style={{ marginTop: 16 }}>Log in</button>
          <p className="helper" style={{ marginTop: 12 }}>This is the foundation shell for admin gating. Later we can wire real auth with Supabase.</p>
        </SectionCard>
      </div>
    </main>
  );
}
