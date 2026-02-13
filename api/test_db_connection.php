<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test database connection
$host = "localhost";
$db_name = "pharmacy_system";
$username = "root";
$password = "";

try {
    // Test mysqli connection
    $conn = new mysqli($host, $username, $password, $db_name);
    
    if ($conn->connect_error) {
        echo json_encode([
            'success' => false,
            'message' => 'Connection failed: ' . $conn->connect_error,
            'database' => $db_name
        ]);
        exit;
    }
    
    // Check if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    $users_table_exists = $result->num_rows > 0;
    
    // Count users if table exists
    $user_count = 0;
    if ($users_table_exists) {
        $count_result = $conn->query("SELECT COUNT(*) as count FROM users");
        $row = $count_result->fetch_assoc();
        $user_count = $row['count'];
    }
    
    // Get all tables
    $tables_result = $conn->query("SHOW TABLES");
    $tables = [];
    while ($row = $tables_result->fetch_array()) {
        $tables[] = $row[0];
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Connected successfully to database',
        'database' => $db_name,
        'users_table_exists' => $users_table_exists,
        'user_count' => $user_count,
        'tables' => $tables,
        'table_count' => count($tables)
    ], JSON_PRETTY_PRINT);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'database' => $db_name
    ]);
}
?>
