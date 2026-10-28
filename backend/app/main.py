from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from app.config.settings import settings
from app.database.session import init_db, SessionLocal
from app.api import auth_router, resume_router, interview_router
from app.utils.helpers import seed_demo_data_if_needed

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("careercoach")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Resume Analyzer & Multilingual Interview Coach API"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    try:
        init_db()
        db = SessionLocal()
        seed_demo_data_if_needed(db)
        db.close()
        logger.info("Database initialized and demo data verified.")
    except Exception as e:
        logger.error(f"Error during startup initialization: {e}")

# Global exception handler for uncaught server errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again or switch to demo mode."}
    )

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(resume_router, prefix=settings.API_V1_STR)
app.include_router(interview_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to CareerCoach AI API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "demo_mode": settings.DEMO_MODE,
        "ai_provider": settings.AI_PROVIDER
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "provider": settings.AI_PROVIDER,
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
