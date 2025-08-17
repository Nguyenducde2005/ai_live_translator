from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Translation(Base):
    __tablename__ = "translations"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    speaker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    source_language = Column(String, nullable=False)
    target_language = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    translation_metadata = Column(JSON, nullable=True)  # Additional info like confidence, audio timestamp
    
    # Relationships
    meeting = relationship("Meeting", back_populates="translations")
    speaker = relationship("User")
