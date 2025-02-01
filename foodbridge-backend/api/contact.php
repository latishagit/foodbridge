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

if (!isset($data['name'], $data['email'], $data['contact'], $data['description'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit;
}

$dbconn = connectDatabase();
$name = pg_escape_string($dbconn,$data['name']);
$email = pg_escape_string($dbconn,$data['email']);
$contact_number = (int)$data['contact']; 
$description = pg_escape_string($dbconn,$data['description']);

$query = "INSERT INTO contact (name, email, contact, description) VALUES ('$name', '$email', $contact_number ,'$description')";

error_log("SQL Query: $query");

$result = pg_query($dbconn, $query);
if (!$result) {
    error_log("PostgreSQL Error: " . pg_last_error($dbconn));
    http_response_code(500);
    echo json_encode(["message" => "Error in storing information"]);
    exit();
}

http_response_code(201);
echo json_encode(["message" => "Contact successfull"]);
?>

