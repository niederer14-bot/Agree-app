-- AGREE core schema starter
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key,
  display_name text not null,
  first_name text,
  last_name text,
  home_city text,
  created_at timestamptz not null default now()
);

create table if not exists circles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists circle_members (
  circle_id uuid not null references circles(id) on delete cascade,
  profile_id uuid not null,
  joined_at timestamptz not null default now(),
  primary key (circle_id, profile_id)
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  mode text not null check (mode in ('eat', 'watch')),
  host_user_id uuid not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'revealed', 'closed')),
  timer_seconds integer not null default 120,
  seeded_item_id text,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists session_members (
  session_id uuid not null references sessions(id) on delete cascade,
  profile_id uuid not null,
  display_name text not null,
  avatar text not null,
  is_host boolean not null default false,
  has_finished boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (session_id, profile_id)
);

create table if not exists session_candidates (
  session_id uuid not null references sessions(id) on delete cascade,
  item_id text not null,
  item_payload jsonb not null,
  ordinal integer not null,
  primary key (session_id, item_id)
);

create table if not exists swipes (
  session_id uuid not null references sessions(id) on delete cascade,
  item_id text not null,
  profile_id uuid not null,
  value text not null check (value in ('really_want','like','skip','dislike','never')),
  created_at timestamptz not null default now(),
  primary key (session_id, item_id, profile_id)
);

create index if not exists idx_sessions_code on sessions(code);
create index if not exists idx_swipes_session on swipes(session_id);
