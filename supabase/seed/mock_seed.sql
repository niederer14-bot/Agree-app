-- Example seed content for local dev
insert into circles (id, owner_id, name, note)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Friday Regulars', 'Reliable chaos, excellent opinions'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Family Movie Night', 'Too many vetoes, somehow still fun')
on conflict do nothing;
