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

if (!isset($data['name'], $data['email'], $data['password'], $data['role'], $data['contact_number'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

$dbconn = connectDatabase();
$name = pg_escape_string($data['name']);
$email = pg_escape_string($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);
$role = pg_escape_string($data['role']);
$contact_number = (int)$data['contact_number']; 

if($role==='donor')
{
	$query = "INSERT INTO donor (donor_name, email, contact,password) VALUES ('$name', '$email', $contact_number ,'$password')";
}
else if($role==='volunteer')
{
	$query = "INSERT INTO volunteer (volunteer_name, email, contact,password) VALUES ('$name', '$email', $contact_number ,'$password')";
}
else if($role==='recipient')
{
	$latitude = (float)$data['latitude']; 
	$longitude = (float)$data['longitude']; 
	$query = "INSERT INTO recipient (recipient_name, email, contact,password,latitude,longitude) VALUES ('$name', '$email', $contact_number ,'$password','$latitude','$longitude')";
}
else
{
    error_log("PostgreSQL Error: " . pg_last_error($dbconn));
    http_response_code(500);
    echo json_encode(["message" => "Error registering user (verify the role)"]);
    exit();
}


error_log("SQL Query: $query");

$result = pg_query($dbconn, $query);
if (!$result) {
    error_log("PostgreSQL Error: " . pg_last_error($dbconn));
    http_response_code(500);
    echo json_encode(["message" => "Error registering user"]);
    exit();
}

http_response_code(201);
echo json_encode(["message" => "User registered successfully"]);
?>

