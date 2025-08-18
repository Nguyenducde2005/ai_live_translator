"""recreate_conference_enums

Revision ID: 60e29a2f7742
Revises: 5ebaf9e85611
Create Date: 2025-08-18 05:29:15.184135

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60e29a2f7742'
down_revision = '5ebaf9e85611'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types with correct values (if they don't exist)
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conferencestatus') THEN
                CREATE TYPE conferencestatus AS ENUM ('PENDING', 'STARTED', 'PAUSED', 'ENDED', 'CANCELLED');
            END IF;
        END$$;
        """
    )
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conferencetype') THEN
                CREATE TYPE conferencetype AS ENUM ('INSTANT', 'SCHEDULED');
            END IF;
        END$$;
        """
    )
    
    # Add columns back (if they don't exist)
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS status conferencestatus DEFAULT 'PENDING'")
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS type conferencetype DEFAULT 'SCHEDULED'")
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ NULL")
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ NULL")
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ NULL")
    
    # Make status and type NOT NULL after adding default values
    op.execute("UPDATE conferences SET status = 'PENDING' WHERE status IS NULL")
    op.execute("UPDATE conferences SET type = 'SCHEDULED' WHERE type IS NULL")
    op.execute("ALTER TABLE conferences ALTER COLUMN status SET NOT NULL")
    op.execute("ALTER TABLE conferences ALTER COLUMN type SET NOT NULL")


def downgrade() -> None:
    # Drop columns
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS ended_at")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS started_at")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS scheduled_at")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS type")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS status")
    
    # Drop enum types
    op.execute("DROP TYPE IF EXISTS conferencetype")
    op.execute("DROP TYPE IF EXISTS conferencestatus")
