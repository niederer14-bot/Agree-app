create table if not exists public.session_swipes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  item_id text not null,
  swipe_value text not null check (swipe_value in ('like','dislike','really_want','never','skip')),
  created_at timestamptz not null default now(),
  unique (session_id, user_id, item_id)
);

create table if not exists public.session_results (
  session_id uuid primary key references public.sessions(id) on delete cascade,
  winner_item_id text,
  backup_item_id text,
  really_want_count integer not null default 0,
  scores jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.session_swipes enable row level security;
alter table public.session_results enable row level security;
