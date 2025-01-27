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

$recipientId = $data['recipient_id'];
$donationId = $data['donation_id'];
$latitude = $data['latitude'];
$longitude = $data['longitude'];

$query = "UPDATE recipient SET latitude = $1, longitude = $2 WHERE recipient_id = $3";
$result = pg_query_params($dbconn, $query, [$latitude, $longitude, $recipientId]);

if ($result) {
    echo json_encode(["message" => "Location updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update location"]);
}

$query1 = "UPDATE tasks SET recipient_id = $recipientId where donation_id = $donationId; ";
$result1 = pg_query($dbconn, $query1);

if ($result1) {
    echo json_encode(["message" => "Task updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update task"]);
}
?>

