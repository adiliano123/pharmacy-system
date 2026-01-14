<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'config/database.php';

$response = [
    'database_connection' => false,
    'tables_exist' => [],
    'users_count' => 0,
    'sample_user' => null,
    'password_test' => null
];

try {
    // Test database connection
    if ($conn->ping()) {
        $response['database_connection'] = true;
        $response['database_name'] = $db_name;
    }
    
    // Check if tables exist
    $tables = ['users', 'inventory', 'sales', 'user_sessions', 'activity_log'];
    foreach ($tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        $response['tables_exist'][$table] = $result->num_rows > 0;
    }
    
    // Count users
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        $response['users_count'] = $row['count'];
    }
    
    // Get sample user (without password)
    $result = $conn->query("SELECT user_id, username, full_name, role, is_active FROM users LIMIT 1");
    if ($result && $result->num_rows > 0) {
        $response['sample_user'] = $result->fetch_assoc();
    }
    
    // Test password verification
    $test_password = 'admin123';
    $test_hash = password_hash($test_password, PASSWORD_DEFAULT);
    $response['password_test'] = [
        'password' => $test_password,
        'hash_generated' => substr($test_hash, 0, 20) . '...',
        'verification' => password_verify($test_password, $test_hash)
    ];
    
    $response['success'] = true;
    $response['message'] = 'All checks completed';
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
