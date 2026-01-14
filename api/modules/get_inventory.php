<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// SQL to join medicines with their stock batches
$query = "SELECT m.name, m.generic_name, i.batch_number, i.quantity, i.expiry_date 
          FROM medicines m 
          JOIN inventory i ON m.id = i.medicine_id 
          ORDER BY i.expiry_date ASC";

$stmt = $db->prepare($query);
$stmt->execute();

$inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($inventory);

// SQL to calculate days remaining
$query = "SELECT m.name, m.generic_name, i.batch_number, i.quantity, i.expiry_date,
          DATEDIFF(i.expiry_date, CURDATE()) as days_left
          FROM medicines m 
          JOIN inventory i ON m.id = i.medicine_id 
          ORDER BY i.expiry_date ASC";
?>