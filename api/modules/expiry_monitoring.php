<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['action'])) {
                switch ($_GET['action']) {
                    case 'expiring':
                        getExpiringMedicines($pdo);
                        break;
                    case 'alerts':
                        getExpiryAlerts($pdo);
                        break;
                    default:
                        getExpiringMedicines($pdo);
                }
            } else {
                getExpiringMedicines($pdo);
            }
            break;
            
        case 'POST':
            if (isset($input['action'])) {
                switch ($input['action']) {
                    case 'acknowledge':
                        acknowledgeAlert($pdo, $input);
                        break;
                    case 'generate_alerts':
                        generateExpiryAlerts($pdo);
                        break;
                    default:
                        throw new Exception('Invalid action');
                }
            }
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getExpiringMedicines($pdo) {
    $stmt = $pdo->query("SELECT * FROM expiring_medicines ORDER BY days_to_expiry ASC");
    $medicines = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Categorize by alert level
    $categorized = [
        'expired' => [],
        '30_days' => [],
        '90_days' => [],
        'safe' => []
    ];
    
    foreach ($medicines as $medicine) {
        $categorized[$medicine['alert_level']][] = $medicine;
    }
    
    echo json_encode(['success' => true, 'data' => $categorized]);
}

function getExpiryAlerts($pdo) {
    $stmt = $pdo->prepare("
        SELECT ea.*, i.name, i.generic_name, i.batch_number, i.quantity, i.expiry_date,
               u.full_name as acknowledged_by_name
        FROM expiry_alerts ea
        JOIN inventory i ON ea.inventory_id = i.inventory_id
        LEFT JOIN users u ON ea.acknowledged_by = u.user_id
        WHERE ea.acknowledged = FALSE
        ORDER BY ea.alert_date ASC
    ");
    $stmt->execute();
    $alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $alerts]);
}

function acknowledgeAlert($pdo, $data) {
    $stmt = $pdo->prepare("
        UPDATE expiry_alerts 
        SET acknowledged = TRUE, acknowledged_by = ?, acknowledged_at = NOW(), action_taken = ?
        WHERE alert_id = ?
    ");
    $stmt->execute([
        $data['acknowledged_by'],
        $data['action_taken'] ?? null,
        $data['alert_id']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Alert acknowledged successfully']);
}

function generateExpiryAlerts($pdo) {
    // Generate alerts for medicines expiring in 30 days, 90 days, or already expired
    $stmt = $pdo->prepare("
        INSERT INTO expiry_alerts (inventory_id, alert_type, alert_date)
        SELECT 
            inventory_id,
            CASE 
                WHEN DATEDIFF(expiry_date, CURDATE()) < 0 THEN 'expired'
                WHEN DATEDIFF(expiry_date, CURDATE()) <= 30 THEN '30_days'
                WHEN DATEDIFF(expiry_date, CURDATE()) <= 90 THEN '90_days'
            END as alert_type,
            CURDATE() as alert_date
        FROM inventory 
        WHERE DATEDIFF(expiry_date, CURDATE()) <= 90
        AND inventory_id NOT IN (
            SELECT inventory_id FROM expiry_alerts 
            WHERE alert_date = CURDATE()
        )
    ");
    $stmt->execute();
    
    $alertsGenerated = $stmt->rowCount();
    echo json_encode(['success' => true, 'message' => "$alertsGenerated expiry alerts generated"]);
}
?>