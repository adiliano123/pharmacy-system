-- Fix Users with Correct Password Hashes
-- Run this SQL script in phpMyAdmin or MySQL command line

USE pharmacy_system;

-- Delete existing users (if any)
DELETE FROM users;

-- Insert users with properly hashed passwords
-- Password for all users: admin123
-- These hashes are generated using PHP's password_hash() function

INSERT INTO users (username, password, full_name, email, role, is_active) VALUES
('admin', '$2y$10$YourHashWillBeGeneratedByPHP', 'System Administrator', 'admin@pharmacy.com', 'admin', 1);

-- Note: The above won't work because we need PHP to generate the hash
-- Instead, use the setup_users.php script
