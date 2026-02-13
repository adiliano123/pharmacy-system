-- ============================================================================
-- PHARMACY ERP SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This is the ONLY database file you need to import
-- Version: 2.0 - Complete & Unified
-- Created: February 12, 2026
-- 
-- Features:
-- - User authentication and authorization (Admin, Pharmacist, Cashier)
-- - Inventory management with batch tracking
-- - Sales and revenue tracking
-- - Prescription management
-- - Drug interaction checking
-- - Patient counseling records
-- - Supply order management
-- - Expiry monitoring and alerts
-- - Activity logging and audit trail
-- ============================================================================

-- Create and use database
CREATE DATABASE IF NOT EXISTS pharmacy_system;
USE pharmacy_system;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- 1. Users/Employees Table
-- Stores all system users with role-based access control
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
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Inventory Table
-- Stores all medicines with batch tracking and expiry dates
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
    INDEX idx_expiry (expiry_date),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Sales Table
-- Tracks all sales transactions with employee information
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
    payment_method ENUM('cash', 'card', 'mobile_money') DEFAULT 'cash',
    notes TEXT,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE,
    FOREIGN KEY (sold_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_sale_date (sale_date),
    INDEX idx_sold_by (sold_by),
    INDEX idx_inventory (inventory_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AUTHENTICATION & SECURITY TABLES
-- ============================================================================

-- 4. User Sessions Table
-- Manages active user sessions for security
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Activity Log Table
-- Audit trail for all system activities
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PATIENT & PRESCRIPTION MANAGEMENT TABLES
-- ============================================================================

-- 6. Patients Table
-- Stores patient information for prescription management
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    date_of_birth DATE,
    address TEXT,
    allergies TEXT,
    medical_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_name (patient_name),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Prescriptions Table
-- Manages prescription workflow from verification to dispensing
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    doctor_license VARCHAR(50),
    prescription_date DATE NOT NULL,
    status ENUM('pending', 'verified', 'dispensed', 'rejected') DEFAULT 'pending',
    notes TEXT,
    verified_by INT,
    verified_at TIMESTAMP NULL,
    dispensed_by INT,
    dispensed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (dispensed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_prescription_number (prescription_number),
    INDEX idx_status (status),
    INDEX idx_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Prescription Items Table
-- Details of medicines prescribed in each prescription
CREATE TABLE IF NOT EXISTS prescription_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100) NOT NULL,
    quantity_prescribed INT NOT NULL,
    quantity_dispensed INT DEFAULT 0,
    instructions TEXT NOT NULL,
    frequency VARCHAR(100),
    duration VARCHAR(100),
    inventory_id INT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE SET NULL,
    INDEX idx_prescription (prescription_id),
    INDEX idx_medicine (medicine_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CLINICAL & PHARMACIST TABLES
-- ============================================================================

-- 9. Drug Interactions Table
-- Database of known drug interactions for safety checking
CREATE TABLE IF NOT EXISTS drug_interactions (
    interaction_id INT AUTO_INCREMENT PRIMARY KEY,
    drug1_name VARCHAR(255) NOT NULL,
    drug1_generic VARCHAR(255),
    drug2_name VARCHAR(255) NOT NULL,
    drug2_generic VARCHAR(255),
    interaction_type ENUM('major', 'moderate', 'minor') NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_drug1 (drug1_name),
    INDEX idx_drug2 (drug2_name),
    INDEX idx_type (interaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Patient Counseling Records
-- Tracks patient education and counseling sessions
CREATE TABLE IF NOT EXISTS patient_counseling (
    counseling_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    prescription_id INT,
    counseled_by INT NOT NULL,
    counseling_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    topics_covered TEXT NOT NULL,
    patient_understanding ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
    follow_up_needed BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE SET NULL,
    FOREIGN KEY (counseled_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_patient (patient_id),
    INDEX idx_counseled_by (counseled_by),
    INDEX idx_date (counseling_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SUPPLY CHAIN MANAGEMENT TABLES
-- ============================================================================

-- 11. Supply Orders Table
-- Manages medicine ordering from suppliers
CREATE TABLE IF NOT EXISTS supply_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,
    supplier_contact VARCHAR(100),
    order_date DATE NOT NULL,
    expected_delivery DATE,
    status ENUM('pending', 'ordered', 'received', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    ordered_by INT NOT NULL,
    received_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ordered_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (received_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_ordered_by (ordered_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Supply Order Items Table
-- Details of items in each supply order
CREATE TABLE IF NOT EXISTS supply_order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    quantity_ordered INT NOT NULL,
    quantity_received INT DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    batch_number VARCHAR(100),
    expiry_date DATE,
    FOREIGN KEY (order_id) REFERENCES supply_orders(order_id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_medicine (medicine_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MONITORING & ALERTS TABLES
-- ============================================================================

-- 13. Expiry Alerts Table
-- Tracks medicines approaching expiry or already expired
CREATE TABLE IF NOT EXISTS expiry_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT NOT NULL,
    alert_type ENUM('30_days', '90_days', 'expired') NOT NULL,
    alert_date DATE NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by INT,
    acknowledged_at TIMESTAMP NULL,
    action_taken TEXT,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE,
    FOREIGN KEY (acknowledged_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_inventory (inventory_id),
    INDEX idx_alert_date (alert_date),
    INDEX idx_acknowledged (acknowledged)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Customers Table
-- Stores customer information for loyalty and tracking
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    loyalty_points INT DEFAULT 0,
    total_purchases DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_purchase TIMESTAMP NULL,
    INDEX idx_name (customer_name),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA - DRUG INTERACTIONS
-- ============================================================================

INSERT INTO drug_interactions (drug1_name, drug1_generic, drug2_name, drug2_generic, interaction_type, description, recommendation) VALUES
('Warfarin', 'warfarin', 'Aspirin', 'acetylsalicylic acid', 'major', 'Increased risk of bleeding when used together', 'Monitor INR closely and consider alternative pain relief'),
('Metformin', 'metformin', 'Alcohol', 'ethanol', 'moderate', 'Increased risk of lactic acidosis', 'Advise patient to limit alcohol consumption'),
('Simvastatin', 'simvastatin', 'Grapefruit Juice', 'grapefruit', 'moderate', 'Grapefruit can increase simvastatin levels', 'Advise patient to avoid grapefruit products'),
('Digoxin', 'digoxin', 'Furosemide', 'furosemide', 'moderate', 'Diuretics can increase digoxin toxicity risk', 'Monitor digoxin levels and electrolytes'),
('Paracetamol', 'acetaminophen', 'Alcohol', 'ethanol', 'moderate', 'Increased risk of liver damage', 'Advise patient to limit alcohol while taking paracetamol'),
('Amoxicillin', 'amoxicillin', 'Oral Contraceptives', 'ethinylestradiol', 'minor', 'May reduce effectiveness of oral contraceptives', 'Advise additional contraceptive methods'),
('Ibuprofen', 'ibuprofen', 'Aspirin', 'acetylsalicylic acid', 'moderate', 'Increased risk of gastrointestinal bleeding', 'Avoid concurrent use if possible'),
('Ciprofloxacin', 'ciprofloxacin', 'Antacids', 'aluminum hydroxide', 'moderate', 'Antacids reduce ciprofloxacin absorption', 'Take ciprofloxacin 2 hours before or 6 hours after antacids');

-- ============================================================================
-- DATABASE VIEWS FOR REPORTING
-- ============================================================================

-- View 1: Sales with Employee Information
CREATE OR REPLACE VIEW sales_with_employee AS
SELECT 
    s.id,
    s.name AS medicine_name,
    s.batch_number,
    s.quantity_sold,
    s.total_revenue,
    s.sale_date,
    s.customer_name,
    s.payment_method,
    u.full_name AS employee_name,
    u.username AS employee_username,
    u.role AS employee_role
FROM sales s
LEFT JOIN users u ON s.sold_by = u.user_id
ORDER BY s.sale_date DESC;

-- View 2: Inventory with Creator Information
CREATE OR REPLACE VIEW inventory_with_creator AS
SELECT 
    i.*,
    u.full_name AS created_by_name,
    u.username AS created_by_username
FROM inventory i
LEFT JOIN users u ON i.created_by = u.user_id;

-- View 3: Employee Sales Summary
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

-- View 4: Pending Prescriptions
CREATE OR REPLACE VIEW pending_prescriptions AS
SELECT 
    p.prescription_id,
    p.prescription_number,
    pt.patient_name,
    p.doctor_name,
    p.prescription_date,
    COUNT(pi.item_id) as item_count,
    p.created_at
FROM prescriptions p
JOIN patients pt ON p.patient_id = pt.patient_id
LEFT JOIN prescription_items pi ON p.prescription_id = pi.prescription_id
WHERE p.status = 'pending'
GROUP BY p.prescription_id
ORDER BY p.created_at ASC;

-- View 5: Medicines Expiring Soon
CREATE OR REPLACE VIEW expiring_medicines AS
SELECT 
    i.inventory_id,
    i.name,
    i.generic_name,
    i.batch_number,
    i.quantity,
    i.expiry_date,
    DATEDIFF(i.expiry_date, CURDATE()) as days_to_expiry,
    CASE 
        WHEN DATEDIFF(i.expiry_date, CURDATE()) < 0 THEN 'expired'
        WHEN DATEDIFF(i.expiry_date, CURDATE()) <= 30 THEN '30_days'
        WHEN DATEDIFF(i.expiry_date, CURDATE()) <= 90 THEN '90_days'
        ELSE 'safe'
    END as alert_level
FROM inventory i
WHERE DATEDIFF(i.expiry_date, CURDATE()) <= 90
ORDER BY i.expiry_date ASC;

-- View 6: Low Stock Items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
    i.inventory_id,
    i.name,
    i.generic_name,
    i.quantity,
    i.price,
    CASE 
        WHEN i.quantity = 0 THEN 'out_of_stock'
        WHEN i.quantity <= 10 THEN 'low_stock'
        WHEN i.quantity <= 50 THEN 'moderate_stock'
        ELSE 'good_stock'
    END as stock_level
FROM inventory i
WHERE i.quantity <= 50
ORDER BY i.quantity ASC;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'Database schema created successfully!' AS Status,
       'Run api/setup_users.php to create default users' AS NextStep,
       'Default password for all users: admin123' AS Note;

-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
-- 
-- NEXT STEPS:
-- 1. Import this file into MySQL/phpMyAdmin
-- 2. Run: http://localhost/pharmacy-system/api/setup_users.php
-- 3. Verify users: http://localhost/pharmacy-system/api/check_users.php
-- 4. Start using the system!
--
-- DEFAULT USERS (created by setup_users.php):
-- - Username: admin       | Password: admin123 | Role: Administrator
-- - Username: pharmacist1 | Password: admin123 | Role: Pharmacist
-- - Username: cashier1    | Password: admin123 | Role: Cashier
--
-- ============================================================================
