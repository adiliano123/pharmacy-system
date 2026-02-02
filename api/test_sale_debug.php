<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';
require_once 'modules/verify_session.php';

echo json_encode([
    'debug' => 'Sale processing debug endpoint',
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers' => getallheaders(),
    'post_data' => file_get_contents("php://input"),
    'database_connection' => $conn ? 'Connected' : 'Failed',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>