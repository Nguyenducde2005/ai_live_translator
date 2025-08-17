from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class ChannelParticipant(Base):
    __tablename__ = "channel_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for guests
    guest_name = Column(String, nullable=True)  # For non-registered users
    is_online = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    channel = relationship("Channel", back_populates="participants")
    user = relationship("User")
