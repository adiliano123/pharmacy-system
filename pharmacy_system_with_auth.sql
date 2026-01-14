-- Pharmacy System Database with Authentication
-- Updated to include user login and employee tracking

CREATE DATABASE IF NOT EXISTS pharmacy_system;
USE pharmacy_system;

-- 1. Users/Employees Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'pharmacist', 'cashier') DEFAULT 'pharmacist',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- 2. Inventory Table (Updated)
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    category VARCHAR(100),
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_batch (batch_number),
    INDEX idx_expiry (expiry_date)
);

-- 3. Sales Table (Updated with employee tracking)
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT NOT NULL,
    batch_number VARCHAR(100),
    name VARCHAR(255),
    quantity_sold INT NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_by INT NOT NULL,
    customer_name VARCHAR(100),
    notes TEXT,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE,
    FOREIGN KEY (sold_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_sale_date (sale_date),
    INDEX idx_sold_by (sold_by),
    INDEX idx_inventory (inventory_id)
);

-- 4. User Sessions Table (for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
);

-- 5. Activity Log Table (audit trail)
CREATE TABLE IF NOT EXISTS activity_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- 6. Insert Default Users
-- Run api/setup_users.php after importing this SQL file to create default users
-- This ensures passwords are properly hashed

-- Default users will be:
-- Username: admin, Password: admin123, Role: admin
-- Username: pharmacist1, Password: admin123, Role: pharmacist
-- Username: cashier1, Password: admin123, Role: cashier

-- Note: All default passwords are 'admin123'
-- To generate a new password hash in PHP: password_hash('your_password', PASSWORD_DEFAULT)

-- 7. Create Views for Easy Reporting

-- View: Sales with employee information
CREATE OR REPLACE VIEW sales_with_employee AS
SELECT 
    s.id,
    s.name AS medicine_name,
    s.batch_number,
    s.quantity_sold,
    s.total_revenue,
    s.sale_date,
    s.customer_name,
    u.full_name AS employee_name,
    u.username AS employee_username,
    u.role AS employee_role
FROM sales s
LEFT JOIN users u ON s.sold_by = u.user_id
ORDER BY s.sale_date DESC;

-- View: Inventory with creator information
CREATE OR REPLACE VIEW inventory_with_creator AS
SELECT 
    i.*,
    u.full_name AS created_by_name,
    u.username AS created_by_username
FROM inventory i
LEFT JOIN users u ON i.created_by = u.user_id;

-- View: Employee sales summary
CREATE OR REPLACE VIEW employee_sales_summary AS
SELECT 
    u.user_id,
    u.full_name,
    u.username,
    u.role,
    COUNT(s.id) AS total_sales,
    SUM(s.quantity_sold) AS total_items_sold,
    SUM(s.total_revenue) AS total_revenue,
    MIN(s.sale_date) AS first_sale,
    MAX(s.sale_date) AS last_sale
FROM users u
LEFT JOIN sales s ON u.user_id = s.sold_by
WHERE u.is_active = TRUE
GROUP BY u.user_id, u.full_name, u.username, u.role;
