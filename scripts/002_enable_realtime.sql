-- Enable Realtime for the game_rooms table
-- This is required for the app to receive live updates when the game state changes.

begin;
  -- Check if the publication exists, if not create it (usually exists by default)
  -- Then add the table to the publication
  alter publication supabase_realtime add table game_rooms;
commit;
