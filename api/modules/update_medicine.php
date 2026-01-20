<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->inventory_id) && !empty($data->name) && isset($data->quantity) && isset($data->price)) {
    try {
        // Update inventory item
        $stmt = $db->prepare("UPDATE inventory 
                              SET name = ?, 
                                  generic_name = ?, 
                                  category = ?, 
                                  quantity = ?, 
                                  expiry_date = ?, 
                                  price = ?,
                                  updated_at = CURRENT_TIMESTAMP
                              WHERE inventory_id = ?");
        
        $result = $stmt->execute([
            $data->name,
            $data->generic_name ?? null,
            $data->category ?? null,
            intval($data->quantity),
            $data->expiry_date,
            floatval($data->price),
            intval($data->inventory_id)
        ]);

        if ($result) {
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Stock updated successfully",
                    "inventory_id" => $data->inventory_id
                ]);
            } else {
                echo json_encode([
                    "status" => "success",
                    "message" => "No changes made (data is the same)",
                    "inventory_id" => $data->inventory_id
                ]);
            }
        } else {
            throw new Exception("Failed to update stock");
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields: inventory_id, name, quantity, and price are required"
    ]);
}
?>
