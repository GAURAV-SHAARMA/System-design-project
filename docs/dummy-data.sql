USE online_insurance_system;

INSERT INTO users (id, full_name, email, password, age, annual_income, risk_score) VALUES
(1, 'System Admin', 'admin@insurance.com', '$2a$10$exampleHashedAdminPassword', 35, 1500000.00, 3),
(2, 'Gaurav Sharma', 'user@insurance.com', '$2a$10$exampleHashedUserPassword', 29, 780000.00, 4);

INSERT INTO user_roles (user_id, role) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER');

INSERT INTO insurance_plans (id, plan_name, category, description, base_premium, coverage_amount, min_age, max_age, risk_level, active) VALUES
(1, 'Smart Health Shield', 'Health', 'Comprehensive family health plan with OPD and critical illness support.', 18500.00, 1500000.00, 18, 60, 'LOW', 1),
(2, 'Future Secure Life', 'Life', 'Long-term life coverage designed for salaried professionals and young families.', 26000.00, 3000000.00, 21, 55, 'MEDIUM', 1),
(3, 'DriveSafe Auto', 'Vehicle', 'Vehicle protection with cashless garages and roadside assistance.', 12000.00, 800000.00, 18, 65, 'MEDIUM', 1),
(4, 'Elite Wealth Protect', 'Investment', 'Premium wealth and legacy protection plan with high coverage and tax benefits.', 42000.00, 5000000.00, 25, 55, 'HIGH', 1);

INSERT INTO policy_purchases (id, user_id, plan_id, start_date, end_date, term_years, premium_amount, status, policy_number) VALUES
(1, 2, 1, CURDATE() - INTERVAL 2 MONTH, CURDATE() + INTERVAL 3 YEAR, 3, 17205.00, 'ACTIVE', 'POL-DEMO001');

INSERT INTO claim_requests (id, policy_purchase_id, claim_amount, reason, status, requested_date, admin_remark) VALUES
(1, 1, 25000.00, 'Hospitalization reimbursement request', 'PENDING', CURDATE(), NULL);

INSERT INTO notifications (id, user_id, title, message, read_status, created_at) VALUES
(1, 2, 'Welcome to InsureSmart', 'Your demo account is ready. Explore plans, premium calculator, and dashboard insights.', 0, NOW());
