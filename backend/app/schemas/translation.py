from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class TranslationBase(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    translation_metadata: Optional[Dict[str, Any]] = None

class TranslationCreate(TranslationBase):
    meeting_id: int
    speaker_id: Optional[int] = None

class TranslationInDB(TranslationBase):
    id: int
    meeting_id: int
    speaker_id: Optional[int] = None
    timestamp: datetime

    class Config:
        from_attributes = True
        from_orm = True

class Translation(TranslationInDB):
    pass

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str
    meeting_id: int
