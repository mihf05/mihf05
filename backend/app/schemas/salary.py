from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SalaryBase(BaseModel):
    amount: float
    status: Optional[str] = "pending"
    payment_date: datetime

class SalaryCreate(SalaryBase):
    employee_id: int

class SalaryUpdate(SalaryBase):
    pass

class SalaryInDBBase(SalaryBase):
    id: int
    employee_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Salary(SalaryInDBBase):
    pass

class LoanBase(BaseModel):
    amount: float
    status: Optional[str] = "pending"
    repayment_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class LoanCreate(LoanBase):
    employee_id: int

class LoanUpdate(LoanBase):
    pass

class LoanInDBBase(LoanBase):
    id: int
    employee_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Loan(LoanInDBBase):
    pass
