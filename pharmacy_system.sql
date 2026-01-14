-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

-- 2. Medicine Information Table
CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    category VARCHAR(100),
    unit VARCHAR(50),
    reorder_level INT DEFAULT 10
);

-- 3. Inventory Batches Table
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT,
    batch_number VARCHAR(100) UNIQUE,
    quantity INT NOT NULL,
    expiry_date DATE NOT NULL,
    price_per_unit DECIMAL(10,2),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pharmacist') DEFAULT 'pharmacist'
);

-- 5. Insert a Default Admin (Password is 'admin123' hashed)
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2y$10$8K/S7N0hXv.Y7X8X8X8X8uR0jH5yE8f8g8h8i8j8k8l8m8n8o8p8q', 'admin');