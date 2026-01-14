<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get sales with employee information
        $query = "
            SELECT 
                s.id,
                s.inventory_id,
                s.batch_number,
                s.name,
                s.quantity_sold,
                s.total_revenue,
                s.sale_date,
                s.customer_name,
                s.notes,
                u.full_name AS employee_name,
                u.username AS employee_username,
                u.role AS employee_role
            FROM sales s
            LEFT JOIN users u ON s.sold_by = u.user_id
            ORDER BY s.sale_date DESC
        ";
        
        $result = $conn->query($query);
        $sales = [];
        
        while ($row = $result->fetch_assoc()) {
            $sales[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $sales,
            'count' => count($sales)
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
