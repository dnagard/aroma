-- ─────────────────────────────────────────────────────────────────────────────
-- 001_initial_schema.sql
-- Tables: roast_sessions, bags, brew_sessions
-- Note: bags ↔ roast_sessions have a circular FK. We create both tables first
-- without the cross-reference, then add it via ALTER TABLE at the end.
-- Enums are stored as text + CHECK constraints (not Postgres enum types) so
-- they can be extended without a migration lock.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── roast_sessions ────────────────────────────────────────────────────────────
-- Created before bags because bags.roast_session_id → roast_sessions.id.
-- generated_bag_id FK → bags is added below after bags is created.

create table roast_sessions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users (id) on delete cascade,

  roasted_at               timestamptz not null default now(),

  -- Green bean provenance
  origin_country           text,
  origin_region            text,
  process                  text check (process in (
                             'washed', 'natural', 'honey',
                             'anaerobic_natural', 'anaerobic_washed',
                             'wet_hulled', 'carbonic_maceration', 'other'
                           )),
  varietal                 text[],
  altitude_masl            integer,

  -- Roast machine / profile
  charge_weight_g          numeric,
  drop_weight_g            numeric,
  charge_temp_c            numeric,
  drop_temp_c              numeric,
  total_time_s             integer,
  first_crack_s            integer,
  roast_level              text check (roast_level in (
                             'light', 'medium_light', 'medium', 'medium_dark', 'dark'
                           )),

  notes                    text,

  -- Lifecycle
  is_complete              boolean not null default false,
  generated_bag_id         uuid,             -- FK added below after bags table exists

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ── bags ──────────────────────────────────────────────────────────────────────

create table bags (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,

  name             text not null,
  roaster          text,

  -- Origin (flat columns — matches raw Supabase query pattern)
  origin_country   text,
  origin_region    text,

  process          text check (process in (
                     'washed', 'natural', 'honey',
                     'anaerobic_natural', 'anaerobic_washed',
                     'wet_hulled', 'carbonic_maceration', 'other'
                   )),
  roast_level      text check (roast_level in (
                     'light', 'medium_light', 'medium', 'medium_dark', 'dark'
                   )),
  roast_date       date,
  varietal         text[],
  altitude_masl    integer,
  flavor_notes     text[] not null default '{}',
  rating           numeric(3,1) check (rating >= 1.0 and rating <= 10.0),
  notes            text,

  -- Home-roast linkage
  is_home_roast    boolean not null default false,
  roast_session_id uuid references roast_sessions (id) on delete set null,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── roast_sessions.generated_bag_id FK (circular reference resolved) ──────────

alter table roast_sessions
  add constraint roast_sessions_generated_bag_id_fkey
  foreign key (generated_bag_id) references bags (id) on delete set null;

-- ── brew_sessions ─────────────────────────────────────────────────────────────

create table brew_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  bag_id           uuid not null references bags (id) on delete cascade,

  brewed_at        timestamptz not null default now(),
  method           text not null check (method in (
                     'espresso', 'v60', 'pour_over', 'aeropress',
                     'french_press', 'chemex', 'moka_pot',
                     'cold_brew', 'siphon', 'kalita', 'other'
                   )),
  grind_size       text,
  dose_grams       numeric,
  out_grams        numeric,
  water_grams      numeric,
  brew_temp_c      numeric,
  brew_time_s      integer,
  flavor_notes     text[] not null default '{}',
  rating           numeric(3,1) check (rating >= 1.0 and rating <= 10.0),
  notes            text,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bags_set_updated_at
  before update on bags
  for each row execute function set_updated_at();

create trigger brew_sessions_set_updated_at
  before update on brew_sessions
  for each row execute function set_updated_at();

create trigger roast_sessions_set_updated_at
  before update on roast_sessions
  for each row execute function set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Bags — common filter columns
create index bags_user_id_idx         on bags (user_id);
create index bags_roast_session_id_idx on bags (roast_session_id);

-- Brew sessions — filter by bag and date range
create index brew_sessions_user_id_idx  on brew_sessions (user_id);
create index brew_sessions_bag_id_idx   on brew_sessions (bag_id);
create index brew_sessions_brewed_at_idx on brew_sessions (brewed_at desc);

-- Roast sessions
create index roast_sessions_user_id_idx on roast_sessions (user_id);

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table bags            enable row level security;
alter table brew_sessions   enable row level security;
alter table roast_sessions  enable row level security;

-- bags
create policy "users can select own bags"
  on bags for select
  using (auth.uid() = user_id);

create policy "users can insert own bags"
  on bags for insert
  with check (auth.uid() = user_id);

create policy "users can update own bags"
  on bags for update
  using (auth.uid() = user_id);

create policy "users can delete own bags"
  on bags for delete
  using (auth.uid() = user_id);

-- brew_sessions
create policy "users can select own brew sessions"
  on brew_sessions for select
  using (auth.uid() = user_id);

create policy "users can insert own brew sessions"
  on brew_sessions for insert
  with check (auth.uid() = user_id);

create policy "users can update own brew sessions"
  on brew_sessions for update
  using (auth.uid() = user_id);

create policy "users can delete own brew sessions"
  on brew_sessions for delete
  using (auth.uid() = user_id);

-- roast_sessions
create policy "users can select own roast sessions"
  on roast_sessions for select
  using (auth.uid() = user_id);

create policy "users can insert own roast sessions"
  on roast_sessions for insert
  with check (auth.uid() = user_id);

create policy "users can update own roast sessions"
  on roast_sessions for update
  using (auth.uid() = user_id);

create policy "users can delete own roast sessions"
  on roast_sessions for delete
  using (auth.uid() = user_id);
