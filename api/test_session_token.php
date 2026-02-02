<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';
require_once 'modules/verify_session.php';

$headers = getallheaders();
$session_token = $headers['Authorization'] ?? '';

echo json_encode([
    'debug' => 'Session Token Test',
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers_received' => $headers,
    'authorization_header' => $session_token,
    'session_token_clean' => str_replace('Bearer ', '', $session_token),
    'database_connected' => $conn ? true : false,
    'timestamp' => date('Y-m-d H:i:s')
]);

if (!empty($session_token)) {
    $clean_token = str_replace('Bearer ', '', $session_token);
    $session = verifySession($conn, $clean_token);
    
    if ($session) {
        echo json_encode([
            'session_valid' => true,
            'user_info' => [
                'user_id' => $session['user_id'],
                'username' => $session['username'],
                'full_name' => $session['full_name'],
                'role' => $session['role']
            ]
        ]);
    } else {
        echo json_encode([
            'session_valid' => false,
            'message' => 'Invalid or expired session'
        ]);
    }
}
?>