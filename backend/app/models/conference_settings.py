from sqlalchemy import Column, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class ConferenceSettings(Base):
    __tablename__ = "conference_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conference_id = Column(UUID(as_uuid=True), ForeignKey("conferences.id"), nullable=False)
    auto_translate = Column(Boolean, default=True)
    recording_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    conference = relationship("Conference", back_populates="settings")
