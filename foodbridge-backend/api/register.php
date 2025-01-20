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

$query = "INSERT INTO users (name, email, password, role, contact_number) VALUES ('$name', '$email', '$password', '$role', $contact_number)";

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

