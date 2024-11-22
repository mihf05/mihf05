from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.salary import Salary, SalaryCreate, Loan, LoanCreate, LoanUpdate
from app.crud import crud_salary
from app.core.security import oauth2_scheme
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/create", response_model=Salary)
def create_salary(
    *,
    db: Session = Depends(get_db),
    salary_in: SalaryCreate,
    token: str = Depends(oauth2_scheme)
) -> Any:
    current_user = get_current_user(db, token=token)
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_salary.create_salary(db=db, salary_in=salary_in)

@router.get("/employee/{employee_id}", response_model=List[Salary])
def get_employee_salaries(
    employee_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    current_user = get_current_user(db, token=token)
    if not current_user.is_superuser and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_salary.get_user_salaries(db=db, user_id=employee_id)

@router.post("/loans/create", response_model=Loan)
def create_loan_request(
    *,
    db: Session = Depends(get_db),
    loan_in: LoanCreate,
    token: str = Depends(oauth2_scheme)
) -> Any:
    current_user = get_current_user(db, token=token)
    if current_user.id != loan_in.employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to create loan for other employees"
        )
    return crud_salary.create_loan(db=db, loan_in=loan_in)

@router.put("/loans/{loan_id}", response_model=Loan)
def update_loan_status(
    *,
    db: Session = Depends(get_db),
    loan_id: int,
    loan_in: LoanUpdate,
    token: str = Depends(oauth2_scheme)
) -> Any:
    current_user = get_current_user(db, token=token)
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_salary.update_loan_status(
        db=db,
        loan_id=loan_id,
        status=loan_in.status,
        repayment_percentage=loan_in.repayment_percentage,
        start_date=loan_in.start_date,
        end_date=loan_in.end_date
    )

@router.get("/loans/employee/{employee_id}", response_model=List[Loan])
def get_employee_loans(
    employee_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    current_user = get_current_user(db, token=token)
    if not current_user.is_superuser and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return crud_salary.get_user_loans(db=db, user_id=employee_id)
