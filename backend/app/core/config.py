from pydantic_settings import BaseSettings
from typing import Optional, List
from urllib.parse import quote_plus, urlparse
import logging
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Employee Management System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    DATABASE_URL: str
    ENV: str = "production"  # Add environment setting
    FIRST_SUPERUSER_EMAIL: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    # CORS Settings
    CORS_ORIGINS: str = "https://remarkable-dieffenbachia-df2ca5.netlify.app,http://localhost:3000"  # Accept as string and parse in property

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def parsed_database_url(self) -> str:
        logger.debug("Starting database URL parsing")

        # Enhanced logging for environment variables
        logger.debug("Environment variables:")
        logger.debug(f"ENV: {self.ENV}")
        logger.debug(f"PORT: {os.getenv('PORT')}")
        logger.debug(f"DATABASE_URL exists: {bool(self.DATABASE_URL)}")

        if not self.DATABASE_URL:
            logger.error("DATABASE_URL is empty or None")
            raise ValueError("DATABASE_URL is required")

        try:
            parsed = urlparse(self.DATABASE_URL)

            # Enhanced connection details logging
            connection_details = {
                'scheme': parsed.scheme,
                'username': parsed.username,
                'host': parsed.hostname,
                'port': parsed.port,
                'database': parsed.path.lstrip('/')
            }
            logger.debug(f"Connection details: {connection_details}")

            # Validate components
            missing_components = []
            if not parsed.scheme: missing_components.append("scheme")
            if not parsed.hostname: missing_components.append("hostname")
            if not parsed.username: missing_components.append("username")
            if not parsed.password: missing_components.append("password")

            if missing_components:
                raise ValueError(f"Missing URL components: {', '.join(missing_components)}")

            # URL encode the password
            safe_password = quote_plus(parsed.password)
            logger.debug(f"Password successfully encoded (length: {len(safe_password)})")

            # Reconstruct URL with encoded password
            url = f"{parsed.scheme}://{parsed.username}:{safe_password}@{parsed.hostname}"
            if parsed.port:
                url += f":{parsed.port}"
            url += f"{parsed.path}"
            if parsed.query:
                url += f"?{parsed.query}"

            logger.debug(f"URL structure validation successful: {parsed.scheme}://{parsed.username}:****@{parsed.hostname}{parsed.path}")
            return url

        except Exception as e:
            logger.error(f"Database URL parsing failed: {str(e)}")
            logger.error(f"Full error details: {repr(e)}")
            raise

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
