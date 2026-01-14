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
require_once 'verify_session.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verify session (optional - can be public or restricted)
    $headers = getallheaders();
    $session_token = $headers['Authorization'] ?? '';
    
    try {
        // Get employee sales summary
        $query = "
            SELECT 
                u.user_id,
                u.full_name,
                u.username,
                u.role,
                COUNT(s.id) AS total_sales,
                COALESCE(SUM(s.quantity_sold), 0) AS total_items_sold,
                COALESCE(SUM(s.total_revenue), 0) AS total_revenue,
                MIN(s.sale_date) AS first_sale,
                MAX(s.sale_date) AS last_sale
            FROM users u
            LEFT JOIN sales s ON u.user_id = s.sold_by
            WHERE u.is_active = TRUE
            GROUP BY u.user_id, u.full_name, u.username, u.role
            ORDER BY total_revenue DESC
        ";
        
        $result = $conn->query($query);
        $employees = [];
        
        while ($row = $result->fetch_assoc()) {
            $employees[] = [
                'user_id' => $row['user_id'],
                'full_name' => $row['full_name'],
                'username' => $row['username'],
                'role' => $row['role'],
                'total_sales' => (int)$row['total_sales'],
                'total_items_sold' => (int)$row['total_items_sold'],
                'total_revenue' => (float)$row['total_revenue'],
                'first_sale' => $row['first_sale'],
                'last_sale' => $row['last_sale']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $employees,
            'count' => count($employees)
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
