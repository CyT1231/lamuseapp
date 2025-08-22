-- SCHEMA for La Muse app
-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  birthday date,
  gender text check (gender in ('male','female','other') or gender is null),
  tier text default 'Member',
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Promotions (publicly visible)
create table if not exists public.promotions (
  id bigserial primary key,
  title text not null,
  subtitle text,
  content text,
  cover_url text,
  start_at date not null,
  end_at date not null,
  visible boolean default true
);
alter table public.promotions enable row level security;
-- Anyone can read visible promotions
create policy "Read visible promotions"
  on public.promotions for select
  using (visible = true);

-- Events (publicly visible)
create table if not exists public.events (
  id bigserial primary key,
  title text not null,
  content text,
  cover_url text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text,
  quota int,
  visible boolean default true
);
alter table public.events enable row level security;
create policy "Read visible events"
  on public.events for select
  using (visible = true);

-- Event registrations (per-user)
create table if not exists public.event_registrations (
  id bigserial primary key,
  event_id bigint references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz default now()
);
alter table public.event_registrations enable row level security;

create policy "Users can view their own registrations"
  on public.event_registrations for select
  using (auth.uid() = user_id);

create policy "Users can create their own registrations"
  on public.event_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update/cancel their own registrations"
  on public.event_registrations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Coupons (issued by admins; users can read their own)
create table if not exists public.coupons (
  id bigserial primary key,
  code text unique not null,
  title text not null,
  description text,
  start_at date not null,
  end_at date not null,
  tier_limit text,
  status text default 'active' check (status in ('active','inactive','expired'))
);
alter table public.coupons enable row level security;
create policy "Coupons readable to all (public list)"
  on public.coupons for select
  using (true);

create table if not exists public.user_coupons (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  coupon_id bigint references public.coupons(id) on delete cascade,
  status text default 'issued' check (status in ('issued','used','expired')),
  used_at timestamptz
);
alter table public.user_coupons enable row level security;

create policy "Users read own user_coupons"
  on public.user_coupons for select
  using (auth.uid() = user_id);

create policy "Users claim coupon (insert for self)"
  on public.user_coupons for insert
  with check (auth.uid() = user_id);

-- Points ledger
create table if not exists public.user_points (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  points int not null,
  reason text,
  created_at timestamptz default now()
);
alter table public.user_points enable row level security;
create policy "Users read their own points"
  on public.user_points for select
  using (auth.uid() = user_id);

-- Admin role helper
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','staff','member')) default 'member'
);
alter table public.user_roles enable row level security;
create policy "Users read their own role"
  on public.user_roles for select
  using (auth.uid() = user_id);
