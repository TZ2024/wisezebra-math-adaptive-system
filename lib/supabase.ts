import { createClient } from '@supabase/supabase-js';

function hasValue(value?: string | null) {
  return Boolean(value && value.trim());
}

export function hasSupabaseEnv() {
  return hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
    && hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    && hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasValue(url) || !hasValue(anonKey)) return null;
  return createClient(url!, anonKey!);
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasValue(url) || !hasValue(serviceRoleKey)) return null;
  return createClient(url!, serviceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
