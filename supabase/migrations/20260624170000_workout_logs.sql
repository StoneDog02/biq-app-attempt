-- Phase 3: workout logging

create type workout_type as enum ('strength', 'cardio', 'mobility', 'sport', 'other');

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  checkin_status checkin_status,
  workout_type workout_type,
  title text,
  duration_minutes numeric,
  notes text,
  source text not null default 'manual' check (source in ('manual', 'program', 'healthkit')),
  completed_checkin boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index workout_logs_daily_checkin_unique
  on public.workout_logs (user_id, log_date)
  where checkin_status is not null;

create index workout_logs_user_date_idx on public.workout_logs (user_id, log_date desc);

alter table public.workout_logs enable row level security;

create policy "Users manage own workout logs"
  on public.workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
