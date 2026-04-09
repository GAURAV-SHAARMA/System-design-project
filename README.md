# Online Insurance System

A complete full-stack academic project for managing insurance plans, recommendations, purchases, claims, dashboards, and administrator actions.

## Tech Stack
- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, JWT, MySQL
- Frontend: React, Vite, Tailwind CSS, Axios, Recharts
- Roles: Admin and User

## Project Structure
- `backend/` Spring Boot REST API
- `frontend/` React + Tailwind user interface
- `docs/` API list, schema, and dummy SQL

## Core Features
- User registration and JWT login
- Role-based access control for admin and user flows
- Admin panel for insurance plan management
- Insurance plan catalogue and policy purchase flow
- AI-style recommendation engine using age, income, and risk
- Real-time premium calculator
- Claim request and approval/rejection simulation
- Policy tracking dashboard with charts
- Notification center

## Setup Instructions
### 1. MySQL Setup
1. Install MySQL Server.
2. Create or allow auto-creation of database `online_insurance_system`.
3. Update credentials in [application.properties](./backend/src/main/resources/application.properties) if needed.
4. Optional: run the SQL from [database-schema.sql](./docs/database-schema.sql) and [dummy-data.sql](./docs/dummy-data.sql).

### 2. Backend Setup
1. Install Java 21.
2. Install Maven 3.9+ if it is not already available.
3. Open a terminal in `backend/`.
4. Run `mvn spring-boot:run`.
5. API will start at `http://localhost:8080`.

Demo seeded credentials:
- Admin: `admin@insurance.com` / `Admin@123`
- User: `user@insurance.com` / `User@123`

### 3. Frontend Setup
1. Open a terminal in `frontend/`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.

## Important API Groups
- Auth: `/api/auth`
- User: `/api/user`
- Plans: `/api/plans`
- Admin: `/api/admin`

Detailed endpoint documentation is in [API_ENDPOINTS.md](./docs/API_ENDPOINTS.md).

## Notes
- The backend seeds sample users, plans, one purchased policy, one pending claim, and a notification.
- The frontend uses Axios interceptors to attach JWT automatically.
- Charts are rendered with Recharts for evaluator-friendly dashboards.
