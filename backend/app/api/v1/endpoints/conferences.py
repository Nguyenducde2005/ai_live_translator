from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.conference import (
    ConferenceCreate, 
    ConferenceUpdate, 
    Conference, 
    ConferenceList,
    ConferenceWithParticipants,
    ConferenceStartRequest,
    ConferencePauseRequest,
    ConferenceEndRequest,
    ConferenceResumeRequest
)
from app.services.conference_service import ConferenceService
from app.models.conference import ConferenceType

router = APIRouter()

@router.post("/", response_model=Conference, status_code=status.HTTP_201_CREATED)
def create_conference(
    conference_data: ConferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new conference (authenticated users only)"""
    try:
        conference = ConferenceService.create_conference(
            db=db, 
            conference_data=conference_data, 
            host_id=current_user.id
        )
        return conference
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create conference: {str(e)}"
        )

@router.post("/guest", response_model=Conference, status_code=status.HTTP_201_CREATED)
def create_guest_conference(
    conference_data: ConferenceCreate,
    db: Session = Depends(get_db)
):
    """Create a new conference for guest users (no authentication required)"""
    try:
        # Determine if this is an instant conference based on type field
        is_instant = conference_data.type == ConferenceType.INSTANT
        
        conference = ConferenceService.create_guest_conference(
            db=db, 
            conference_data=conference_data,
            is_instant=is_instant
        )
        return conference
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create conference: {str(e)}"
        )

# Conference Status Management Endpoints
@router.post("/{conference_id}/start", response_model=Conference)
def start_conference(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Start a pending conference"""
    try:
        conference = ConferenceService.start_conference(
            db=db, 
            conference_id=conference_id, 
            host_id=current_user.id
        )
        return conference
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start conference: {str(e)}"
        )

@router.post("/{conference_id}/pause", response_model=Conference)
def pause_conference(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Pause a started conference"""
    try:
        conference = ConferenceService.pause_conference(
            db=db, 
            conference_id=conference_id, 
            host_id=current_user.id
        )
        return conference
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to pause conference: {str(e)}"
        )

@router.post("/{conference_id}/resume", response_model=Conference)
def resume_conference(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Resume a paused conference"""
    try:
        conference = ConferenceService.resume_conference(
            db=db, 
            conference_id=conference_id, 
            host_id=current_user.id
        )
        return conference
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to resume conference: {str(e)}"
        )

@router.post("/{conference_id}/end", response_model=Conference)
def end_conference(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """End a conference"""
    try:
        conference = ConferenceService.end_conference(
            db=db, 
            conference_id=conference_id, 
            host_id=current_user.id
        )
        return conference
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to end conference: {str(e)}"
        )

@router.get("/", response_model=List[ConferenceWithParticipants])
def get_my_conferences(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get conferences where current user is host"""
    conferences = ConferenceService.get_conferences_with_participant_count(
        db=db, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit
    )
    return conferences

@router.get("/stats")
def get_conference_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get conference statistics for current user"""
    stats = ConferenceService.get_conference_stats(db=db, user_id=current_user.id)
    return stats

@router.get("/{conference_id}", response_model=Conference)
def get_conference(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get conference by ID (only host can access)"""
    conference = ConferenceService.get_conference_by_id(db=db, conference_id=conference_id)
    if not conference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found"
        )
    
    if conference.host_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this conference"
        )
    
    return conference

@router.get("/code/{conference_code}", response_model=Conference)
def get_conference_by_code(
    conference_code: str,
    db: Session = Depends(get_db)
):
    """Get conference by conference code (public access)"""
    conference = ConferenceService.get_conference_by_code(db=db, conference_code=conference_code)
    if not conference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found"
        )
    
    if not conference.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conference is not active"
        )
    
    return conference

@router.put("/{conference_id}", response_model=Conference)
def update_conference(
    conference_id: UUID,
    conference_data: ConferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update conference (only host can update)"""
    conference = ConferenceService.update_conference(
        db=db, 
        conference_id=conference_id, 
        conference_data=conference_data, 
        user_id=current_user.id
    )
    
    if not conference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found or not authorized"
        )
    
    return conference

@router.delete("/{conference_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conference(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete conference (only host can delete)"""
    success = ConferenceService.delete_conference(
        db=db, 
        conference_id=conference_id, 
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found or not authorized"
        )
    
    return None

@router.post("/{conference_id}/toggle-status", response_model=Conference)
def toggle_conference_status(
    conference_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Toggle conference active status (only host can toggle)"""
    conference = ConferenceService.get_conference_by_id(db=db, conference_id=conference_id)
    if not conference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found"
        )
    
    if conference.host_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this conference"
        )
    
    conference.is_active = not conference.is_active
    db.commit()
    db.refresh(conference)
    
    return conference
