<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'config/database.php';

try {
    // Check if inventory table exists and has data
    $result = $conn->query("SELECT COUNT(*) as count FROM inventory");
    $inventoryCount = $result->fetch_assoc()['count'];
    
    // Check if sales table exists
    $result = $conn->query("SHOW TABLES LIKE 'sales'");
    $salesTableExists = $result->num_rows > 0;
    
    // Check if user_sessions table exists
    $result = $conn->query("SHOW TABLES LIKE 'user_sessions'");
    $sessionsTableExists = $result->num_rows > 0;
    
    // Get sample inventory item
    $sampleInventory = null;
    if ($inventoryCount > 0) {
        $result = $conn->query("SELECT inventory_id, name, batch_number, quantity, price FROM inventory LIMIT 1");
        $sampleInventory = $result->fetch_assoc();
    }
    
    // Check active sessions
    $activeSessions = 0;
    if ($sessionsTableExists) {
        $result = $conn->query("SELECT COUNT(*) as count FROM user_sessions WHERE expires_at > NOW()");
        $activeSessions = $result->fetch_assoc()['count'];
    }
    
    echo json_encode([
        'status' => 'success',
        'checks' => [
            'inventory_table' => true,
            'inventory_count' => $inventoryCount,
            'sales_table' => $salesTableExists,
            'sessions_table' => $sessionsTableExists,
            'active_sessions' => $activeSessions
        ],
        'sample_inventory' => $sampleInventory,
        'message' => $inventoryCount > 0 
            ? 'System ready for dispensing' 
            : 'No inventory items found. Add stock first.',
        'instructions' => [
            '1. Make sure you are logged in',
            '2. Go to Inventory tab',
            '3. Enter quantity in the input field',
            '4. Click Dispense button',
            '5. Check browser console (F12) for detailed errors'
        ]
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
