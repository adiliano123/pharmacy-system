<?php
ob_start();
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

try {
    $today = date('Y-m-d');
    $thirtyDaysFromNow = date('Y-m-d', strtotime('+30 days'));
    
    // 1. Expiring Medicines (within 30 days)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as expiringMedicines 
        FROM inventory 
        WHERE expiry_date <= ? AND quantity > 0
    ");
    $stmt->bind_param("s", $thirtyDaysFromNow);
    $stmt->execute();
    $expiringMedicines = $stmt->get_result()->fetch_assoc()['expiringMedicines'];
    
    // 2. Low Stock Items (quantity <= 10)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as lowStockItems 
        FROM inventory 
        WHERE quantity <= 10 AND quantity > 0
    ");
    $stmt->execute();
    $lowStockItems = $stmt->get_result()->fetch_assoc()['lowStockItems'];
    
    // 3. Total Inventory Items
    $stmt = $conn->prepare("SELECT COUNT(*) as totalItems FROM inventory WHERE quantity > 0");
    $stmt->execute();
    $totalItems = $stmt->get_result()->fetch_assoc()['totalItems'];
    
    // 4. Today's Sales (for monitoring)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as todaySales, COALESCE(SUM(total_revenue), 0) as todayRevenue 
        FROM sales 
        WHERE DATE(sale_date) = ?
    ");
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $todayStats = $stmt->get_result()->fetch_assoc();
    
    // 5. Inventory Value
    $stmt = $conn->prepare("
        SELECT COALESCE(SUM(quantity * price), 0) as inventoryValue 
        FROM inventory 
        WHERE quantity > 0
    ");
    $stmt->execute();
    $inventoryValue = $stmt->get_result()->fetch_assoc()['inventoryValue'];
    
    // 6. Critical Stock Items (quantity <= 5)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as criticalStock 
        FROM inventory 
        WHERE quantity <= 5 AND quantity > 0
    ");
    $stmt->execute();
    $criticalStock = $stmt->get_result()->fetch_assoc()['criticalStock'];
    
    // 7. Expired Items (already expired)
    $stmt = $conn->prepare("
        SELECT COUNT(*) as expiredItems 
        FROM inventory 
        WHERE expiry_date < CURDATE() AND quantity > 0
    ");
    $stmt->execute();
    $expiredItems = $stmt->get_result()->fetch_assoc()['expiredItems'];
    
    // 8. Recent Inventory Activity
    $stmt = $conn->prepare("
        SELECT 
            name,
            quantity,
            expiry_date,
            price,
            DATEDIFF(expiry_date, CURDATE()) as days_to_expiry
        FROM inventory 
        WHERE quantity > 0 
        ORDER BY expiry_date ASC 
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $recentItems = [];
    while ($row = $result->fetch_assoc()) {
        $recentItems[] = [
            'name' => $row['name'],
            'quantity' => (int)$row['quantity'],
            'expiry_date' => $row['expiry_date'],
            'price' => (float)$row['price'],
            'days_to_expiry' => (int)$row['days_to_expiry'],
            'status' => $row['days_to_expiry'] < 0 ? 'expired' : 
                       ($row['days_to_expiry'] <= 30 ? 'expiring_soon' : 'normal')
        ];
    }
    
    $stats = [
        'expiringMedicines' => (int)$expiringMedicines,
        'lowStockItems' => (int)$lowStockItems,
        'totalItems' => (int)$totalItems,
        'todaySales' => (int)$todayStats['todaySales'],
        'todayRevenue' => (float)$todayStats['todayRevenue'],
        'inventoryValue' => (float)$inventoryValue,
        'criticalStock' => (int)$criticalStock,
        'expiredItems' => (int)$expiredItems,
        'recentItems' => $recentItems,
        'pendingPrescriptions' => 0, // Mock data - would need prescriptions table
        'pendingOrders' => 0, // Mock data - would need orders table
        'counselingToday' => 0, // Mock data - would need counseling table
        'systemHealth' => [
            'inventory' => $criticalStock > 0 ? 'critical' : ($lowStockItems > 0 ? 'warning' : 'healthy'),
            'expiry' => $expiredItems > 0 ? 'critical' : ($expiringMedicines > 0 ? 'warning' : 'healthy'),
            'stock_level' => $totalItems > 0 ? 'healthy' : 'critical'
        ]
    ];
    
    ob_clean();
    echo json_encode([
        'success' => true,
        'data' => $stats,
        'debug' => 'Simple Pharmacist API without authentication'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

ob_end_flush();
?>