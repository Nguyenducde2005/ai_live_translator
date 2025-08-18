from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class Translation(Base):
    __tablename__ = "translations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conference_id = Column(UUID(as_uuid=True), ForeignKey("conferences.id"), nullable=False)
    speaker_id = Column(UUID(as_uuid=True), ForeignKey("conference_participants.id"), nullable=False)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text)
    language_from = Column(String(10), nullable=False)
    language_to = Column(String(10), nullable=False)
    translation_status = Column(String(20), default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    conference = relationship("Conference", back_populates="translations")
    speaker = relationship("ConferenceParticipant", back_populates="translations")
