from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
import enum

class ConferenceStatus(str, enum.Enum):
    PENDING = "PENDING"      # Đã tạo, chưa bắt đầu
    STARTED = "STARTED"      # Đang diễn ra
    PAUSED = "PAUSED"       # Tạm dừng
    ENDED = "ENDED"         # Đã kết thúc
    CANCELLED = "CANCELLED"  # Đã hủy

class ConferenceType(str, enum.Enum):
    INSTANT = "INSTANT"      # Dùng ngay
    SCHEDULED = "SCHEDULED"  # Dùng sau

class Conference(Base):
    __tablename__ = "conferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conference_code = Column(String(15), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    host_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    status = Column(Enum(ConferenceStatus), default=ConferenceStatus.PENDING, nullable=False)
    type = Column(Enum(ConferenceType), default=ConferenceType.SCHEDULED, nullable=False)
    max_participants = Column(Integer, default=50)
    language_from = Column(String(10), default="en")
    language_to = Column(String(10), default="vi")
    scheduled_at = Column(DateTime(timezone=True), nullable=True)  # Thời gian dự kiến bắt đầu
    started_at = Column(DateTime(timezone=True), nullable=True)    # Thời gian thực tế bắt đầu
    ended_at = Column(DateTime(timezone=True), nullable=True)     # Thời gian kết thúc
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    host = relationship("User", back_populates="hosted_conferences")
    participants = relationship("ConferenceParticipant", back_populates="conference", cascade="all, delete-orphan")
    translations = relationship("Translation", back_populates="conference", cascade="all, delete-orphan")
    settings = relationship("ConferenceSettings", back_populates="conference", uselist=False, cascade="all, delete-orphan")
