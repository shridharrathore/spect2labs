from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import create_db_and_tables, close_db, get_session
from models import OpenAPISpec, TutorialGuide

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown events."""
    logger.info("🚀 Spec2Lab backend starting up...")
    
    # Create database tables on startup
    await create_db_and_tables()
    logger.info("📊 Database tables created/verified")
    
    yield  # App runs here
    
    # Cleanup on shutdown
    await close_db()
    logger.info("⚡ Spec2Lab backend shutting down...")

app = FastAPI(
    title="Spec2Labs API",
    description="API for Spec2Labs application",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "Spec2Labs API",
        "version": "0.1.0"
    }

@app.get("/specs")
async def list_specs(session: AsyncSession = Depends(get_session)):
    """List all ingested OpenAPI specs (for development/debugging)."""
    try:
        statement = select(OpenAPISpec).order_by(OpenAPISpec.created_at.desc())
        result = await session.execute(statement)
        specs = result.scalars().all()
        return {"specs": specs, "count": len(specs)}
    except Exception as e:
        logger.error(f"Error in list_specs: {e}")
        return {"error": str(e), "type": type(e).__name__}

@app.get("/guides")
async def list_guides(session: AsyncSession = Depends(get_session)):
    """List all tutorial guides (for development/debugging)."""
    try:
        statement = select(TutorialGuide).order_by(TutorialGuide.created_at.desc())
        result = await session.execute(statement)
        guides = result.scalars().all()
        return {"guides": guides, "count": len(guides)}
    except Exception as e:
        logger.error(f"Error in list_guides: {e}")
        return {"error": str(e), "type": type(e).__name__}
    
# Add this endpoint after your existing ones:

@app.post("/ingest")
async def ingest_spec(
    request: dict,
    session: AsyncSession = Depends(get_session)
):
    """Ingest OpenAPI specification and create tutorial."""
    try:
        spec_content = request.get("spec_content")
        source_url = request.get("source_url")
        
        if not spec_content:
            return {"error": "spec_content is required"}, 400
            
        # Parse the spec to extract metadata
        spec_data = json.loads(spec_content)
        title = spec_data.get("info", {}).get("title", "Untitled API")
        version = spec_data.get("info", {}).get("version", "1.0.0")
        description = spec_data.get("info", {}).get("description", "")
        
        # Create OpenAPI spec record
        spec = OpenAPISpec(
            title=title,
            version=version,
            description=description,
            spec_json=spec_content
        )
        session.add(spec)
        await session.commit()
        await session.refresh(spec)
        
        # Create tutorial guide record
        guide = TutorialGuide(
            spec_id=spec.id,
            title=f"Learn {title}",
            description=f"Interactive tutorial for {title}",
            status="ready"  # Mock as ready for demo
        )
        session.add(guide)
        await session.commit()
        await session.refresh(guide)
        
        logger.info(f"Created tutorial guide {guide.id} for spec {spec.id}")
        
        return {
            "guide_id": str(guide.id),
            "message": "Tutorial created successfully",
            "spec_id": spec.id
        }
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in spec_content")
        return {"error": "Invalid JSON in spec_content"}, 400
    except Exception as e:
        logger.error(f"Error in ingest_spec: {e}")
        return {"error": str(e)}, 500