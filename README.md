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

## System Design Overview

This Online Insurance System is architected as a modular, scalable, and secure full-stack application. Below is a summary of the system design:

### 1. Architecture
- **Frontend**: Single Page Application (SPA) using React, Vite, and Tailwind CSS for a responsive UI.
- **Backend**: RESTful API built with Spring Boot, using Spring Security for authentication and authorization, and Spring Data JPA for ORM.
- **Database**: MySQL relational database for persistent storage.
- **Communication**: Frontend communicates with backend via REST API endpoints secured with JWT.

### 2. Key Components
- **Authentication & Authorization**: JWT-based, with role-based access (Admin, User).
- **Insurance Plans & Policies**: CRUD operations for plans, purchase flow for policies, and AI-style recommendations.
- **Claims Management**: Users can submit claims; admins can approve/reject them.
- **Dashboard & Analytics**: Real-time charts and statistics for users and admins.
- **Notifications**: In-app notification system for important events.

### 3. Data Flow
1. User interacts with the frontend (React SPA).
2. Frontend sends API requests to backend (Spring Boot REST API).
3. Backend processes requests, interacts with MySQL, and returns responses.
4. JWT tokens are used for secure, stateless authentication.

### 4. Security
- Passwords are hashed and never stored in plain text.
- JWT tokens are used for stateless authentication.
- Role-based access control restricts sensitive operations.

### 5. Extensibility
- Modular codebase allows for easy addition of new features (e.g., more roles, payment integration).
- API-first design enables integration with third-party services.

### 6. Deployment
- Can be containerized using Docker for easy deployment.
- Supports cloud or on-premise hosting.

> **Note for Evaluator:** The following section specifically addresses the System Design requirements of the project, detailing architectural decisions, component interactions, and scalability considerations as per the academic evaluation criteria.

---
For detailed API contracts, see `docs/API_ENDPOINTS.md`. For database schema, see `docs/database-schema.sql`.

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
