# Employee Management System

A full-stack employee management system built with FastAPI, React, and PostgreSQL.

## Features

### Employee Features
- View salary details (current, pending, and upcoming)
- Download salary reports
- Apply for loans
- Track loan application status

### HR/Admin Features
- Add/manage employees
- Set salaries and salary payment schedules
- Approve/reject loan applications
- Set loan repayment percentage and months
- Generate salary and loan reports

## Tech Stack

### Frontend
- React with TypeScript
- Chakra UI for components
- React Query for state management
- React Router for navigation
- Axios for API calls

### Backend
- FastAPI (Python)
- PostgreSQL database
- JWT authentication
- SQLAlchemy ORM
- Alembic for migrations

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.12+
- PostgreSQL

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Documentation

The API documentation is available at `/docs` or `/redoc` when running the backend server.

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration time

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Deployment

### Backend
The backend is deployed on fly.io at:
```
https://employee-management-system-vbqpcwle.fly.dev
```

### Frontend
The frontend is a static site that can be deployed on any static hosting service:
1. Build the frontend: `npm run build`
2. Deploy the `build` directory

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- SQL injection protection through SQLAlchemy

## Project Structure

```
employee-management-system/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   └── schemas/
│   ├── alembic/
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── utils/
    │   └── App.tsx
    └── package.json
```
