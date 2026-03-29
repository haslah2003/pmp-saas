-- ═══════════════════════════════════════════════════════════════
-- PMP Expert Tutor — Database Schema
-- Run this in Supabase SQL Editor after creating your project
-- ═══════════════════════════════════════════════════════════════

-- 1. Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null default 'free' check (plan in ('free', 'monthly', 'quarterly', 'annual')),
  status text not null default 'inactive' check (status in ('active', 'inactive', 'cancelled', 'past_due')),
  paypal_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create free subscription for new profiles
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- 3. Learning Progress
create table public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic_id text not null,
  topic_label text not null,
  notes_read boolean default false,
  audio_played boolean default false,
  flashcards_done boolean default false,
  quiz_score integer,
  quiz_total integer,
  updated_at timestamptz default now(),
  unique(user_id, topic_id)
);

-- 4. Usage Limits (free tier rate limiting)
create table public.usage_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  ai_messages integer default 0,
  practice_questions integer default 0,
  audio_generations integer default 0,
  unique(user_id, date)
);

-- 5. Chat History
create table public.chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.progress enable row level security;
alter table public.usage_limits enable row level security;
alter table public.chat_history enable row level security;

-- Profiles: users can only read/update their own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Subscriptions: users can only read their own
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- Progress: users can CRUD their own
create policy "Users can view own progress" on public.progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.progress for update using (auth.uid() = user_id);

-- Usage limits: users can read/update their own
create policy "Users can view own usage" on public.usage_limits for select using (auth.uid() = user_id);
create policy "Users can insert own usage" on public.usage_limits for insert with check (auth.uid() = user_id);
create policy "Users can update own usage" on public.usage_limits for update using (auth.uid() = user_id);

-- Chat history: users can CRUD their own
create policy "Users can view own chats" on public.chat_history for select using (auth.uid() = user_id);
create policy "Users can insert own chats" on public.chat_history for insert with check (auth.uid() = user_id);
create policy "Users can update own chats" on public.chat_history for update using (auth.uid() = user_id);
create policy "Users can delete own chats" on public.chat_history for delete using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════

create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_progress_user on public.progress(user_id);
create index idx_usage_user_date on public.usage_limits(user_id, date);
create index idx_chat_user on public.chat_history(user_id);
