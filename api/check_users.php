<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'config/database.php';

try {
    // Check if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Users table does not exist. Please import pharmacy_system_with_auth.sql first.',
            'solution' => 'Import the SQL file via phpMyAdmin or run: mysql -u root < pharmacy_system_with_auth.sql'
        ], JSON_PRETTY_PRINT);
        exit();
    }
    
    // Get all users
    $result = $conn->query("SELECT user_id, username, full_name, email, role, is_active, created_at, last_login FROM users");
    $users = [];
    
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    if (count($users) === 0) {
        echo json_encode([
            'status' => 'warning',
            'message' => 'No users found in database',
            'solution' => 'Run setup_users.php to create default users',
            'url' => 'http://localhost/pharmacy-system/api/setup_users.php',
            'users_count' => 0
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'status' => 'success',
            'message' => 'Users found in database',
            'users_count' => count($users),
            'users' => $users,
            'note' => 'If you cannot login, run setup_users.php to reset passwords to admin123'
        ], JSON_PRETTY_PRINT);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'solution' => 'Check database connection and ensure pharmacy_system database exists'
    ], JSON_PRETTY_PRINT);
}
?>
