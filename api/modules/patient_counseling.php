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
            if (isset($_GET['patient_id'])) {
                getPatientCounselingHistory($pdo, $_GET['patient_id']);
            } else {
                getAllCounselingRecords($pdo);
            }
            break;
            
        case 'POST':
            createCounselingRecord($pdo, $input);
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function getPatientCounselingHistory($pdo, $patientId) {
    $stmt = $pdo->prepare("
        SELECT pc.*, p.patient_name, u.full_name as counseled_by_name, pr.prescription_number
        FROM patient_counseling pc
        JOIN patients p ON pc.patient_id = p.patient_id
        JOIN users u ON pc.counseled_by = u.user_id
        LEFT JOIN prescriptions pr ON pc.prescription_id = pr.prescription_id
        WHERE pc.patient_id = ?
        ORDER BY pc.counseling_date DESC
    ");
    $stmt->execute([$patientId]);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $records]);
}

function getAllCounselingRecords($pdo) {
    $stmt = $pdo->prepare("
        SELECT pc.*, p.patient_name, u.full_name as counseled_by_name, pr.prescription_number
        FROM patient_counseling pc
        JOIN patients p ON pc.patient_id = p.patient_id
        JOIN users u ON pc.counseled_by = u.user_id
        LEFT JOIN prescriptions pr ON pc.prescription_id = pr.prescription_id
        ORDER BY pc.counseling_date DESC
        LIMIT 100
    ");
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $records]);
}

function createCounselingRecord($pdo, $data) {
    $stmt = $pdo->prepare("
        INSERT INTO patient_counseling (patient_id, prescription_id, counseled_by, topics_covered, patient_understanding, follow_up_needed, follow_up_date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['patient_id'],
        $data['prescription_id'] ?? null,
        $data['counseled_by'],
        $data['topics_covered'],
        $data['patient_understanding'] ?? 'good',
        $data['follow_up_needed'] ?? false,
        $data['follow_up_date'] ?? null,
        $data['notes'] ?? null
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Counseling record created successfully']);
}
?>