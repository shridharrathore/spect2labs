try:
    import sqlmodel
    print("✅ SQLModel imported successfully")
    
    import fastapi
    print("✅ FastAPI imported successfully")
    
    import uvicorn
    print("✅ Uvicorn imported successfully")
    
    import aiosqlite
    print("✅ aiosqlite imported successfully")
    
    from sqlalchemy.ext.asyncio import AsyncSession
    print("✅ AsyncSession imported successfully")
    
    print("\n🎉 All dependencies are working!")
    print("You can now run: uvicorn main:app --reload")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Run: pip install -r requirements.txt")