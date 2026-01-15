<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Query the inventory table directly (no separate medicines table in this schema)
    $query = "SELECT 
                inventory_id,
                name, 
                generic_name, 
                category,
                batch_number, 
                quantity, 
                expiry_date,
                price,
                created_at,
                DATEDIFF(expiry_date, CURDATE()) as days_until_expiry
              FROM inventory 
              ORDER BY created_at DESC, expiry_date ASC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($inventory);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error fetching inventory: " . $e->getMessage()
    ]);
}
?>