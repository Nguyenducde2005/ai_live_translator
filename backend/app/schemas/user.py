from pydantic import BaseModel
from pydantic.networks import EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    language_preference: str = "en"
    timezone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    language_preference: Optional[str] = None
    timezone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserInDB(UserBase):
    id: UUID
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True
        from_orm = True

class User(UserInDB):
    pass

class UserLogin(BaseModel):
    email: EmailStr
    password: str
