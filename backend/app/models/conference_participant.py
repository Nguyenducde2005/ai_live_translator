from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class ConferenceParticipant(Base):
    __tablename__ = "conference_participants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conference_id = Column(UUID(as_uuid=True), ForeignKey("conferences.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Null for guests
    guest_name = Column(String(100), nullable=False)
    is_host = Column(Boolean, default=False)
    can_speak = Column(Boolean, default=True)
    is_muted = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    conference = relationship("Conference", back_populates="participants")
    user = relationship("User", back_populates="conference_participations")
    translations = relationship("Translation", back_populates="speaker", cascade="all, delete-orphan")
