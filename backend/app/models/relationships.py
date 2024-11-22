from app.models.user import User
from app.models.salary import Salary
from app.models.loan import Loan
from sqlalchemy.orm import relationship

# Add relationships to User model
User.salaries = relationship("app.models.salary.Salary", back_populates="user", foreign_keys="[Salary.employee_id]")
User.loans = relationship("app.models.loan.Loan", back_populates="user", foreign_keys="[Loan.employee_id]")

# Add relationships to Salary model
Salary.user = relationship("app.models.user.User", back_populates="salaries", foreign_keys="[Salary.employee_id]")

# Add relationships to Loan model
Loan.user = relationship("app.models.user.User", back_populates="loans", foreign_keys="[Loan.employee_id]")
