<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

try {
    // Check if required tables exist
    $tables_to_check = ['inventory', 'sales', 'users', 'user_sessions', 'activity_log'];
    $table_status = [];
    
    foreach ($tables_to_check as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        $table_status[$table] = $result->num_rows > 0;
        
        if ($table_status[$table]) {
            // Get table structure
            $structure = $conn->query("DESCRIBE $table");
            $columns = [];
            while ($row = $structure->fetch_assoc()) {
                $columns[] = $row['Field'];
            }
            $table_status[$table . '_columns'] = $columns;
            
            // Get row count
            $count_result = $conn->query("SELECT COUNT(*) as count FROM $table");
            $count = $count_result->fetch_assoc()['count'];
            $table_status[$table . '_count'] = $count;
        }
    }
    
    // Check inventory sample data
    $inventory_sample = [];
    $result = $conn->query("SELECT inventory_id, name, quantity, price FROM inventory LIMIT 5");
    while ($row = $result->fetch_assoc()) {
        $inventory_sample[] = $row;
    }
    
    // Check active sessions
    $active_sessions = [];
    $result = $conn->query("SELECT session_id, user_id, expires_at FROM user_sessions WHERE expires_at > NOW() LIMIT 3");
    while ($row = $result->fetch_assoc()) {
        $active_sessions[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'database_connected' => true,
        'tables' => $table_status,
        'inventory_sample' => $inventory_sample,
        'active_sessions' => $active_sessions,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'database_connected' => false
    ]);
}
?>