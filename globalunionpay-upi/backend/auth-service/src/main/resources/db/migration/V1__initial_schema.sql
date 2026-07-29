-- GlobalUnion Pay - Initial Schema
-- Flyway Migration V1

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    upi_pin VARCHAR(255),
    status ENUM('ACTIVE','INACTIVE','BLOCKED','PENDING') NOT NULL DEFAULT 'PENDING',
    kyc_status ENUM('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
    profile_image_url VARCHAR(500),
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    device_id VARCHAR(255),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    roles ENUM('ROLE_USER','ROLE_MERCHANT','ROLE_ADMIN') NOT NULL,
    PRIMARY KEY (user_id, roles),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS upi_ids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    upi_id VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    full_name VARCHAR(100),
    bank_account_id BIGINT,
    is_primary BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE','INACTIVE','BLOCKED') DEFAULT 'ACTIVE',
    qr_code_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_phone (phone)
);

CREATE TABLE IF NOT EXISTS wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    locked_balance DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('ACTIVE','FROZEN','CLOSED') DEFAULT 'ACTIVE',
    version BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upi_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_ref VARCHAR(50) NOT NULL UNIQUE,
    sender_upi_id VARCHAR(100) NOT NULL,
    receiver_upi_id VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    note VARCHAR(255),
    status ENUM('INITIATED','PROCESSING','SUCCESS','FAILED','REVERSED') NOT NULL,
    type ENUM('PAY','COLLECT','REFUND','SPLIT') DEFAULT 'PAY',
    failure_reason VARCHAR(500),
    rrn VARCHAR(30),
    initiated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    INDEX idx_sender (sender_upi_id),
    INDEX idx_receiver (receiver_upi_id),
    INDEX idx_status (status)
);

-- Insert demo admin user (password: Admin@1234)
INSERT IGNORE INTO users (phone, email, password, full_name, status, kyc_status, is_phone_verified)
VALUES ('9999999999', 'admin@globalunionpay.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RgDqIe6Gy',
        'Admin User', 'ACTIVE', 'VERIFIED', TRUE);

INSERT IGNORE INTO user_roles (user_id, roles)
SELECT id, 'ROLE_ADMIN' FROM users WHERE phone = '9999999999';

INSERT IGNORE INTO wallets (user_id, balance, status)
SELECT id, 50000.00, 'ACTIVE' FROM users WHERE phone = '9999999999';
