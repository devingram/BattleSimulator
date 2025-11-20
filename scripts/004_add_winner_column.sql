-- Add winner column to game_rooms table
ALTER TABLE game_rooms 
ADD COLUMN IF NOT EXISTS winner INTEGER; -- 1 or 2
