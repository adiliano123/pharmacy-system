<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

function verifySession($conn, $session_token) {
    try {
        $stmt = $conn->prepare("
            SELECT 
                s.session_id, 
                s.user_id, 
                s.expires_at,
                u.username, 
                u.full_name, 
                u.email, 
                u.role, 
                u.is_active
            FROM user_sessions s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.session_id = ? AND s.expires_at > NOW()
        ");
        $stmt->bind_param("s", $session_token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        $session = $result->fetch_assoc();
        
        if (!$session['is_active']) {
            return null;
        }
        
        return $session;
    } catch (Exception $e) {
        return null;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $headers = getallheaders();
    $session_token = $headers['Authorization'] ?? '';
    
    if (empty($session_token)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No session token provided']);
        exit();
    }
    
    // Remove "Bearer " prefix if present
    $session_token = str_replace('Bearer ', '', $session_token);
    
    $session = verifySession($conn, $session_token);
    
    if ($session) {
        unset($session['expires_at']); // Don't expose expiry time
        echo json_encode([
            'success' => true,
            'valid' => true,
            'user' => [
                'user_id' => $session['user_id'],
                'username' => $session['username'],
                'full_name' => $session['full_name'],
                'email' => $session['email'],
                'role' => $session['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'valid' => false, 'message' => 'Invalid or expired session']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
