alter table public.intake_responses
  add column if not exists nutrition_profile jsonb not null default '{}';
