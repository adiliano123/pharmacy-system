<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'config/database.php';

$response = [
    'success' => false,
    'users' => [],
    'database_status' => 'unknown',
    'table_exists' => false
];

try {
    // Check if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    $response['table_exists'] = $result->num_rows > 0;
    
    if ($response['table_exists']) {
        // Get all users
        $result = $conn->query("SELECT user_id, username, full_name, email, role, is_active, created_at, last_login FROM users ORDER BY user_id");
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        $response['users'] = $users;
        $response['user_count'] = count($users);
        $response['success'] = true;
        $response['database_status'] = 'connected';
        $response['message'] = 'Users table found with ' . count($users) . ' users';
        
        // Check specifically for cashier1
        $cashier_exists = false;
        foreach ($users as $user) {
            if ($user['username'] === 'cashier1') {
                $cashier_exists = true;
                $response['cashier1_status'] = [
                    'exists' => true,
                    'is_active' => (bool)$user['is_active'],
                    'full_name' => $user['full_name'],
                    'role' => $user['role']
                ];
                break;
            }
        }
        
        if (!$cashier_exists) {
            $response['cashier1_status'] = [
                'exists' => false,
                'message' => 'Cashier1 user not found. Run setup_users.php to create default users.'
            ];
        }
        
    } else {
        $response['message'] = 'Users table does not exist. Import pharmacy_system_with_auth.sql first.';
        $response['database_status'] = 'connected_but_no_table';
    }
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
    $response['database_status'] = 'connection_failed';
    $response['message'] = 'Database connection failed: ' . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>