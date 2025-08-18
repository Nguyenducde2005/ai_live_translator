"""add_conference_status_columns

Revision ID: 5ebaf9e85611
Revises: 6d6835c8238d
Create Date: 2025-08-18 05:14:41.760395

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5ebaf9e85611'
down_revision = '6d6835c8238d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure enum type uses lowercase values consistently
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conferencestatus') THEN
                DROP TYPE conferencestatus;
            END IF;
            CREATE TYPE conferencestatus AS ENUM ('pending','started','paused','ended','cancelled');
        END$$;
        """
    )

    # Add status column with default then enforce NOT NULL
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS status conferencestatus DEFAULT 'pending'")
    op.execute("UPDATE conferences SET status = 'pending' WHERE status IS NULL")
    op.execute("ALTER TABLE conferences ALTER COLUMN status SET NOT NULL")

    # Add timing columns
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ NULL")
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ NULL")
    op.execute("ALTER TABLE conferences ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ NULL")


def downgrade() -> None:
    # Drop timing columns and status
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS ended_at")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS started_at")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS scheduled_at")
    op.execute("ALTER TABLE conferences DROP COLUMN IF EXISTS status")

    # Drop enum type if exists
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conferencestatus') THEN
                DROP TYPE conferencestatus;
            END IF;
        END$$;
        """
    )
