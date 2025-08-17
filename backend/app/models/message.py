from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null for guests
    guest_name = Column(String, nullable=True)  # For non-registered users
    content = Column(Text, nullable=False)
    message_type = Column(String, default="text")  # text, translation, system
    message_metadata = Column(JSON, nullable=True)  # Additional message data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    channel = relationship("Channel", back_populates="messages")
    user = relationship("User")
