<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'list':
            if ($method === 'GET') {
                getAuditLogs($db);
            }
            break;
            
        case 'clear':
            if ($method === 'POST' || $method === 'DELETE') {
                clearAuditLogs($db);
            }
            break;
            
        case 'export':
            if ($method === 'GET') {
                exportAuditLogs($db);
            }
            break;
            
        default:
            throw new Exception('Invalid action specified');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function getAuditLogs($db) {
    try {
        // Create audit_logs table if it doesn't exist
        createAuditLogsTable($db);
        
        // Get filter parameters
        $dateFrom = $_GET['date_from'] ?? date('Y-m-d', strtotime('-7 days'));
        $dateTo = $_GET['date_to'] ?? date('Y-m-d');
        $user = $_GET['user'] ?? '';
        $action = $_GET['action_filter'] ?? '';
        $module = $_GET['module'] ?? '';
        $limit = (int)($_GET['limit'] ?? 100);
        $offset = (int)($_GET['offset'] ?? 0);
        
        // Build WHERE clause
        $whereConditions = [];
        $params = [];
        
        // Date range filter
        $whereConditions[] = "DATE(timestamp) BETWEEN ? AND ?";
        $params[] = $dateFrom;
        $params[] = $dateTo;
        
        // User filter
        if (!empty($user)) {
            $whereConditions[] = "user LIKE ?";
            $params[] = "%$user%";
        }
        
        // Action filter
        if (!empty($action)) {
            $whereConditions[] = "action LIKE ?";
            $params[] = "%$action%";
        }
        
        // Module filter
        if (!empty($module)) {
            $whereConditions[] = "module LIKE ?";
            $params[] = "%$module%";
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM audit_logs $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get logs with pagination
        $query = "SELECT id, user, action, module, description, details, ip_address, user_agent, timestamp 
                  FROM audit_logs 
                  $whereClause 
                  ORDER BY timestamp DESC 
                  LIMIT ? OFFSET ?";
        
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        
        $logs = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Parse JSON details
            if (!empty($row['details'])) {
                $row['details'] = json_decode($row['details'], true);
            }
            $logs[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'logs' => $logs,
            'total_count' => $totalCount,
            'limit' => $limit,
            'offset' => $offset
        ]);
    } catch (Exception $e) {
        throw new Exception('Error fetching audit logs: ' . $e->getMessage());
    }
}

function clearAuditLogs($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Optional: Only clear logs older than X days
        $retentionDays = $input['retention_days'] ?? null;
        
        if ($retentionDays) {
            $query = "DELETE FROM audit_logs WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)";
            $stmt = $db->prepare($query);
            $stmt->execute([$retentionDays]);
        } else {
            // Clear all logs
            $query = "DELETE FROM audit_logs";
            $stmt = $db->prepare($query);
            $stmt->execute();
        }
        
        $deletedCount = $stmt->rowCount();
        
        // Log this action
        logAuditAction($db, 'CLEAR_AUDIT_LOGS', 'System', 
            $retentionDays ? "Cleared audit logs older than $retentionDays days" : 'Cleared all audit logs', 
            ['deleted_count' => $deletedCount]
        );
        
        echo json_encode([
            'success' => true,
            'message' => "Cleared $deletedCount audit log entries",
            'deleted_count' => $deletedCount
        ]);
    } catch (Exception $e) {
        throw new Exception('Error clearing audit logs: ' . $e->getMessage());
    }
}

function exportAuditLogs($db) {
    try {
        $format = $_GET['format'] ?? 'csv';
        
        // Get the same filters as list function
        $dateFrom = $_GET['date_from'] ?? date('Y-m-d', strtotime('-7 days'));
        $dateTo = $_GET['date_to'] ?? date('Y-m-d');
        $user = $_GET['user'] ?? '';
        $action = $_GET['action_filter'] ?? '';
        $module = $_GET['module'] ?? '';
        
        // Build WHERE clause (same as getAuditLogs)
        $whereConditions = [];
        $params = [];
        
        $whereConditions[] = "DATE(timestamp) BETWEEN ? AND ?";
        $params[] = $dateFrom;
        $params[] = $dateTo;
        
        if (!empty($user)) {
            $whereConditions[] = "user LIKE ?";
            $params[] = "%$user%";
        }
        
        if (!empty($action)) {
            $whereConditions[] = "action LIKE ?";
            $params[] = "%$action%";
        }
        
        if (!empty($module)) {
            $whereConditions[] = "module LIKE ?";
            $params[] = "%$module%";
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        $query = "SELECT user, action, module, description, ip_address, timestamp 
                  FROM audit_logs 
                  $whereClause 
                  ORDER BY timestamp DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($format === 'csv') {
            exportAsCSV($logs);
        } else {
            // Return JSON for other formats (PDF generation would be handled by frontend)
            echo json_encode([
                'success' => true,
                'logs' => $logs,
                'format' => $format
            ]);
        }
        
        // Log the export action
        logAuditAction($db, 'EXPORT_AUDIT_LOGS', 'System', "Exported audit logs as $format", [
            'format' => $format,
            'record_count' => count($logs),
            'date_range' => "$dateFrom to $dateTo"
        ]);
        
    } catch (Exception $e) {
        throw new Exception('Error exporting audit logs: ' . $e->getMessage());
    }
}

function exportAsCSV($logs) {
    $filename = 'audit_logs_' . date('Y-m-d_H-i-s') . '.csv';
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    
    $output = fopen('php://output', 'w');
    
    // Write CSV header
    fputcsv($output, ['User', 'Action', 'Module', 'Description', 'IP Address', 'Timestamp']);
    
    // Write data rows
    foreach ($logs as $log) {
        fputcsv($output, [
            $log['user'],
            $log['action'],
            $log['module'],
            $log['description'],
            $log['ip_address'],
            $log['timestamp']
        ]);
    }
    
    fclose($output);
}

function createAuditLogsTable($db) {
    $query = "CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user VARCHAR(50),
        user_role VARCHAR(20),
        action VARCHAR(50),
        module VARCHAR(50),
        description TEXT,
        details JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('SUCCESS', 'FAILED', 'WARNING') DEFAULT 'SUCCESS',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp (timestamp),
        INDEX idx_user (user),
        INDEX idx_action (action),
        INDEX idx_module (module)
    )";
    
    $db->exec($query);
}

function logAuditAction($db, $action, $module, $description, $details = []) {
    try {
        // In a real implementation, you would get the current user from session
        $currentUser = 'admin'; // This should come from session
        
        $query = "INSERT INTO audit_logs (user, action, module, description, details, ip_address, user_agent, timestamp) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->execute([
            $currentUser,
            $action,
            $module,
            $description,
            json_encode($details),
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    } catch (Exception $e) {
        // Log audit errors but don't fail the main operation
        error_log('Audit log error: ' . $e->getMessage());
    }
}
?>