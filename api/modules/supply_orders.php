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
                    case 'pending':
                        getPendingOrders($pdo);
                        break;
                    case 'details':
                        getOrderDetails($pdo, $_GET['id']);
                        break;
                    case 'low_stock':
                        getLowStockItems($pdo);
                        break;
                    default:
                        getAllOrders($pdo);
                }
            } else {
                getAllOrders($pdo);
            }
            break;
            
        case 'POST':
            if (isset($input['action'])) {
                switch ($input['action']) {
                    case 'create':
                        createSupplyOrder($pdo, $input);
                        break;
                    case 'receive':
                        receiveSupplyOrder($pdo, $input);
                        break;
                    case 'update_status':
                        updateOrderStatus($pdo, $input);
                        break;
                    default:
                        createSupplyOrder($pdo, $input);
                }
            } else {
                createSupplyOrder($pdo, $input);
            }
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getAllOrders($pdo) {
    $stmt = $pdo->prepare("
        SELECT so.*, u1.full_name as ordered_by_name, u2.full_name as received_by_name,
               COUNT(soi.item_id) as item_count
        FROM supply_orders so
        LEFT JOIN users u1 ON so.ordered_by = u1.user_id
        LEFT JOIN users u2 ON so.received_by = u2.user_id
        LEFT JOIN supply_order_items soi ON so.order_id = soi.order_id
        GROUP BY so.order_id
        ORDER BY so.created_at DESC
    ");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $orders]);
}

function getPendingOrders($pdo) {
    $stmt = $pdo->prepare("
        SELECT so.*, u.full_name as ordered_by_name, COUNT(soi.item_id) as item_count
        FROM supply_orders so
        LEFT JOIN users u ON so.ordered_by = u.user_id
        LEFT JOIN supply_order_items soi ON so.order_id = soi.order_id
        WHERE so.status IN ('pending', 'ordered')
        GROUP BY so.order_id
        ORDER BY so.expected_delivery ASC
    ");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $orders]);
}

function getOrderDetails($pdo, $orderId) {
    // Get order details
    $stmt = $pdo->prepare("
        SELECT so.*, u1.full_name as ordered_by_name, u2.full_name as received_by_name
        FROM supply_orders so
        LEFT JOIN users u1 ON so.ordered_by = u1.user_id
        LEFT JOIN users u2 ON so.received_by = u2.user_id
        WHERE so.order_id = ?
    ");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        throw new Exception('Order not found');
    }
    
    // Get order items
    $stmt = $pdo->prepare("
        SELECT * FROM supply_order_items 
        WHERE order_id = ?
        ORDER BY medicine_name ASC
    ");
    $stmt->execute([$orderId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $order['items'] = $items;
    
    echo json_encode(['success' => true, 'data' => $order]);
}

function getLowStockItems($pdo) {
    $stmt = $pdo->query("SELECT * FROM low_stock_items ORDER BY quantity ASC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $items]);
}

function createSupplyOrder($pdo, $data) {
    $pdo->beginTransaction();
    
    try {
        // Generate order number
        $orderNumber = 'SO-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        // Create supply order
        $stmt = $pdo->prepare("
            INSERT INTO supply_orders (order_number, supplier_name, supplier_contact, order_date, expected_delivery, total_amount, ordered_by, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $orderNumber,
            $data['supplier_name'],
            $data['supplier_contact'] ?? null,
            $data['order_date'],
            $data['expected_delivery'] ?? null,
            $data['total_amount'] ?? 0,
            $data['ordered_by'],
            $data['notes'] ?? null
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        // Add order items
        $totalAmount = 0;
        foreach ($data['items'] as $item) {
            $itemTotal = $item['quantity_ordered'] * $item['unit_cost'];
            $totalAmount += $itemTotal;
            
            $stmt = $pdo->prepare("
                INSERT INTO supply_order_items (order_id, medicine_name, generic_name, quantity_ordered, unit_cost, total_cost)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $orderId,
                $item['medicine_name'],
                $item['generic_name'] ?? null,
                $item['quantity_ordered'],
                $item['unit_cost'],
                $itemTotal
            ]);
        }
        
        // Update total amount
        $stmt = $pdo->prepare("UPDATE supply_orders SET total_amount = ? WHERE order_id = ?");
        $stmt->execute([$totalAmount, $orderId]);
        
        $pdo->commit();
        echo json_encode(['success' => true, 'order_id' => $orderId, 'order_number' => $orderNumber]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function receiveSupplyOrder($pdo, $data) {
    $pdo->beginTransaction();
    
    try {
        // Update order status
        $stmt = $pdo->prepare("
            UPDATE supply_orders 
            SET status = 'received', received_by = ?
            WHERE order_id = ?
        ");
        $stmt->execute([$data['received_by'], $data['order_id']]);
        
        // Update received quantities and add to inventory
        foreach ($data['items'] as $item) {
            // Update order item
            $stmt = $pdo->prepare("
                UPDATE supply_order_items 
                SET quantity_received = ?, batch_number = ?, expiry_date = ?
                WHERE item_id = ?
            ");
            $stmt->execute([
                $item['quantity_received'],
                $item['batch_number'] ?? null,
                $item['expiry_date'] ?? null,
                $item['item_id']
            ]);
            
            // Add to inventory
            if ($item['quantity_received'] > 0) {
                $stmt = $pdo->prepare("
                    INSERT INTO inventory (name, generic_name, batch_number, quantity, expiry_date, price, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $item['medicine_name'],
                    $item['generic_name'] ?? null,
                    $item['batch_number'] ?? 'BATCH-' . date('Ymd') . '-' . rand(100, 999),
                    $item['quantity_received'],
                    $item['expiry_date'] ?? date('Y-m-d', strtotime('+2 years')),
                    $item['unit_cost'] * 1.3, // Add 30% markup
                    $data['received_by']
                ]);
            }
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Supply order received and inventory updated']);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function updateOrderStatus($pdo, $data) {
    $stmt = $pdo->prepare("
        UPDATE supply_orders 
        SET status = ?, notes = ?
        WHERE order_id = ?
    ");
    $stmt->execute([
        $data['status'],
        $data['notes'] ?? null,
        $data['order_id']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Order status updated successfully']);
}
?>