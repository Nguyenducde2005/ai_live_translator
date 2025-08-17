#!/usr/bin/env python3
"""
Script khởi tạo database với dữ liệu mẫu
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models import User, Workspace, Channel, Glossary, GlossaryTerm

def init_db():
    """Khởi tạo database với dữ liệu mẫu"""
    
    # Tạo tables
    from app.models import User, Workspace, Channel, Meeting, Translation, Glossary
    User.metadata.create_all(bind=engine)
    Workspace.metadata.create_all(bind=engine)
    Channel.metadata.create_all(bind=engine)
    Meeting.metadata.create_all(bind=engine)
    Translation.metadata.create_all(bind=engine)
    Glossary.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Tạo admin user
        admin_user = db.query(User).filter(User.email == "admin@giantytalk.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@giantytalk.com",
                username="admin",
                full_name="Administrator",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_superuser=True,
                language_preference="en"
            )
            db.add(admin_user)
            db.commit()
            print("✅ Admin user created")
        
        # Tạo demo user
        demo_user = db.query(User).filter(User.email == "demo@giantytalk.com").first()
        if not demo_user:
            demo_user = User(
                email="demo@giantytalk.com",
                username="demo",
                full_name="Demo User",
                hashed_password=get_password_hash("demo123"),
                is_active=True,
                is_superuser=False,
                language_preference="vi"
            )
            db.add(demo_user)
            db.commit()
            print("✅ Demo user created")
        
        # Tạo demo workspace
        demo_workspace = db.query(Workspace).filter(Workspace.name == "Demo Workspace").first()
        if not demo_workspace:
            demo_workspace = Workspace(
                name="Demo Workspace",
                description="Workspace demo cho GiantyTalk",
                owner_id=demo_user.id,
                is_public=True
            )
            db.add(demo_workspace)
            db.commit()
            print("✅ Demo workspace created")
        
        # Tạo demo channel
        demo_channel = db.query(Channel).filter(Channel.name == "General").first()
        if not demo_channel:
            demo_channel = Channel(
                name="General",
                description="Kênh chung cho workspace",
                workspace_id=demo_workspace.id,
                is_private=False
            )
            db.add(demo_channel)
            db.commit()
            print("✅ Demo channel created")
        
        # Tạo demo glossary
        demo_glossary = db.query(Glossary).filter(Glossary.name == "IT Terms").first()
        if not demo_glossary:
            demo_glossary = Glossary(
                name="IT Terms",
                description="Từ điển thuật ngữ CNTT",
                workspace_id=demo_workspace.id,
                created_by=demo_user.id
            )
            db.add(demo_glossary)
            db.commit()
            print("✅ Demo glossary created")
            
            # Thêm một số terms mẫu
            sample_terms = [
                {
                    "term": "API",
                    "definition": "Application Programming Interface - Giao diện lập trình ứng dụng",
                    "source_language": "en",
                    "target_language": "vi"
                },
                {
                    "term": "Database",
                    "definition": "Cơ sở dữ liệu - Hệ thống lưu trữ và quản lý dữ liệu",
                    "source_language": "en",
                    "target_language": "vi"
                },
                {
                    "term": "WebSocket",
                    "definition": "Giao thức truyền thông hai chiều qua HTTP",
                    "source_language": "en",
                    "target_language": "vi"
                }
            ]
            
            for term_data in sample_terms:
                term = GlossaryTerm(
                    glossary_id=demo_glossary.id,
                    **term_data
                )
                db.add(term)
            
            db.commit()
            print("✅ Sample terms added")
        
        print("\n🎉 Database initialization completed successfully!")
        print("\n📋 Default credentials:")
        print("Admin: admin@giantytalk.com / admin123")
        print("Demo: demo@giantytalk.com / demo123")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing GiantyTalk database...")
    init_db()
