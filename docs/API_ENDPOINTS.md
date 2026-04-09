# API Endpoints

## Authentication
- `POST /api/auth/register` Register a new user
- `POST /api/auth/login` Authenticate and return JWT

## Plans
- `GET /api/plans` List all active insurance plans for authenticated users

## User APIs
- `GET /api/user/dashboard` Dashboard summary for logged-in user
- `GET /api/user/policies` List purchased policies
- `POST /api/user/purchase` Purchase a plan
- `GET /api/user/claims` List user claims
- `POST /api/user/claims` Create a new claim request
- `POST /api/user/recommendations` AI-based insurance recommendations
- `POST /api/user/premium-calculator` Premium pricing calculator
- `GET /api/user/notifications` Notification feed

## Admin APIs
- `GET /api/admin/dashboard` Admin dashboard metrics
- `GET /api/admin/plans` List all plans
- `POST /api/admin/plans` Create a new plan
- `PUT /api/admin/plans/{id}` Update an existing plan
- `DELETE /api/admin/plans/{id}` Delete a plan
- `GET /api/admin/claims` List all claim requests
- `PUT /api/admin/claims/{id}` Approve or reject a claim
