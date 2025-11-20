-- Create game_rooms table for multiplayer drafts
create table if not exists public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'waiting', -- waiting, in_progress, completed
  current_turn integer not null default 1, -- 1 or 2
  current_character jsonb,
  reroll_available boolean not null default false,
  player1_id text,
  player2_id text,
  team1 jsonb not null default '[]'::jsonb,
  team2 jsonb not null default '[]'::jsonb,
  draft_history jsonb not null default '[]'::jsonb,
  used_character_ids text[] not null default '{}'::text[]
);

alter table public.game_rooms enable row level security;

-- Anyone can create a room
create policy "game_rooms_insert"
  on public.game_rooms for insert
  with check (true);

-- Anyone can view rooms
create policy "game_rooms_select"
  on public.game_rooms for select
  using (true);

-- Players in the room can update it
create policy "game_rooms_update"
  on public.game_rooms for update
  using (true);

-- Players in the room can delete it
create policy "game_rooms_delete"
  on public.game_rooms for delete
  using (true);
