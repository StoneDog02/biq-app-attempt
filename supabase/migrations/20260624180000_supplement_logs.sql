-- Phase 4: supplement logging

create type supplement_log_source as enum ('manual', 'plan', 'reminder');

create table public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  checkin_status checkin_status,
  product_id text,
  title text,
  notes text,
  source supplement_log_source not null default 'manual',
  completed_checkin boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index supplement_logs_daily_checkin_unique
  on public.supplement_logs (user_id, log_date)
  where checkin_status is not null;

create index supplement_logs_user_date_idx on public.supplement_logs (user_id, log_date desc);

alter table public.supplement_logs enable row level security;

create policy "Users manage own supplement logs"
  on public.supplement_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
