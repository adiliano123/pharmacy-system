<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->batch_number)) {
    try {
        $db->beginTransaction();

        // 1. Insert into medicines table
        $stmt1 = $db->prepare("INSERT INTO medicines (name, generic_name, category) VALUES (?, ?, ?)");
        $stmt1->execute([$data->name, $data->generic_name, $data->category]);
        $medicine_id = $db->lastInsertId();

        // 2. Insert into inventory (batch) table
        $stmt2 = $db->prepare("INSERT INTO inventory (medicine_id, batch_number, quantity, expiry_date, price_per_unit) VALUES (?, ?, ?, ?, ?)");
        $stmt2->execute([
            $medicine_id, 
            $data->batch_number, 
            $data->quantity, 
            $data->expiry_date, 
            $data->price
        ]);

        $db->commit();
        echo json_encode(["status" => "success", "message" => "Medicine added successfully"]);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>