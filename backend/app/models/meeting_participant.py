from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MeetingParticipant(Base):
    __tablename__ = "meeting_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for guests
    guest_name = Column(String, nullable=True)  # For non-registered users
    is_host = Column(Boolean, default=False)
    is_muted = Column(Boolean, default=False)
    is_speaking = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)
    settings = Column(JSON, nullable=True)  # User-specific meeting settings
    
    # Relationships
    meeting = relationship("Meeting", back_populates="participants")
    user = relationship("User")
