from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    channel_id: Optional[int] = None
    settings: Optional[Dict[str, Any]] = None

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class MeetingInDB(MeetingBase):
    id: int
    room_code: str
    host_id: int
    is_active: bool
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
        from_orm = True

class Meeting(MeetingInDB):
    pass

class MeetingJoin(BaseModel):
    room_code: str
    participant_name: str
    is_guest: bool = True
