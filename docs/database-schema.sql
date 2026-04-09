CREATE DATABASE IF NOT EXISTS online_insurance_system;
USE online_insurance_system;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age INT,
  annual_income DECIMAL(15,2),
  risk_score INT
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role VARCHAR(50) NOT NULL,
  PRIMARY KEY (user_id, role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE insurance_plans (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  plan_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  base_premium DECIMAL(15,2),
  coverage_amount DECIMAL(15,2),
  min_age INT,
  max_age INT,
  risk_level VARCHAR(50),
  active BIT DEFAULT 1
);

CREATE TABLE policy_purchases (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  plan_id BIGINT NOT NULL,
  start_date DATE,
  end_date DATE,
  term_years INT,
  premium_amount DECIMAL(15,2),
  status VARCHAR(50),
  policy_number VARCHAR(100),
  CONSTRAINT fk_policy_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_policy_plan FOREIGN KEY (plan_id) REFERENCES insurance_plans(id)
);

CREATE TABLE claim_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  policy_purchase_id BIGINT NOT NULL,
  claim_amount DECIMAL(15,2) NOT NULL,
  reason VARCHAR(500),
  status VARCHAR(50),
  requested_date DATE,
  admin_remark VARCHAR(500),
  CONSTRAINT fk_claim_policy FOREIGN KEY (policy_purchase_id) REFERENCES policy_purchases(id)
);

CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255),
  message VARCHAR(500),
  read_status BIT DEFAULT 0,
  created_at DATETIME,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);
