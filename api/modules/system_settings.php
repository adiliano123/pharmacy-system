<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            getSettings($db);
            break;
            
        case 'POST':
        case 'PUT':
            saveSettings($db);
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

function getSettings($db) {
    try {
        // Create settings table if it doesn't exist
        createSettingsTable($db);
        
        $query = "SELECT setting_key, setting_value, setting_type FROM system_settings";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $settings = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $value = $row['setting_value'];
            
            // Convert value based on type
            switch ($row['setting_type']) {
                case 'boolean':
                    $value = (bool)$value;
                    break;
                case 'integer':
                    $value = (int)$value;
                    break;
                case 'float':
                    $value = (float)$value;
                    break;
                case 'json':
                    $value = json_decode($value, true);
                    break;
                // 'string' remains as is
            }
            
            $settings[$row['setting_key']] = $value;
        }
        
        // If no settings exist, return defaults
        if (empty($settings)) {
            $settings = getDefaultSettings();
            // Save defaults to database
            saveDefaultSettings($db, $settings);
        }
        
        echo json_encode([
            'success' => true,
            'settings' => $settings
        ]);
    } catch (Exception $e) {
        throw new Exception('Error fetching settings: ' . $e->getMessage());
    }
}

function saveSettings($db) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('No settings data provided');
        }
        
        // Create settings table if it doesn't exist
        createSettingsTable($db);
        
        // Flatten nested settings structure
        $flatSettings = flattenSettings($input);
        
        // Begin transaction
        $db->beginTransaction();
        
        foreach ($flatSettings as $key => $value) {
            $type = getSettingType($value);
            $stringValue = convertToString($value, $type);
            
            // Use INSERT ... ON DUPLICATE KEY UPDATE for MySQL
            $query = "INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at) 
                      VALUES (?, ?, ?, NOW()) 
                      ON DUPLICATE KEY UPDATE 
                      setting_value = VALUES(setting_value), 
                      setting_type = VALUES(setting_type), 
                      updated_at = NOW()";
            
            $stmt = $db->prepare($query);
            $stmt->execute([$key, $stringValue, $type]);
        }
        
        // Commit transaction
        $db->commit();
        
        // Log the action
        logAuditAction($db, 'UPDATE_SETTINGS', 'System', 'Updated system settings', [
            'settings_count' => count($flatSettings)
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Settings saved successfully'
        ]);
    } catch (Exception $e) {
        $db->rollBack();
        throw new Exception('Error saving settings: ' . $e->getMessage());
    }
}

function createSettingsTable($db) {
    $query = "CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT,
        setting_type ENUM('string', 'integer', 'float', 'boolean', 'json') DEFAULT 'string',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $db->exec($query);
}

function getDefaultSettings() {
    return [
        'general' => [
            'pharmacyName' => 'MediCare Pharmacy',
            'address' => '123 Health Street, Dar es Salaam',
            'phone' => '+255 123 456 789',
            'email' => 'info@medicare.co.tz',
            'currency' => 'TSh',
            'timezone' => 'Africa/Dar_es_Salaam',
            'language' => 'English'
        ],
        'inventory' => [
            'lowStockThreshold' => 10,
            'autoReorderEnabled' => false,
            'expiryAlertDays' => 30,
            'batchTrackingEnabled' => true,
            'stockValuationMethod' => 'FIFO'
        ],
        'sales' => [
            'taxRate' => 18.0,
            'discountEnabled' => true,
            'maxDiscountPercent' => 20.0,
            'receiptFooter' => 'Thank you for choosing MediCare Pharmacy!',
            'autoBackupEnabled' => true,
            'backupFrequency' => 'daily'
        ],
        'security' => [
            'sessionTimeout' => 30,
            'passwordMinLength' => 8,
            'requireSpecialChars' => true,
            'maxLoginAttempts' => 3,
            'twoFactorEnabled' => false,
            'auditLoggingEnabled' => true
        ],
        'notifications' => [
            'emailNotifications' => true,
            'smsNotifications' => false,
            'lowStockAlerts' => true,
            'expiryAlerts' => true,
            'salesReports' => true,
            'systemAlerts' => true
        ]
    ];
}

function saveDefaultSettings($db, $settings) {
    $flatSettings = flattenSettings($settings);
    
    foreach ($flatSettings as $key => $value) {
        $type = getSettingType($value);
        $stringValue = convertToString($value, $type);
        
        $query = "INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_type) 
                  VALUES (?, ?, ?)";
        
        $stmt = $db->prepare($query);
        $stmt->execute([$key, $stringValue, $type]);
    }
}

function flattenSettings($settings, $prefix = '') {
    $flat = [];
    
    foreach ($settings as $key => $value) {
        $fullKey = $prefix ? $prefix . '.' . $key : $key;
        
        if (is_array($value)) {
            $flat = array_merge($flat, flattenSettings($value, $fullKey));
        } else {
            $flat[$fullKey] = $value;
        }
    }
    
    return $flat;
}

function getSettingType($value) {
    if (is_bool($value)) {
        return 'boolean';
    } elseif (is_int($value)) {
        return 'integer';
    } elseif (is_float($value)) {
        return 'float';
    } elseif (is_array($value)) {
        return 'json';
    } else {
        return 'string';
    }
}

function convertToString($value, $type) {
    switch ($type) {
        case 'boolean':
            return $value ? '1' : '0';
        case 'json':
            return json_encode($value);
        default:
            return (string)$value;
    }
}

function logAuditAction($db, $action, $module, $description, $details = []) {
    try {
        // Create audit_logs table if it doesn't exist
        $auditQuery = "CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(50),
            action VARCHAR(50),
            module VARCHAR(50),
            description TEXT,
            details JSON,
            ip_address VARCHAR(45),
            user_agent TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $db->exec($auditQuery);
        
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