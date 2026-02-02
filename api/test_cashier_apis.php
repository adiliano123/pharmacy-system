<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

echo "<h1>Cashier APIs Test</h1>";
echo "<p><strong>Database Connection:</strong> " . ($conn ? "✅ Connected" : "❌ Failed") . "</p>";

// Test 1: Check if sales table has data
$result = $conn->query("SELECT COUNT(*) as count FROM sales");
$salesCount = $result->fetch_assoc()['count'];
echo "<p><strong>Sales Records:</strong> {$salesCount} records found</p>";

// Test 2: Check today's sales
$today = date('Y-m-d');
$result = $conn->query("SELECT COUNT(*) as count, COALESCE(SUM(total_revenue), 0) as total FROM sales WHERE DATE(sale_date) = '$today'");
$todayData = $result->fetch_assoc();
echo "<p><strong>Today's Sales:</strong> {$todayData['count']} transactions, TSh " . number_format($todayData['total']) . "</p>";

// Test 3: Check user sessions
$result = $conn->query("SELECT COUNT(*) as count FROM user_sessions WHERE expires_at > NOW()");
$sessionsCount = $result->fetch_assoc()['count'];
echo "<p><strong>Active Sessions:</strong> {$sessionsCount} sessions</p>";

// Test 4: Sample sales data
echo "<h2>Sample Sales Data:</h2>";
$result = $conn->query("SELECT s.*, u.full_name FROM sales s LEFT JOIN users u ON s.sold_by = u.user_id ORDER BY s.sale_date DESC LIMIT 5");
if ($result->num_rows > 0) {
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Medicine</th><th>Quantity</th><th>Revenue</th><th>Date</th><th>Cashier</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td>{$row['name']}</td>";
        echo "<td>{$row['quantity_sold']}</td>";
        echo "<td>TSh " . number_format($row['total_revenue']) . "</td>";
        echo "<td>{$row['sale_date']}</td>";
        echo "<td>{$row['full_name']}</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>❌ No sales data found</p>";
}

// Test 5: API Endpoints
echo "<h2>Test API Endpoints:</h2>";
echo "<p><a href='modules/get_cashier_stats.php' target='_blank'>Test Cashier Stats API</a></p>";
echo "<p><a href='modules/get_sales.php' target='_blank'>Test Sales History API</a></p>";
echo "<p><a href='modules/get_daily_reports.php' target='_blank'>Test Daily Reports API</a></p>";

echo "<h2>Add Sample Data:</h2>";
if (isset($_GET['add_sample'])) {
    // Add sample sales data
    $sampleSales = [
        ['Paracetamol 500mg', 'BATCH001', 2, 1000, 1, 'John Doe'],
        ['Amoxicillin 250mg', 'BATCH002', 1, 2500, 1, 'Jane Smith'],
        ['Ibuprofen 400mg', 'BATCH003', 3, 1500, 1, 'Bob Wilson']
    ];
    
    foreach ($sampleSales as $sale) {
        $stmt = $conn->prepare("INSERT INTO sales (name, batch_number, quantity_sold, total_revenue, sold_by, customer_name, notes) VALUES (?, ?, ?, ?, ?, ?, 'Sample POS Sale - Payment: CASH')");
        $stmt->bind_param("ssidis", $sale[0], $sale[1], $sale[2], $sale[3], $sale[4], $sale[5]);
        $stmt->execute();
    }
    echo "<p>✅ Sample sales data added! <a href='?'>Refresh to see</a></p>";
} else {
    echo "<p><a href='?add_sample=1'>Click here to add sample sales data</a></p>";
}
?>