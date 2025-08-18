-- Update users table to use UUID
-- This script will convert the existing users table from INTEGER to UUID

-- First, add a new UUID column
ALTER TABLE users ADD COLUMN id_new UUID DEFAULT uuid_generate_v4();

-- Update the new UUID column with unique values
UPDATE users SET id_new = uuid_generate_v4() WHERE id_new IS NULL;

-- Make the new column NOT NULL
ALTER TABLE users ALTER COLUMN id_new SET NOT NULL;

-- Drop the old primary key constraint
ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Drop the old id column
ALTER TABLE users DROP COLUMN id;

-- Rename the new column to id
ALTER TABLE users RENAME COLUMN id_new TO id;

-- Add primary key constraint to the new UUID column
ALTER TABLE users ADD PRIMARY KEY (id);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS users_id_idx ON users(id);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

-- Log successful update
SELECT 'Users table updated to UUID successfully' as status;
