from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.salary import Salary
from app.models.loan import Loan
from app.schemas.salary import SalaryCreate, SalaryUpdate, LoanCreate, LoanUpdate

def create_salary(db: Session, salary_in: SalaryCreate) -> Salary:
    db_obj = Salary(**salary_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_user_salaries(db: Session, user_id: int) -> List[Salary]:
    return db.query(Salary).filter(Salary.employee_id == user_id).all()

def update_salary_status(db: Session, salary_id: int, status: str) -> Salary:
    salary = db.query(Salary).filter(Salary.id == salary_id).first()
    if salary:
        salary.status = status
        salary.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(salary)
    return salary

def create_loan(db: Session, loan_in: LoanCreate) -> Loan:
    db_obj = Loan(**loan_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_user_loans(db: Session, user_id: int) -> List[Loan]:
    return db.query(Loan).filter(Loan.employee_id == user_id).all()

def update_loan_status(
    db: Session,
    loan_id: int,
    status: str,
    repayment_percentage: Optional[float] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> Loan:
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if loan:
        loan.status = status
        if repayment_percentage:
            loan.repayment_percentage = repayment_percentage
        if start_date:
            loan.start_date = start_date
        if end_date:
            loan.end_date = end_date
        loan.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(loan)
    return loan
