create extension if not exists pgcrypto;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  external_key text unique,
  prompt text not null,
  answer text not null,
  teacher_explanation text not null,
  common_errors text[] not null default '{}',
  hints text[] not null default '{}',
  wz_level text not null,
  domain text not null,
  skill text not null,
  michigan_standard text,
  kumon_reference text,
  difficulty integer not null default 3,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists question_tags (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  tag_type text not null,
  tag_value text not null,
  created_at timestamptz not null default now()
);

create table if not exists student_sessions (
  id uuid primary key default gen_random_uuid(),
  session_code text unique not null,
  student_name text not null,
  parent_email text,
  mode text not null default 'guest',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress',
  max_question_count integer not null default 18
);

create table if not exists session_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references student_sessions(id) on delete cascade,
  question_id uuid not null references questions(id),
  student_response text,
  is_correct boolean not null,
  domain text not null,
  skill text not null,
  wz_level text not null,
  created_at timestamptz not null default now()
);

create table if not exists session_profiles (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references student_sessions(id) on delete cascade,
  overall_wz_level text not null,
  strengths jsonb not null default '[]'::jsonb,
  support_areas jsonb not null default '[]'::jsonb,
  recommended_next_practice jsonb not null default '[]'::jsonb,
  domain_confidence jsonb not null default '[]'::jsonb,
  stopped_reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists practice_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references student_sessions(id) on delete cascade,
  profile_id uuid not null references session_profiles(id) on delete cascade,
  current_mix_pct integer not null default 60,
  review_mix_pct integer not null default 25,
  challenge_mix_pct integer not null default 15,
  created_at timestamptz not null default now()
);

create table if not exists practice_items (
  id uuid primary key default gen_random_uuid(),
  practice_set_id uuid not null references practice_sets(id) on delete cascade,
  question_id uuid not null references questions(id),
  bucket text not null,
  sort_order integer not null default 0
);

create table if not exists teacher_packets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references student_sessions(id) on delete cascade,
  profile_id uuid not null references session_profiles(id) on delete cascade,
  practice_set_id uuid references practice_sets(id) on delete set null,
  parent_email text,
  packet_subject text not null,
  packet_body text not null,
  delivery_status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
