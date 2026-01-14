<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    $session_token = $headers['Authorization'] ?? '';
    
    if (empty($session_token)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Session token required']);
        exit();
    }
    
    // Remove "Bearer " prefix if present
    $session_token = str_replace('Bearer ', '', $session_token);
    
    try {
        // Get user_id before deleting session
        $stmt = $conn->prepare("SELECT user_id FROM user_sessions WHERE session_id = ?");
        $stmt->bind_param("s", $session_token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $session = $result->fetch_assoc();
            $user_id = $session['user_id'];
            
            // Delete session
            $stmt = $conn->prepare("DELETE FROM user_sessions WHERE session_id = ?");
            $stmt->bind_param("s", $session_token);
            $stmt->execute();
            
            // Log activity
            $action = "LOGOUT";
            $description = "User logged out";
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
            $stmt = $conn->prepare("INSERT INTO activity_log (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("isss", $user_id, $action, $description, $ip_address);
            $stmt->execute();
            
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Session not found']);
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
