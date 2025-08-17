from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import json
import secrets
from typing import List
from app.core.database import get_db
from app.models.meeting import Meeting
from app.models.user import User
from app.schemas.meeting import MeetingCreate, Meeting as MeetingSchema, MeetingUpdate, MeetingJoin
from app.api.deps import get_current_active_user

router = APIRouter()

# Store active WebSocket connections
active_connections: dict = {}

@router.post("/", response_model=MeetingSchema)
def create_meeting(
    meeting: MeetingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Generate unique room code
    room_code = secrets.token_urlsafe(8).upper()
    
    db_meeting = Meeting(
        **meeting.model_dump(),
        host_id=current_user.id,
        room_code=room_code
    )
    
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    
    return db_meeting

@router.get("/", response_model=List[MeetingSchema])
def get_meetings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    meetings = db.query(Meeting).filter(Meeting.host_id == current_user.id).all()
    return meetings

@router.get("/{meeting_id}", response_model=MeetingSchema)
def get_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this meeting")
    
    return meeting

@router.put("/{meeting_id}", response_model=MeetingSchema)
def update_meeting(
    meeting_id: int,
    meeting_update: MeetingUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this meeting")
    
        for field, value in meeting_update.model_dump(exclude_unset=True).items():
            setattr(meeting, field, value)
    
    db.commit()
    db.refresh(meeting)
    
    return meeting

@router.delete("/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this meeting")
    
    db.delete(meeting)
    db.commit()
    
    return {"message": "Meeting deleted successfully"}

@router.post("/join")
def join_meeting(meeting_join: MeetingJoin, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.room_code == meeting_join.room_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if not meeting.is_active:
        raise HTTPException(status_code=400, detail="Meeting is not active")
    
    return {
        "meeting_id": meeting.id,
        "title": meeting.title,
        "participant_name": meeting_join.participant_name,
        "is_guest": meeting_join.is_guest
    }

@router.websocket("/ws/{meeting_id}")
async def websocket_endpoint(websocket: WebSocket, meeting_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    
    # Store connection
    if meeting_id not in active_connections:
        active_connections[meeting_id] = []
    active_connections[meeting_id].append(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message["type"] == "join":
                # Send join notification to all participants
                await broadcast_to_meeting(meeting_id, {
                    "type": "user_joined",
                    "user": message["user"]
                })
            
            elif message["type"] == "translation":
                # Handle translation request
                await handle_translation(meeting_id, message, db)
            
            elif message["type"] == "chat":
                # Handle chat message
                await broadcast_to_meeting(meeting_id, {
                    "type": "chat_message",
                    "user": message["user"],
                    "message": message["message"],
                    "timestamp": message["timestamp"]
                })
    
    except WebSocketDisconnect:
        # Remove connection when disconnected
        if meeting_id in active_connections:
            active_connections[meeting_id].remove(websocket)
            if not active_connections[meeting_id]:
                del active_connections[meeting_id]

async def broadcast_to_meeting(meeting_id: int, message: dict):
    if meeting_id in active_connections:
        for connection in active_connections[meeting_id]:
            try:
                await connection.send_text(json.dumps(message))
            except:
                # Remove broken connections
                active_connections[meeting_id].remove(connection)

async def handle_translation(meeting_id: int, message: dict, db: Session):
    # Here you would integrate with translation service
    # For now, just echo back the original text
    translated_message = {
        "type": "translation_response",
        "original_text": message["text"],
        "translated_text": f"Translated: {message['text']}",  # Placeholder
        "source_language": message["source_language"],
        "target_language": message["target_language"],
        "timestamp": message["timestamp"]
    }
    
    await broadcast_to_meeting(meeting_id, translated_message)
