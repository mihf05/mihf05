# Import base models first
from app.models.user import User
from app.models.salary import Salary
from app.models.loan import Loan

# Import relationships last to avoid circular imports
from app.models.relationships import *  # noqa: F403

# This ensures all models are imported and relationships are set up correctly
__all__ = ["User", "Salary", "Loan"]
