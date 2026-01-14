<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'config/database.php';

$response = [
    'success' => false,
    'users_created' => [],
    'errors' => []
];

try {
    // Default password for all users
    $default_password = 'admin123';
    $hashed_password = password_hash($default_password, PASSWORD_DEFAULT);
    
    // Users to create
    $users = [
        [
            'username' => 'admin',
            'password' => $hashed_password,
            'full_name' => 'System Administrator',
            'email' => 'admin@pharmacy.com',
            'role' => 'admin'
        ],
        [
            'username' => 'pharmacist1',
            'password' => $hashed_password,
            'full_name' => 'John Pharmacist',
            'email' => 'john@pharmacy.com',
            'role' => 'pharmacist'
        ],
        [
            'username' => 'cashier1',
            'password' => $hashed_password,
            'full_name' => 'Jane Cashier',
            'email' => 'jane@pharmacy.com',
            'role' => 'cashier'
        ]
    ];
    
    // Clear existing users (optional - comment out if you want to keep existing users)
    // $conn->query("TRUNCATE TABLE users");
    
    foreach ($users as $user) {
        // Check if user already exists
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
        $stmt->bind_param("s", $user['username']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Update existing user
            $stmt = $conn->prepare("UPDATE users SET password = ?, full_name = ?, email = ?, role = ?, is_active = 1 WHERE username = ?");
            $stmt->bind_param("sssss", $user['password'], $user['full_name'], $user['email'], $user['role'], $user['username']);
            
            if ($stmt->execute()) {
                $response['users_created'][] = [
                    'username' => $user['username'],
                    'action' => 'updated',
                    'password' => $default_password
                ];
            } else {
                $response['errors'][] = "Failed to update user: " . $user['username'];
            }
        } else {
            // Insert new user
            $stmt = $conn->prepare("INSERT INTO users (username, password, full_name, email, role, is_active) VALUES (?, ?, ?, ?, ?, 1)");
            $stmt->bind_param("sssss", $user['username'], $user['password'], $user['full_name'], $user['email'], $user['role']);
            
            if ($stmt->execute()) {
                $response['users_created'][] = [
                    'username' => $user['username'],
                    'action' => 'created',
                    'password' => $default_password
                ];
            } else {
                $response['errors'][] = "Failed to create user: " . $user['username'];
            }
        }
    }
    
    $response['success'] = true;
    $response['message'] = 'Users setup completed';
    $response['default_password'] = $default_password;
    $response['note'] = 'All users have the same password: ' . $default_password;
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
