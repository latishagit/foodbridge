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

$dbconn = connectDatabase();
$data = json_decode(file_get_contents("php://input"), true);
$status = $data['approval'];
$query = "SELECT * FROM donation where approval='$status';";
$result = pg_query($dbconn, $query);
//console.log($result);
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



?>

