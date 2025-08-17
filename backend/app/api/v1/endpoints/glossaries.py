from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.glossary import Glossary, GlossaryTerm
from app.models.user import User
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/", response_model=dict)
def create_glossary(
    name: str,
    description: str = None,
    workspace_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_glossary = Glossary(
        name=name,
        description=description,
        workspace_id=workspace_id,
        created_by=current_user.id
    )
    
    db.add(db_glossary)
    db.commit()
    db.refresh(db_glossary)
    
    return {"id": db_glossary.id, "name": db_glossary.name, "message": "Glossary created successfully"}

@router.get("/", response_model=List[dict])
def get_glossaries(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    glossaries = db.query(Glossary).filter(Glossary.created_by == current_user.id).all()
    return [
        {
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "workspace_id": g.workspace_id,
            "created_at": g.created_at
        }
        for g in glossaries
    ]

@router.get("/{glossary_id}", response_model=dict)
def get_glossary(
    glossary_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    glossary = db.query(Glossary).filter(Glossary.id == glossary_id).first()
    if not glossary:
        raise HTTPException(status_code=404, detail="Glossary not found")
    
    if glossary.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this glossary")
    
    terms = db.query(GlossaryTerm).filter(GlossaryTerm.glossary_id == glossary_id).all()
    
    return {
        "id": glossary.id,
        "name": glossary.name,
        "description": glossary.description,
        "workspace_id": glossary.workspace_id,
        "created_at": glossary.created_at,
        "terms": [
            {
                "id": t.id,
                "term": t.term,
                "definition": t.definition,
                "source_language": t.source_language,
                "target_language": t.target_language,
                "context": t.context
            }
            for t in terms
        ]
    }

@router.post("/{glossary_id}/terms", response_model=dict)
def add_term(
    glossary_id: int,
    term: str,
    definition: str,
    source_language: str,
    target_language: str,
    context: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    glossary = db.query(Glossary).filter(Glossary.id == glossary_id).first()
    if not glossary:
        raise HTTPException(status_code=404, detail="Glossary not found")
    
    if glossary.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this glossary")
    
    db_term = GlossaryTerm(
        glossary_id=glossary_id,
        term=term,
        definition=definition,
        source_language=source_language,
        target_language=target_language,
        context=context
    )
    
    db.add(db_term)
    db.commit()
    db.refresh(db_term)
    
    return {"id": db_term.id, "term": db_term.term, "message": "Term added successfully"}

@router.delete("/{glossary_id}/terms/{term_id}")
def delete_term(
    glossary_id: int,
    term_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    glossary = db.query(Glossary).filter(Glossary.id == glossary_id).first()
    if not glossary:
        raise HTTPException(status_code=404, detail="Glossary not found")
    
    if glossary.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this glossary")
    
    term = db.query(GlossaryTerm).filter(GlossaryTerm.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    
    db.delete(term)
    db.commit()
    
    return {"message": "Term deleted successfully"}
