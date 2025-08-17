from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    room_code = Column(String, unique=True, index=True, nullable=False)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    settings = Column(JSON, nullable=True)  # Meeting settings like language, permissions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    host = relationship("User")
    channel = relationship("Channel")
    participants = relationship("MeetingParticipant", back_populates="meeting")
    translations = relationship("Translation", back_populates="meeting")
