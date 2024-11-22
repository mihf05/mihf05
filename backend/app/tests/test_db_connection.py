import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.session import SessionLocal
from app.core.config import settings
import logging
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_database_connection():
    try:
        logger.info(f"Testing connection to database: {settings.DATABASE_URL}")
        db = SessionLocal()
        result = db.execute(text("SELECT 1")).scalar()
        db.close()
        logger.info("Database connection successful!")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_database_connection()
