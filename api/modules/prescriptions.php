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
                        getPendingPrescriptions($pdo);
                        break;
                    case 'verified':
                        getVerifiedPrescriptions($pdo);
                        break;
                    case 'details':
                        getPrescriptionDetails($pdo, $_GET['id']);
                        break;
                    default:
                        getAllPrescriptions($pdo);
                }
            } else {
                getAllPrescriptions($pdo);
            }
            break;
            
        case 'POST':
            if (isset($input['action'])) {
                switch ($input['action']) {
                    case 'create':
                        createPrescription($pdo, $input);
                        break;
                    case 'verify':
                        verifyPrescription($pdo, $input);
                        break;
                    case 'dispense':
                        dispensePrescription($pdo, $input);
                        break;
                    default:
                        throw new Exception('Invalid action');
                }
            } else {
                createPrescription($pdo, $input);
            }
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getPendingPrescriptions($pdo) {
    $stmt = $pdo->query("SELECT * FROM pending_prescriptions");
    $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $prescriptions]);
}

function getVerifiedPrescriptions($pdo) {
    $stmt = $pdo->prepare("
        SELECT p.*, pt.patient_name, u.full_name as verified_by_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        LEFT JOIN users u ON p.verified_by = u.user_id
        WHERE p.status = 'verified'
        ORDER BY p.verified_at DESC
    ");
    $stmt->execute();
    $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $prescriptions]);
}

function getPrescriptionDetails($pdo, $prescriptionId) {
    // Get prescription details
    $stmt = $pdo->prepare("
        SELECT p.*, pt.patient_name, pt.phone, pt.allergies, pt.medical_conditions
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        WHERE p.prescription_id = ?
    ");
    $stmt->execute([$prescriptionId]);
    $prescription = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$prescription) {
        throw new Exception('Prescription not found');
    }
    
    // Get prescription items
    $stmt = $pdo->prepare("
        SELECT pi.*, i.quantity as available_quantity, i.price
        FROM prescription_items pi
        LEFT JOIN inventory i ON pi.inventory_id = i.inventory_id
        WHERE pi.prescription_id = ?
    ");
    $stmt->execute([$prescriptionId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $prescription['items'] = $items;
    
    echo json_encode(['success' => true, 'data' => $prescription]);
}

function createPrescription($pdo, $data) {
    $pdo->beginTransaction();
    
    try {
        // Create or get patient
        $patientId = createOrGetPatient($pdo, $data['patient']);
        
        // Create prescription
        $stmt = $pdo->prepare("
            INSERT INTO prescriptions (prescription_number, patient_id, doctor_name, doctor_license, prescription_date, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['prescription_number'],
            $patientId,
            $data['doctor_name'],
            $data['doctor_license'] ?? null,
            $data['prescription_date'],
            $data['notes'] ?? null
        ]);
        
        $prescriptionId = $pdo->lastInsertId();
        
        // Add prescription items
        foreach ($data['items'] as $item) {
            $stmt = $pdo->prepare("
                INSERT INTO prescription_items (prescription_id, medicine_name, generic_name, dosage, quantity_prescribed, instructions, frequency, duration)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $prescriptionId,
                $item['medicine_name'],
                $item['generic_name'] ?? null,
                $item['dosage'],
                $item['quantity_prescribed'],
                $item['instructions'],
                $item['frequency'] ?? null,
                $item['duration'] ?? null
            ]);
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'prescription_id' => $prescriptionId]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function verifyPrescription($pdo, $data) {
    $stmt = $pdo->prepare("
        UPDATE prescriptions 
        SET status = 'verified', verified_by = ?, verified_at = NOW(), notes = ?
        WHERE prescription_id = ?
    ");
    $stmt->execute([
        $data['verified_by'],
        $data['notes'] ?? null,
        $data['prescription_id']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Prescription verified successfully']);
}

function dispensePrescription($pdo, $data) {
    $pdo->beginTransaction();
    
    try {
        // Update prescription status
        $stmt = $pdo->prepare("
            UPDATE prescriptions 
            SET status = 'dispensed', dispensed_by = ?, dispensed_at = NOW()
            WHERE prescription_id = ? AND status = 'verified'
        ");
        $stmt->execute([$data['dispensed_by'], $data['prescription_id']]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('Prescription not found or not verified');
        }
        
        // Update inventory and create sales records
        foreach ($data['items'] as $item) {
            // Update inventory
            $stmt = $pdo->prepare("
                UPDATE inventory 
                SET quantity = quantity - ? 
                WHERE inventory_id = ? AND quantity >= ?
            ");
            $stmt->execute([
                $item['quantity_dispensed'],
                $item['inventory_id'],
                $item['quantity_dispensed']
            ]);
            
            if ($stmt->rowCount() === 0) {
                throw new Exception('Insufficient stock for ' . $item['medicine_name']);
            }
            
            // Create sales record
            $stmt = $pdo->prepare("
                INSERT INTO sales (inventory_id, batch_number, name, quantity_sold, total_revenue, sold_by, customer_name, notes)
                SELECT inventory_id, batch_number, name, ?, ? * price, ?, ?, 'Prescription dispensing'
                FROM inventory 
                WHERE inventory_id = ?
            ");
            $stmt->execute([
                $item['quantity_dispensed'],
                $item['quantity_dispensed'],
                $data['dispensed_by'],
                $data['patient_name'] ?? 'Prescription Patient',
                $item['inventory_id']
            ]);
            
            // Update prescription item
            $stmt = $pdo->prepare("
                UPDATE prescription_items 
                SET quantity_dispensed = ?, inventory_id = ?
                WHERE item_id = ?
            ");
            $stmt->execute([
                $item['quantity_dispensed'],
                $item['inventory_id'],
                $item['item_id']
            ]);
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Prescription dispensed successfully']);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function createOrGetPatient($pdo, $patientData) {
    // Check if patient exists
    $stmt = $pdo->prepare("SELECT patient_id FROM patients WHERE patient_name = ? AND phone = ?");
    $stmt->execute([$patientData['name'], $patientData['phone'] ?? null]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        return $existing['patient_id'];
    }
    
    // Create new patient
    $stmt = $pdo->prepare("
        INSERT INTO patients (patient_name, phone, email, date_of_birth, address, allergies, medical_conditions, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $patientData['name'],
        $patientData['phone'] ?? null,
        $patientData['email'] ?? null,
        $patientData['date_of_birth'] ?? null,
        $patientData['address'] ?? null,
        $patientData['allergies'] ?? null,
        $patientData['medical_conditions'] ?? null,
        $patientData['created_by'] ?? null
    ]);
    
    return $pdo->lastInsertId();
}

function getAllPrescriptions($pdo) {
    $stmt = $pdo->prepare("
        SELECT p.*, pt.patient_name, u1.full_name as verified_by_name, u2.full_name as dispensed_by_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        LEFT JOIN users u1 ON p.verified_by = u1.user_id
        LEFT JOIN users u2 ON p.dispensed_by = u2.user_id
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();
    $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $prescriptions]);
}
?>