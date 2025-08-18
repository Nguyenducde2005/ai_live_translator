import random
import string
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.conference import Conference, ConferenceStatus, ConferenceType
from app.models.conference_participant import ConferenceParticipant
from app.models.conference_settings import ConferenceSettings
from app.schemas.conference import ConferenceCreate, ConferenceUpdate
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone

class ConferenceService:
    
    @staticmethod
    def generate_conference_code() -> str:
        """Generate unique conference code in format: xxx-xxxx-xxx"""
        while True:
            # Generate 3-4-3 format: cqx-jhyz-ive
            part1 = ''.join(random.choices(string.ascii_lowercase, k=3))
            part2 = ''.join(random.choices(string.ascii_lowercase, k=4))
            part3 = ''.join(random.choices(string.ascii_lowercase, k=3))
            code = f"{part1}-{part2}-{part3}"
            
            # Check if code already exists
            return code
    
    @staticmethod
    def check_host_has_live_conference(db: Session, host_id: UUID) -> Optional[Conference]:
        """Check if host already has a live conference (STARTED or PAUSED)"""
        return db.query(Conference).filter(
            and_(
                Conference.host_id == host_id,
                Conference.status.in_([ConferenceStatus.STARTED, ConferenceStatus.PAUSED])
            )
        ).first()
    
    @staticmethod
    def create_conference(db: Session, conference_data: ConferenceCreate, host_id: UUID) -> Conference:
        """Create a new conference. If type is INSTANT, start immediately."""
        # Determine intent
        is_instant = conference_data.type == ConferenceType.INSTANT

        # Check if host already has a live conference
        live_conference = ConferenceService.check_host_has_live_conference(db, host_id)
        # Only block if creating INSTANT while already having a live one
        if is_instant and live_conference:
            # Include some human-friendly info for frontend
            raise ValueError(
                f"Host already has a live conference: {getattr(live_conference, 'title', 'Untitled')} ({live_conference.conference_code})"
            )
        
        # Generate unique conference code
        conference_code = ConferenceService.generate_conference_code()
        
        # Determine initial status based on type
        # If scheduled, create as PENDING and do not start
        initial_status = ConferenceStatus.STARTED if is_instant else ConferenceStatus.PENDING
        started_at = datetime.now(timezone.utc) if is_instant else None

        # Create conference
        db_conference = Conference(
            conference_code=conference_code,
            title=conference_data.title,
            description=conference_data.description,
            host_id=host_id,
            status=initial_status,
            type=conference_data.type,
            scheduled_at=conference_data.scheduled_at,
            started_at=started_at,
            max_participants=conference_data.max_participants,
            language_from=conference_data.language_from,
            language_to=conference_data.language_to
        )
        
        db.add(db_conference)
        db.commit()
        db.refresh(db_conference)
        
        # Create default conference settings
        default_settings = ConferenceSettings(
            conference_id=db_conference.id,
            auto_translate=True,
            recording_enabled=False
        )
        db.add(default_settings)
        
        # Add host as first participant with proper display name
        try:
            from app.models.user import User
            host_user = db.query(User).filter(User.id == host_id).first()
            host_name = None
            if host_user:
                host_name = host_user.full_name or host_user.username or (host_user.email.split('@')[0] if host_user.email else None)
            if not host_name:
                host_name = "Host"
        except Exception:
            host_name = "Host"

        host_participant = ConferenceParticipant(
            conference_id=db_conference.id,
            user_id=host_id,
            guest_name=host_name,
            is_host=True,
            can_speak=True,
            is_muted=False
        )
        db.add(host_participant)
        
        db.commit()
        db.refresh(db_conference)
        
        return db_conference
    
    @staticmethod
    def create_guest_conference(db: Session, conference_data: ConferenceCreate, is_instant: bool = False) -> Conference:
        """Create a new conference for guest users (no authentication required)"""
        # Generate unique conference code
        conference_code = ConferenceService.generate_conference_code()
        
        # Create a temporary guest user for the conference
        from app.models.user import User
        import uuid
        
        # Create a guest user with a unique email
        guest_user = User(
            email=f"guest_{uuid.uuid4().hex[:8]}@guest.com",
            username=f"guest_{uuid.uuid4().hex[:8]}",
            full_name="Guest User",
            hashed_password="",  # No password for guest users
            is_active=True,
            is_superuser=False
        )
        db.add(guest_user)
        db.flush()  # Get the ID without committing
        
        # Set status and type based on whether it's instant or scheduled
        status = ConferenceStatus.STARTED if is_instant else ConferenceStatus.PENDING
        conference_type = ConferenceType.INSTANT if is_instant else ConferenceType.SCHEDULED
        started_at = datetime.now(timezone.utc) if is_instant else None
        
        # Create conference
        db_conference = Conference(
            conference_code=conference_code,
            title=conference_data.title,
            description=conference_data.description,
            host_id=guest_user.id,
            status=status,
            type=conference_type,
            scheduled_at=conference_data.scheduled_at,
            started_at=started_at,
            max_participants=conference_data.max_participants,
            language_from=conference_data.language_from,
            language_to=conference_data.language_to
        )
        
        db.add(db_conference)
        db.commit()
        db.refresh(db_conference)
        
        # Create default conference settings
        default_settings = ConferenceSettings(
            conference_id=db_conference.id,
            auto_translate=True,
            recording_enabled=False
        )
        db.add(default_settings)
        
        # Add guest host as first participant
        guest_host_participant = ConferenceParticipant(
            conference_id=db_conference.id,
            user_id=guest_user.id,
            guest_name="Guest Host",
            is_host=True,
            can_speak=True,
            is_muted=False
        )
        db.add(guest_host_participant)
        
        db.commit()
        db.refresh(db_conference)
        
        return db_conference
    
    @staticmethod
    def start_conference(db: Session, conference_id: UUID, host_id: UUID) -> Conference:
        """Start a pending conference"""
        conference = db.query(Conference).filter(
            and_(Conference.id == conference_id, Conference.host_id == host_id)
        ).first()
        
        if not conference:
            raise ValueError("Conference not found or not authorized")
        
        if conference.status != ConferenceStatus.PENDING:
            raise ValueError(f"Cannot start conference with status: {conference.status}")
        
        # Check if host already has a live conference
        live_conference = ConferenceService.check_host_has_live_conference(db, host_id)
        if live_conference and live_conference.id != conference_id:
            raise ValueError(f"Host already has a live conference: {live_conference.conference_code}")
        
        # Start the conference
        conference.status = ConferenceStatus.STARTED
        conference.started_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(conference)
        
        return conference
    
    @staticmethod
    def pause_conference(db: Session, conference_id: UUID, host_id: UUID) -> Conference:
        """Pause a started conference"""
        conference = db.query(Conference).filter(
            and_(Conference.id == conference_id, Conference.host_id == host_id)
        ).first()
        
        if not conference:
            raise ValueError("Conference not found or not authorized")
        
        if conference.status != ConferenceStatus.STARTED:
            raise ValueError(f"Cannot pause conference with status: {conference.status}")
        
        conference.status = ConferenceStatus.PAUSED
        db.commit()
        db.refresh(conference)
        
        return conference
    
    @staticmethod
    def resume_conference(db: Session, conference_id: UUID, host_id: UUID) -> Conference:
        """Resume a paused conference"""
        conference = db.query(Conference).filter(
            and_(Conference.id == conference_id, Conference.host_id == host_id)
        ).first()
        
        if not conference:
            raise ValueError("Conference not found or not authorized")
        
        if conference.status != ConferenceStatus.PAUSED:
            raise ValueError(f"Cannot resume conference with status: {conference.status}")
        
        conference.status = ConferenceStatus.STARTED
        db.commit()
        db.refresh(conference)
        
        return conference
    
    @staticmethod
    def end_conference(db: Session, conference_id: UUID, host_id: UUID) -> Conference:
        """End a conference (STARTED or PAUSED)"""
        conference = db.query(Conference).filter(
            and_(Conference.id == conference_id, Conference.host_id == host_id)
        ).first()
        
        if not conference:
            raise ValueError("Conference not found or not authorized")
        
        if conference.status not in [ConferenceStatus.STARTED, ConferenceStatus.PAUSED]:
            raise ValueError(f"Cannot end conference with status: {conference.status}")
        
        conference.status = ConferenceStatus.ENDED
        conference.ended_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(conference)
        
        return conference
    
    @staticmethod
    def get_conference_by_code(db: Session, conference_code: str) -> Optional[Conference]:
        """Get conference by conference code"""
        return db.query(Conference).filter(Conference.conference_code == conference_code).first()
    
    @staticmethod
    def get_conference_by_id(db: Session, conference_id: UUID) -> Optional[Conference]:
        """Get conference by ID"""
        return db.query(Conference).filter(Conference.id == conference_id).first()
    
    @staticmethod
    def get_user_conferences(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Conference]:
        """Get conferences where user is host"""
        return db.query(Conference).filter(
            Conference.host_id == user_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_conferences_with_participant_count(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
        """Get conferences with participant count"""
        conferences = db.query(Conference).filter(
            Conference.host_id == user_id
        ).offset(skip).limit(limit).all()
        
        result = []
        for conference in conferences:
            participant_count = db.query(ConferenceParticipant).filter(
                ConferenceParticipant.conference_id == conference.id,
                ConferenceParticipant.left_at.is_(None)
            ).count()
            
            result.append({
                **conference.__dict__,
                'participant_count': participant_count
            })
        
        return result
    
    @staticmethod
    def update_conference(db: Session, conference_id: UUID, conference_data: ConferenceUpdate, user_id: UUID) -> Optional[Conference]:
        """Update conference (only host can update)"""
        conference = db.query(Conference).filter(
            and_(Conference.id == conference_id, Conference.host_id == user_id)
        ).first()
        
        if not conference:
            return None
        
        update_data = conference_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(conference, field, value)
        
        db.commit()
        db.refresh(conference)
        return conference
    
    @staticmethod
    def delete_conference(db: Session, conference_id: UUID, user_id: UUID) -> bool:
        """Delete conference (only host can delete)"""
        conference = db.query(Conference).filter(
            and_(Conference.id == conference_id, Conference.host_id == user_id)
        ).first()
        
        if not conference:
            return False
        
        db.delete(conference)
        db.commit()
        return True
    
    @staticmethod
    def get_conference_stats(db: Session, user_id: UUID) -> dict:
        """Get conference statistics for user"""
        total_conferences = db.query(Conference).filter(Conference.host_id == user_id).count()
        active_conferences = db.query(Conference).filter(
            and_(Conference.host_id == user_id, Conference.is_active == True)
        ).count()
        
        # Get total participants across all user's conferences
        total_participants = db.query(ConferenceParticipant).join(Conference).filter(
            Conference.host_id == user_id,
            ConferenceParticipant.left_at.is_(None)
        ).count()
        
        return {
            "total_conferences": total_conferences,
            "active_conferences": active_conferences,
            "total_participants": total_participants
        }
