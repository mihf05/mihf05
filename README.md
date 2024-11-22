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
The backend can be deployed using Docker:
```bash
cd backend
docker build -t employee-management-system:latest .
docker run -d \
  -p 8001:8001 \
  -e DATABASE_URL="your-database-url" \
  -e SECRET_KEY="your-secret-key" \
  -e CORS_ORIGINS="your-frontend-url" \
  employee-management-system:latest
```

Current deployment status:
- Frontend: https://remarkable-dieffenbachia-df2ca5.netlify.app
- Backend: Containerized (46MB Alpine-based image)
- Database: PostgreSQL on AWS RDS

### Frontend
The frontend is deployed on Netlify:
1. Build the frontend: `npm run build`
2. Deploy using Netlify CLI or GitHub integration

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
