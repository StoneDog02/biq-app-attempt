-- BODYiQ initial schema

create type engagement_tier as enum ('light', 'moderate', 'high_touch');
create type reminder_preset as enum ('minimal', 'balanced', 'active');
create type habit_type as enum ('water', 'steps', 'stretching');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  engagement_tier engagement_tier not null default 'moderate',
  reminder_preset reminder_preset not null default 'balanced',
  tracking_level smallint not null default 1 check (tracking_level between 1 and 5),
  intake_completed boolean not null default false,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.intake_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  goals jsonb not null default '{}',
  health_history jsonb not null default '{}',
  dietary_prefs jsonb not null default '{}',
  food_likes jsonb not null default '{}',
  lifestyle jsonb not null default '{}',
  activity jsonb not null default '{}',
  current_step integer not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  habits jsonb not null default '[]',
  workouts jsonb not null default '[]',
  meals jsonb not null default '[]',
  supplements jsonb not null default '[]',
  coach_message text,
  created_at timestamptz not null default now(),
  unique (user_id, plan_date)
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_type habit_type not null,
  log_date date not null,
  value numeric not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, habit_type, log_date)
);

create table public.reminder_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  channel text not null default 'push',
  frequency reminder_preset not null default 'balanced',
  quiet_hours_start smallint default 22,
  quiet_hours_end smallint default 7,
  enabled boolean not null default true,
  push_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.intake_responses enable row level security;
alter table public.daily_plans enable row level security;
alter table public.habit_logs enable row level security;
alter table public.reminder_settings enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own intake"
  on public.intake_responses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own daily plans"
  on public.daily_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own habit logs"
  on public.habit_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own reminders"
  on public.reminder_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
