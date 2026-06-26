-- Phase 4: longevity lab reports

create type lab_report_status as enum ('pending', 'ready');

create table public.lab_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_date date not null,
  title text not null,
  status lab_report_status not null default 'pending',
  summary_json jsonb not null default '{}',
  file_path text,
  created_at timestamptz not null default now()
);

create index lab_reports_user_date_idx on public.lab_reports (user_id, report_date desc);

alter table public.lab_reports enable row level security;

create policy "Users manage own lab reports"
  on public.lab_reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
