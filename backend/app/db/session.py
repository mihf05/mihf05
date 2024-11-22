from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import logging
from app.core.config import settings
import os

logger = logging.getLogger(__name__)

# Enhanced logging for database connection
try:
    from urllib.parse import urlparse
    parsed_url = urlparse(settings.parsed_database_url)
    safe_url = f"{parsed_url.scheme}://{parsed_url.username}:****@{parsed_url.hostname}{parsed_url.path}"
    logger.info(f"Attempting to connect to database with URL: {safe_url}")
    logger.info(f"Environment: {os.environ.get('ENV', 'development')}")
    logger.info(f"Database components - scheme: {parsed_url.scheme}, host: {parsed_url.hostname}, path: {parsed_url.path}")
except Exception as e:
    logger.error(f"Error parsing DATABASE_URL: {str(e)}")

# Use the parsed database URL
database_url = settings.parsed_database_url
logger.info("Creating database engine with settings:")
logger.info(f"Pool size: 3, Max overflow: 5, Timeout: 10s")

engine = create_engine(
    database_url,
    poolclass=QueuePool,
    pool_size=3,
    max_overflow=5,
    pool_timeout=10,
    pool_pre_ping=True,
    connect_args={
        'connect_timeout': 10,
        'options': '-c statement_timeout=5000',
        'sslmode': 'require',
        'keepalives': 1,
        'keepalives_idle': 30,
        'keepalives_interval': 10,
        'keepalives_count': 5
    },
    echo=True  # Enable SQL query logging
)

@event.listens_for(engine, "connect")
def connect(dbapi_connection, connection_record):
    logger.info("Database connection established")

@event.listens_for(engine, "checkout")
def checkout(dbapi_connection, connection_record, connection_proxy):
    logger.info("Database connection checked out from pool")

@event.listens_for(engine, "checkin")
def checkin(dbapi_connection, connection_record):
    logger.info("Database connection returned to pool")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {str(e)}")
        raise
    finally:
        db.close()
