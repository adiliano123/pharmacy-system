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
                    case 'check':
                        checkDrugInteractions($pdo, $_GET['drugs']);
                        break;
                    case 'all':
                        getAllInteractions($pdo);
                        break;
                    default:
                        getAllInteractions($pdo);
                }
            } else {
                getAllInteractions($pdo);
            }
            break;
            
        case 'POST':
            if (isset($input['action']) && $input['action'] === 'check_multiple') {
                checkMultipleDrugInteractions($pdo, $input['drugs']);
            } else {
                addDrugInteraction($pdo, $input);
            }
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function checkDrugInteractions($pdo, $drugs) {
    if (!$drugs || !is_array($drugs) || count($drugs) < 2) {
        echo json_encode(['success' => true, 'interactions' => []]);
        return;
    }
    
    $interactions = [];
    
    // Check all combinations of drugs
    for ($i = 0; $i < count($drugs); $i++) {
        for ($j = $i + 1; $j < count($drugs); $j++) {
            $drug1 = strtolower(trim($drugs[$i]));
            $drug2 = strtolower(trim($drugs[$j]));
            
            // Check both directions (drug1 with drug2 and drug2 with drug1)
            $stmt = $pdo->prepare("
                SELECT * FROM drug_interactions 
                WHERE (LOWER(drug1_name) = ? AND LOWER(drug2_name) = ?) 
                   OR (LOWER(drug1_name) = ? AND LOWER(drug2_name) = ?)
                   OR (LOWER(drug1_generic) = ? AND LOWER(drug2_generic) = ?)
                   OR (LOWER(drug1_generic) = ? AND LOWER(drug2_generic) = ?)
            ");
            $stmt->execute([$drug1, $drug2, $drug2, $drug1, $drug1, $drug2, $drug2, $drug1]);
            
            while ($interaction = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $interactions[] = [
                    'drug1' => $drugs[$i],
                    'drug2' => $drugs[$j],
                    'interaction' => $interaction
                ];
            }
        }
    }
    
    echo json_encode(['success' => true, 'interactions' => $interactions]);
}

function checkMultipleDrugInteractions($pdo, $drugs) {
    $interactions = [];
    $warnings = [];
    
    // Check all drug combinations
    for ($i = 0; $i < count($drugs); $i++) {
        for ($j = $i + 1; $j < count($drugs); $j++) {
            $drug1 = strtolower(trim($drugs[$i]));
            $drug2 = strtolower(trim($drugs[$j]));
            
            $stmt = $pdo->prepare("
                SELECT * FROM drug_interactions 
                WHERE (LOWER(drug1_name) LIKE ? AND LOWER(drug2_name) LIKE ?) 
                   OR (LOWER(drug1_name) LIKE ? AND LOWER(drug2_name) LIKE ?)
                   OR (LOWER(drug1_generic) LIKE ? AND LOWER(drug2_generic) LIKE ?)
                   OR (LOWER(drug1_generic) LIKE ? AND LOWER(drug2_generic) LIKE ?)
            ");
            $stmt->execute([
                "%$drug1%", "%$drug2%", "%$drug2%", "%$drug1%",
                "%$drug1%", "%$drug2%", "%$drug2%", "%$drug1%"
            ]);
            
            while ($interaction = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $interactions[] = [
                    'drug1' => $drugs[$i],
                    'drug2' => $drugs[$j],
                    'interaction_type' => $interaction['interaction_type'],
                    'description' => $interaction['description'],
                    'recommendation' => $interaction['recommendation']
                ];
                
                // Add to warnings based on severity
                if ($interaction['interaction_type'] === 'major') {
                    $warnings[] = [
                        'level' => 'error',
                        'message' => "MAJOR INTERACTION: {$drugs[$i]} and {$drugs[$j]} - {$interaction['description']}"
                    ];
                } elseif ($interaction['interaction_type'] === 'moderate') {
                    $warnings[] = [
                        'level' => 'warning',
                        'message' => "MODERATE INTERACTION: {$drugs[$i]} and {$drugs[$j]} - {$interaction['description']}"
                    ];
                } else {
                    $warnings[] = [
                        'level' => 'info',
                        'message' => "MINOR INTERACTION: {$drugs[$i]} and {$drugs[$j]} - {$interaction['description']}"
                    ];
                }
            }
        }
    }
    
    echo json_encode([
        'success' => true, 
        'interactions' => $interactions,
        'warnings' => $warnings,
        'has_major_interactions' => count(array_filter($interactions, function($i) { return $i['interaction_type'] === 'major'; })) > 0
    ]);
}

function getAllInteractions($pdo) {
    $stmt = $pdo->query("
        SELECT * FROM drug_interactions 
        ORDER BY interaction_type DESC, drug1_name ASC
    ");
    $interactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $interactions]);
}

function addDrugInteraction($pdo, $data) {
    $stmt = $pdo->prepare("
        INSERT INTO drug_interactions (drug1_name, drug1_generic, drug2_name, drug2_generic, interaction_type, description, recommendation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['drug1_name'],
        $data['drug1_generic'] ?? null,
        $data['drug2_name'],
        $data['drug2_generic'] ?? null,
        $data['interaction_type'],
        $data['description'],
        $data['recommendation'] ?? null
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Drug interaction added successfully']);
}
?>