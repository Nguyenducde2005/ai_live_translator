-- Initialize Live Voice Translator Database
-- This file is executed when PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Drop all tables if they exist (for clean start)
DROP TABLE IF EXISTS conference_settings CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS conference_participants CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(500),
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50)
);

-- Create conferences table (rooms for meetings)
CREATE TABLE conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conference_code VARCHAR(15) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    host_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    max_participants INTEGER DEFAULT 50,
    language_from VARCHAR(10) DEFAULT 'en',
    language_to VARCHAR(10) DEFAULT 'vi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create conference_participants table
CREATE TABLE conference_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conference_id UUID REFERENCES conferences(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_name VARCHAR(100) NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    can_speak BOOLEAN DEFAULT TRUE,
    is_muted BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(conference_id, guest_name)
);

-- Create translations table for live voice translation
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conference_id UUID REFERENCES conferences(id) ON DELETE CASCADE,
    speaker_id UUID REFERENCES conference_participants(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    translated_text TEXT,
    language_from VARCHAR(10) NOT NULL,
    language_to VARCHAR(10) NOT NULL,
    translation_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create conference_settings table for additional configuration
CREATE TABLE conference_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conference_id UUID REFERENCES conferences(id) ON DELETE CASCADE,
    auto_translate BOOLEAN DEFAULT TRUE,
    recording_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_conferences_host_id ON conferences(host_id);
CREATE INDEX idx_conferences_code ON conferences(conference_code);
CREATE INDEX idx_conference_participants_conference_id ON conference_participants(conference_id);
CREATE INDEX idx_conference_participants_user_id ON conference_participants(user_id);
CREATE INDEX idx_translations_conference_id ON translations(conference_id);
CREATE INDEX idx_translations_speaker_id ON translations(speaker_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conferences_updated_at BEFORE UPDATE ON conferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conference_settings_updated_at BEFORE UPDATE ON conference_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log successful initialization
SELECT 'Live Voice Translator database initialized successfully' as status;
