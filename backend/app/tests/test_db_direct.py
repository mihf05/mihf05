import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import psycopg2
import logging
from app.core.config import settings

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_direct_connection():
    try:
        logger.info("Attempting direct database connection...")
        conn = psycopg2.connect(
            settings.DATABASE_URL,
            connect_timeout=10
        )
        logger.info("Connection successful!")

        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        logger.info(f"PostgreSQL version: {version}")

        cur.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Connection failed: {str(e)}")
        logger.error(f"Connection parameters: {settings.DATABASE_URL}")
        return False

if __name__ == "__main__":
    test_direct_connection()
