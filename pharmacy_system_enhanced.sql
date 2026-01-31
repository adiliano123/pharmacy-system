-- Enhanced Pharmacy System Database with Pharmacist-Specific Features
-- Includes prescription management, drug interactions, and patient counseling

CREATE DATABASE IF NOT EXISTS pharmacy_system;
USE pharmacy_system;

-- Existing tables (users, inventory, sales, user_sessions, activity_log) remain the same

-- 1. Patients Table
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
);

-- 2. Prescriptions Table
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
);

-- 3. Prescription Items Table
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
);

-- 4. Drug Interactions Table
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
);

-- 5. Patient Counseling Records
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
);

-- 6. Supply Orders Table
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
);

-- 7. Supply Order Items Table
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
);

-- 8. Expiry Monitoring Table
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
);

-- Insert sample drug interactions
INSERT INTO drug_interactions (drug1_name, drug1_generic, drug2_name, drug2_generic, interaction_type, description, recommendation) VALUES
('Warfarin', 'warfarin', 'Aspirin', 'acetylsalicylic acid', 'major', 'Increased risk of bleeding when used together', 'Monitor INR closely and consider alternative pain relief'),
('Metformin', 'metformin', 'Alcohol', 'ethanol', 'moderate', 'Increased risk of lactic acidosis', 'Advise patient to limit alcohol consumption'),
('Simvastatin', 'simvastatin', 'Grapefruit Juice', 'grapefruit', 'moderate', 'Grapefruit can increase simvastatin levels', 'Advise patient to avoid grapefruit products'),
('Digoxin', 'digoxin', 'Furosemide', 'furosemide', 'moderate', 'Diuretics can increase digoxin toxicity risk', 'Monitor digoxin levels and electrolytes'),
('Paracetamol', 'acetaminophen', 'Alcohol', 'ethanol', 'moderate', 'Increased risk of liver damage', 'Advise patient to limit alcohol while taking paracetamol');

-- Create Views for Pharmacist Dashboard

-- View: Pending prescriptions requiring verification
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

-- View: Medicines expiring soon
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

-- View: Low stock items needing reorder
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