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
    // Verify session
    $headers = getallheaders();
    $session_token = $headers['Authorization'] ?? '';
    
    if (empty($session_token)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit();
    }
    
    $session_token = str_replace('Bearer ', '', $session_token);
    $session = verifySession($conn, $session_token);
    
    if (!$session) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
        exit();
    }
    
    try {
        // Get unique customers from sales table with their purchase history
        $query = "
            SELECT 
                customer_name,
                COUNT(*) as total_purchases,
                SUM(total_revenue) as total_spent,
                MAX(sale_date) as last_purchase,
                MIN(sale_date) as first_purchase,
                GROUP_CONCAT(DISTINCT notes) as contact_info
            FROM sales 
            WHERE customer_name IS NOT NULL 
            AND customer_name != '' 
            AND customer_name != 'Walk-in Customer'
            GROUP BY customer_name
            ORDER BY total_spent DESC, last_purchase DESC
        ";
        
        $result = $conn->query($query);
        $customers = [];
        $id = 1;
        
        while ($row = $result->fetch_assoc()) {
            // Extract phone from notes if available
            $phone = '';
            $email = '';
            if ($row['contact_info']) {
                if (preg_match('/Phone:\s*([0-9\+\-\s]+)/', $row['contact_info'], $matches)) {
                    $phone = trim($matches[1]);
                }
                if (preg_match('/Email:\s*([^\s,]+@[^\s,]+)/', $row['contact_info'], $matches)) {
                    $email = trim($matches[1]);
                }
            }
            
            $customers[] = [
                'id' => $id++,
                'name' => $row['customer_name'],
                'phone' => $phone,
                'email' => $email,
                'total_purchases' => (int)$row['total_purchases'],
                'total_spent' => (float)$row['total_spent'],
                'last_purchase' => $row['last_purchase'],
                'first_purchase' => $row['first_purchase'],
                'status' => 'active',
                'loyalty_points' => floor($row['total_spent'] / 100) // 1 point per 100 TSh
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $customers,
            'count' => count($customers)
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