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

if (!isset($data['donor_id'], $data['food_details'], $data['quantity'], $data['pickup_location'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

$dbconn = connectDatabase();
$donor_id = (int)$data['donor_id'];
$food_details = pg_escape_string($data['food_details']);
$quantity = (int)$data['quantity'];
$pickup_location = pg_escape_string($data['pickup_location']);
$status = 'active';
$delivery_location= pg_escape_string($data['delivery_location']);

$query = "INSERT INTO donations (donor_id, food_details, quantity, pickup_location, status,delivery_location) 
          VALUES ($donor_id, '$food_details', $quantity, '$pickup_location', '$status','$delivery_location')";
$result = pg_query($dbconn, $query);

if ($result) {
    http_response_code(201);
    echo json_encode(["message" => "Donation created successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error creating donation"]);
}
?>



