from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Glossary(Base):
    __tablename__ = "glossaries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    workspace = relationship("Workspace")
    creator = relationship("User")
    terms = relationship("GlossaryTerm", back_populates="glossary")

class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"
    
    id = Column(Integer, primary_key=True, index=True)
    glossary_id = Column(Integer, ForeignKey("glossaries.id"), nullable=False)
    term = Column(String, nullable=False)
    definition = Column(Text, nullable=False)
    source_language = Column(String, nullable=False)
    target_language = Column(String, nullable=False)
    context = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    glossary = relationship("Glossary", back_populates="terms")
