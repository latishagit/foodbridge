<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../config.php';

try {
    $dbconn = connectDatabase();
    $data = json_decode(file_get_contents("php://input"), true);
    $status = $data['approval'];

    $query = "SELECT 
                  d.*, 
                  r.donor_name, 
                  r.contact 
              FROM donation d 
              JOIN donor r 
              ON d.donor_id = r.donor_id 
              WHERE d.approval = $1";

    $result = pg_query_params($dbconn, $query, [$status]);

    if (!$result) {
        throw new Exception("Database query failed: " . pg_last_error($dbconn));
    }

    $donations = [];
    while ($row = pg_fetch_assoc($result)) {
        $donations[] = $row;
    }

    echo json_encode(["donations" => $donations]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching donations", "error" => $e->getMessage()]);
}
?>

