<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        exit();
    }
    
    try {
        $stmt = $conn->prepare("SELECT user_id, username, password, full_name, email, role, is_active FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
            exit();
        }
        
        $user = $result->fetch_assoc();
        
        if (!$user['is_active']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Account is deactivated']);
            exit();
        }
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Generate session token
            $session_id = bin2hex(random_bytes(32));
            $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
            $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
            
            // Store session
            $stmt = $conn->prepare("INSERT INTO user_sessions (session_id, user_id, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sisss", $session_id, $user['user_id'], $expires_at, $ip_address, $user_agent);
            $stmt->execute();
            
            // Update last login
            $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
            $stmt->bind_param("i", $user['user_id']);
            $stmt->execute();
            
            // Log activity
            $action = "LOGIN";
            $description = "User logged in successfully";
            $stmt = $conn->prepare("INSERT INTO activity_log (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("isss", $user['user_id'], $action, $description, $ip_address);
            $stmt->execute();
            
            // Return user data and session token
            unset($user['password']); // Don't send password back
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'session_token' => $session_id,
                'user' => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
