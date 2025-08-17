-- Initialize GiantyTalk Database
-- This file is executed when PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS public;

-- Set timezone
SET timezone = 'UTC';

-- Log successful initialization
SELECT 'GiantyTalk database initialized successfully' as status;
