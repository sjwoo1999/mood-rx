-- Mood Rx Database Schema
-- Run this in Supabase SQL Editor

-- Main mood_rx table
create table if not exists mood_rx (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  situation text not null,
  emotion text not null check (emotion in ('anxious','angry','sad','tired','confused')),
  energy smallint not null check (energy between 1 and 5),
  core_reason text not null,
  next_action_24h text not null,
  forbidden_phrase text not null,
  crisis boolean not null default false,
  prompt_version text not null default 'v1',
  card_image_path text null,
  share_token text unique null,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_mood_rx_user_created on mood_rx(user_id, created_at desc);
create index if not exists idx_mood_rx_share_token on mood_rx(share_token);

-- Enable RLS
alter table mood_rx enable row level security;

-- RLS Policies

-- Select: authenticated user can read own rows
create policy "mood_rx_select_own"
on mood_rx for select
using (auth.uid() = user_id);

-- Insert: allow authenticated inserts with user_id=auth.uid(); allow anonymous inserts with user_id IS NULL
create policy "mood_rx_insert_own_or_null"
on mood_rx for insert
with check ( (user_id is null) or (auth.uid() = user_id) );

-- Update: only owner
create policy "mood_rx_update_own"
on mood_rx for update
using (auth.uid() = user_id);

-- Delete: only owner
create policy "mood_rx_delete_own"
on mood_rx for delete
using (auth.uid() = user_id);

-- Rate limits table (for serverless rate limiting)
create table if not exists rate_limits (
  key text primary key,
  count int not null default 0,
  window_start date not null
);

-- RLS for rate_limits - server-only access via service role
-- No policies needed as we access with service role key
alter table rate_limits enable row level security;

-- Storage bucket for card images
-- Run this in Storage section or via API:
-- insert into storage.buckets (id, name, public) values ('rx-cards', 'rx-cards', true);

-- Storage policy for rx-cards bucket (service role only for upload)
-- Public read access for sharing
