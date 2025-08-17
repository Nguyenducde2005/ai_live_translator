from fastapi import APIRouter
from app.api.v1.endpoints import auth, meetings, glossaries

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
api_router.include_router(glossaries.router, prefix="/glossaries", tags=["glossaries"])
