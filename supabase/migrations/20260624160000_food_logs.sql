-- Phase 2: food logging

create type meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');
create type checkin_status as enum ('on_plan', 'mostly', 'off_plan');

create table public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  meal_type meal_type,
  checkin_status checkin_status,
  name text,
  calories numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  source text not null default 'manual' check (source in ('manual', 'barcode', 'photo', 'voice')),
  completed_checkin boolean not null default false,
  created_at timestamptz not null default now()
);

-- One Level 1 daily check-in per user per day
create unique index food_logs_daily_checkin_unique
  on public.food_logs (user_id, log_date)
  where checkin_status is not null;

create index food_logs_user_date_idx on public.food_logs (user_id, log_date desc);

alter table public.food_logs enable row level security;

create policy "Users manage own food logs"
  on public.food_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
