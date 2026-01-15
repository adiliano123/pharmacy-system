<?php
header("Content-Type: application/json");

include_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if database exists and tables are present
    $tables = ['users', 'inventory', 'sales', 'user_sessions'];
    $results = [];
    
    foreach ($tables as $table) {
        $stmt = $db->query("SHOW TABLES LIKE '$table'");
        $exists = $stmt->rowCount() > 0;
        $results[$table] = $exists;
        
        if ($exists) {
            // Get row count
            $countStmt = $db->query("SELECT COUNT(*) as count FROM $table");
            $count = $countStmt->fetch(PDO::FETCH_ASSOC);
            $results[$table . '_count'] = $count['count'];
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'database' => 'pharmacy_system',
        'tables' => $results,
        'message' => 'Database connection successful'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
