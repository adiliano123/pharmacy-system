<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    'success' => true,
    'method' => $_SERVER['REQUEST_METHOD'],
    'message' => 'Method test endpoint working',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'],
        'REQUEST_URI' => $_SERVER['REQUEST_URI'],
        'HTTP_HOST' => $_SERVER['HTTP_HOST'],
        'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME']
    ]
]);
?>