-- Meeting room reservation system initial schema
-- NOTE: Single migration file as requested. RLS is disabled for simplicity.

-- Create schema objects
create table if not exists public.meeting_rooms (
  id bigserial primary key,
  name text not null,
  location text,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now()
);

-- RLS disabled explicitly (Supabase enables RLS by default on new tables)
alter table public.meeting_rooms disable row level security;

create table if not exists public.reservations (
  id bigserial primary key,
  room_id bigint not null references public.meeting_rooms(id) on delete cascade,
  user_name text not null,
  user_phone text not null,
  password text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  created_at timestamptz not null default now(),
  constraint reservations_time_chk check (end_time > start_time)
);

-- Helpful indexes
create index if not exists idx_reservations_room_time on public.reservations (room_id, start_time);
create index if not exists idx_reservations_phone on public.reservations (user_phone);

-- RLS disabled explicitly
alter table public.reservations disable row level security;

-- DUMMY DATA FOR meeting_rooms
insert into public.meeting_rooms (name, location, capacity) values
('급식룸', '2층 서측', 10),
('나폴리룸', '3층 남측', 4),
('돌아이룸', '1층 동측', 6)
on conflict do nothing;

-- DUMMY DATA FOR reservations (FOR TESTING)
-- NOTE: Adjust timestamps as needed for testing. Examples below assume Asia/Seoul (KST).
-- Replace dates to match your current test day.
-- insert into public.reservations (room_id, user_name, user_phone, password, start_time, end_time)
-- values
--   (1, '홍길동', '010-1234-5678', '1234', '2025-09-10 10:00:00+09', '2025-09-10 11:00:00+09'),
--   (2, '김영희', '010-9876-5432', '5678', '2025-09-10 14:00:00+09', '2025-09-10 15:00:00+09');


