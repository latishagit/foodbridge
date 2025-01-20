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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['donor_id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing donor ID"]);
    exit;
}
$dbconn = connectDatabase();
$donorId = $data['donor_id'];
$role = $data['role'];

if($role==='donor')
{
$query = "SELECT * FROM donations WHERE donor_id = $donorId";
$result = pg_query($dbconn, $query);

if ($result) {
    $donations = [];
    while ($row = pg_fetch_assoc($result)) {
        $donations[] = $row;
    }
    echo json_encode(["donations" => $donations]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching donations"]);
}
}
else
{
$query = "SELECT * FROM tasks WHERE volunteer_id = $donorId";
$result = pg_query($dbconn, $query);

if ($result) {
    $donations = [];
    while ($row = pg_fetch_assoc($result)) {
        $donations[] = $row;
    }
    echo json_encode(["donations" => $donations]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching tasks"]);
}	
}

?>

