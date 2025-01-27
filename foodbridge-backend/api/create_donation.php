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

if (!isset($data['donor_id'], $data['food_details'], $data['quantity'],$data['expiry_date'],$data['pickup_latitude'],$data['pickup_longitude'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

$dbconn = connectDatabase();
$donor_id = (int)$data['donor_id'];
$food_details = pg_escape_string($data['food_details']);
$quantity = (int)$data['quantity'];
$pickup_latitude = (float)$data['pickup_latitude'];
$pickup_longitude = (float)$data['pickup_longitude'];
$status = 'pending';
$expiry_date = pg_escape_string($data['expiry_date']);

$query = "INSERT INTO donation (food_details, expiry_date, quantity, approval, pickup_latitude, longitude, donor_id) 
          VALUES ('$food_details', '$expiry_date', $quantity, '$status',$pickup_latitude,$pickup_longitude,$donor_id) RETURNING donation_id";
$result = pg_query($dbconn, $query);

if ($result) {
	$donation = pg_fetch_assoc($result);
	$donation_id = $donation['donation_id'];
    http_response_code(201);
    echo json_encode(["message" => "Donation created successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error creating donation"]);
}

$vquery = "SELECT volunteer_id from volunteer where volunteer_id not in (SELECT volunteer_id from tasks);";
$vresult = pg_query($dbconn, $vquery);


if ($vresult && pg_num_rows($vresult) > 0) {
    $volunteer = pg_fetch_assoc($vresult);
    $volunteer_id = $volunteer['volunteer_id'];

    $query1 = "INSERT INTO tasks (volunteer_id, donation_id) VALUES ($volunteer_id, $donation_id)";
    $result1 = pg_query($dbconn, $query1);

    if ($result1) {
        http_response_code(201);
        echo json_encode(["message" => "Task created successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error creating task"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["message" => "No available volunteers"]);
}
?>



