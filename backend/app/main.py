from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import logging
import sys
import asyncio
from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.db import base_class
from app.routers import auth, users, salary

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configure additional logging handlers for production
logger.addHandler(logging.StreamHandler(sys.stdout))

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up FastAPI application")
    logger.info(f"Environment: {settings.ENV}")
    logger.info(f"Database URL: {settings.DATABASE_URL}")

    max_retries = 3
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            db = SessionLocal()
            # Test query with timeout
            db.execute(text("SELECT 1"))
            db.close()
            logger.info("Successfully connected to the database")
            return
        except Exception as e:
            logger.error(f"Database connection attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
            else:
                logger.error("All database connection attempts failed")
                raise e

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    logger.info(f"Headers: {dict(request.headers)}")
    response = await call_next(request)
    logger.info(f"Response Status: {response.status_code}")
    return response

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(salary.router, prefix=f"{settings.API_V1_STR}/salary", tags=["salary"])

@app.get("/")
async def read_root():
    logger.info("Root endpoint called")
    return {"status": "healthy", "message": "API is running"}

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    logger.info("Health check endpoint called")
    db = None
    try:
        start_time = asyncio.get_event_loop().time()
        logger.info("Attempting database connection for health check")
        db = SessionLocal()
        logger.info("Database connection established, executing test query")
        result = db.execute(text("SELECT 1")).scalar()
        query_time = asyncio.get_event_loop().time() - start_time
        logger.info(f"Health check query successful. Result: {result}")
        return {
            "status": "healthy",
            "database": "connected",
            "query_time": f"{query_time:.2f}s",
            "version": settings.VERSION,
            "environment": settings.ENV
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "error_type": type(e).__name__,
            "version": settings.VERSION,
            "environment": settings.ENV
        }
    finally:
        if db:
            logger.info("Closing database connection")
            db.close()
