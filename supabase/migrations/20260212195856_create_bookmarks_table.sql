/*
  # Create Bookmarks Table

  1. New Tables
    - `bookmarks`
      - `id` (uuid, primary key) - Unique identifier for each bookmark
      - `user_id` (uuid, foreign key) - References auth.users, identifies bookmark owner
      - `title` (text, required) - Display name/title of the bookmark
      - `url` (text, required) - The actual URL being bookmarked
      - `created_at` (timestamptz) - Timestamp when bookmark was created

  2. Security
    - Enable Row Level Security (RLS) on `bookmarks` table
    - Add policy "Users can view own bookmarks" for SELECT operations
      - Users can only see bookmarks where user_id matches their auth.uid()
    - Add policy "Users can insert own bookmarks" for INSERT operations
      - Users can only create bookmarks with their own user_id
    - Add policy "Users can delete own bookmarks" for DELETE operations
      - Users can only delete bookmarks where user_id matches their auth.uid()

  3. Indexes
    - Index on user_id for fast lookup of user's bookmarks
    - Index on created_at for chronological sorting

  4. Important Notes
    - All bookmarks are private - users cannot see other users' bookmarks
    - Real-time subscriptions will be filtered by user_id on the client
    - URL validation should be handled on the client side
    - Timestamps use timestamptz for timezone awareness
*/

-- Create the bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);