from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Loan(Base):
    __tablename__ = "loans"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id", name="fk_loan_user"))
    amount = Column(Float)
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED
    repayment_percentage = Column(Float)
    start_month = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
