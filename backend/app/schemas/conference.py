from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class ConferenceStatus(str, Enum):
    PENDING = "PENDING"
    STARTED = "STARTED"
    PAUSED = "PAUSED"
    ENDED = "ENDED"
    CANCELLED = "CANCELLED"

class ConferenceType(str, Enum):
    INSTANT = "INSTANT"
    SCHEDULED = "SCHEDULED"

class ConferenceBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    type: ConferenceType = Field(default=ConferenceType.SCHEDULED)
    max_participants: int = Field(default=50, ge=1, le=100)
    language_from: str = Field(default="en", max_length=10)
    language_to: str = Field(default="vi", max_length=10)
    scheduled_at: Optional[datetime] = None

class ConferenceCreate(ConferenceBase):
    pass

class ConferenceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    type: Optional[ConferenceType] = None
    is_active: Optional[bool] = None
    status: Optional[ConferenceStatus] = None
    max_participants: Optional[int] = Field(None, ge=1, le=100)
    language_from: Optional[str] = Field(None, max_length=10)
    language_to: Optional[str] = Field(None, max_length=10)
    scheduled_at: Optional[datetime] = None

class ConferenceInDB(ConferenceBase):
    id: UUID
    conference_code: str
    host_id: UUID
    is_active: bool
    status: ConferenceStatus
    type: ConferenceType
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Conference(ConferenceInDB):
    pass

class ConferenceWithParticipants(Conference):
    participant_count: int = 0

class ConferenceList(BaseModel):
    conferences: List[Conference] = []
    total: int
    page: int
    size: int

# New schemas for conference management
class ConferenceStartRequest(BaseModel):
    conference_id: UUID

class ConferencePauseRequest(BaseModel):
    conference_id: UUID

class ConferenceEndRequest(BaseModel):
    conference_id: UUID

class ConferenceResumeRequest(BaseModel):
    conference_id: UUID
