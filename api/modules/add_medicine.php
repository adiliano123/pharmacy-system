<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->batch_number) && !empty($data->quantity) && !empty($data->price)) {
    try {
        // Get user_id from session token if available
        $created_by = null;
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
            $sessionStmt = $db->prepare("SELECT user_id FROM user_sessions WHERE session_id = ? AND expires_at > NOW()");
            $sessionStmt->execute([$token]);
            $session = $sessionStmt->fetch(PDO::FETCH_ASSOC);
            if ($session) {
                $created_by = $session['user_id'];
            }
        }

        // Insert directly into inventory table (no separate medicines table in this schema)
        $stmt = $db->prepare("INSERT INTO inventory (name, generic_name, category, batch_number, quantity, expiry_date, price, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data->name, 
            $data->generic_name ?? null, 
            $data->category ?? null,
            $data->batch_number, 
            intval($data->quantity), 
            $data->expiry_date, 
            floatval($data->price),
            $created_by
        ]);

        $inventory_id = $db->lastInsertId();

        echo json_encode([
            "status" => "success", 
            "message" => "Medicine batch added successfully",
            "inventory_id" => $inventory_id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        $errorMsg = $e->getMessage();
        
        // Check for duplicate batch number
        if ($e->getCode() == 23000) {
            $errorMsg = "Batch number already exists. Please use a unique batch number.";
        }
        
        echo json_encode([
            "status" => "error", 
            "message" => $errorMsg
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Missing required fields: name, batch_number, quantity, and price are required"
    ]);
}
?>