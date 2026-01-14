<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Updated SQL to calculate total_revenue (Qty * Price)
$query = "SELECT 
            s.id, 
            m.name, 
            i.batch_number, 
            s.quantity_sold, 
            i.price_per_unit,
            (s.quantity_sold * i.price_per_unit) as total_revenue, 
            s.sale_date 
          FROM sales s
          JOIN inventory i ON s.inventory_id = i.id
          JOIN medicines m ON i.medicine_id = m.id
          ORDER BY s.sale_date DESC";

$stmt = $db->prepare($query);
$stmt->execute();
$sales = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($sales);
?>