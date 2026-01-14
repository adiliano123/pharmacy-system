<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->inventory_id) && !empty($data->qty)) {
    try {
        $db->beginTransaction();

        // 1. Check if enough stock exists
        $check = $db->prepare("SELECT quantity FROM inventory WHERE id = ?");
        $check->execute([$data->inventory_id]);
        $current_qty = $check->fetchColumn();

        if ($current_qty < $data->qty) {
            throw new Exception("Not enough stock available!");
        }

        // 2. Subtract from Inventory
        $update = $db->prepare("UPDATE inventory SET quantity = quantity - ? WHERE id = ?");
        $update->execute([$data->qty, $data->inventory_id]);

        // 3. Log the Sale
        $log = $db->prepare("INSERT INTO sales (inventory_id, quantity_sold) VALUES (?, ?)");
        $log->execute([$data->inventory_id, $data->qty]);

        $db->commit();
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}