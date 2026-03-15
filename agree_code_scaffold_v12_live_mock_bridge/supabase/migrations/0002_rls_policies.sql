-- Starter RLS policies. Tighten once auth flow is finalized.
alter table profiles enable row level security;
alter table circles enable row level security;
alter table circle_members enable row level security;
alter table sessions enable row level security;
alter table session_members enable row level security;
alter table session_candidates enable row level security;
alter table swipes enable row level security;

drop policy if exists profiles_read_own on profiles;
create policy profiles_read_own on profiles for select using (auth.uid() = id);

drop policy if exists profiles_upsert_own on profiles;
create policy profiles_upsert_own on profiles for insert with check (auth.uid() = id);

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles for update using (auth.uid() = id);

drop policy if exists sessions_read_members on sessions;
create policy sessions_read_members on sessions for select using (
  exists (select 1 from session_members sm where sm.session_id = sessions.id and sm.profile_id = auth.uid())
);

drop policy if exists sessions_insert_host on sessions;
create policy sessions_insert_host on sessions for insert with check (auth.uid() = host_user_id);

drop policy if exists session_members_read_own_sessions on session_members;
create policy session_members_read_own_sessions on session_members for select using (
  profile_id = auth.uid() or exists (
    select 1 from session_members me where me.session_id = session_members.session_id and me.profile_id = auth.uid()
  )
);

drop policy if exists swipes_manage_own on swipes;
create policy swipes_manage_own on swipes for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
