#!/usr/bin/env python3
"""
Test script để kiểm tra backend
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test import các modules chính"""
    try:
        print("🔍 Testing imports...")
        
        # Test core imports
        from app.core.config import settings
        print("✅ Core config imported")
        
        from app.core.database import engine, SessionLocal
        print("✅ Database imported")
        
        from app.core.security import verify_password, get_password_hash
        print("✅ Security imported")
        
        # Test models imports
        from app.models import User, Workspace, Channel, Meeting, Translation, Glossary
        print("✅ Models imported")
        
        # Test schemas imports
        from app.schemas.user import UserCreate, User as UserSchema
        print("✅ User schemas imported")
        
        from app.schemas.meeting import MeetingCreate, Meeting as MeetingSchema
        print("✅ Meeting schemas imported")
        
        # Test API imports
        from app.api.v1.endpoints.auth import router as auth_router
        print("✅ Auth API imported")
        
        from app.api.v1.endpoints.meetings import router as meetings_router
        print("✅ Meetings API imported")
        
        # Test services imports
        from app.services.translation_service import translation_service
        print("✅ Translation service imported")
        
        print("\n🎉 All imports successful!")
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_database_connection():
    """Test kết nối database"""
    try:
        print("\n🔍 Testing database connection...")
        
        from app.core.database import engine
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print("✅ Database connection successful")
            return True
            
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

def test_app_creation():
    """Test tạo FastAPI app"""
    try:
        print("\n🔍 Testing FastAPI app creation...")
        
        from main import app
        
        print("✅ FastAPI app created successfully")
        print(f"   Title: {app.title}")
        print(f"   OpenAPI URL: {app.openapi_url}")
        return True
        
    except Exception as e:
        print(f"❌ App creation error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing GiantyTalk Backend...\n")
    
    # Run tests
    import_success = test_imports()
    db_success = test_database_connection() if import_success else False
    app_success = test_app_creation() if import_success else False
    
    print("\n" + "="*50)
    print("📊 Test Results:")
    print(f"   Imports: {'✅ PASS' if import_success else '❌ FAIL'}")
    print(f"   Database: {'✅ PASS' if db_success else '❌ FAIL'}")
    print(f"   App: {'✅ PASS' if app_success else '❌ FAIL'}")
    
    if all([import_success, db_success, app_success]):
        print("\n🎉 All tests passed! Backend is ready.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        sys.exit(1)
