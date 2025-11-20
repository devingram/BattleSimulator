-- Enable Realtime for game_rooms if not already enabled (idempotent check not strictly needed if we just run it, but good practice)
-- This script adds columns for the Battle System (Haki/Energy, HP, Hands, Boards)

ALTER TABLE game_rooms 
ADD COLUMN IF NOT EXISTS p1_hp INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS p2_hp INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS p1_energy INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS p2_energy INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS p1_max_energy INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS p2_max_energy INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS p1_hand JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS p2_hand JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS p1_board JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS p2_board JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS p1_deck JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS p2_deck JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS turn_phase TEXT DEFAULT 'draw'; -- 'draw', 'main', 'battle', 'end'

-- Ensure Realtime is enabled for these new columns
-- ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
