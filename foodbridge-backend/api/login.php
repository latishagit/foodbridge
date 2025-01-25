<?php
session_start();
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

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing email or password"]);
    exit;
}

$dbconn = connectDatabase();
$email = pg_escape_string($dbconn, $data['email']); 


$tables = ['donor','volunteer','recipient'];
$role = null;

foreach($tables as $table)
{
	$query = "SELECT * FROM $table WHERE email = '$email'";
	$result = pg_query($dbconn, $query);
	if ($result && pg_num_rows($result) > 0) {
		$role = $table;
		$nameField = $table."_name";
		$idField = $table."_id";
		break;
	}
}
if (!$role) {
    http_response_code(401);
    echo json_encode(["message" => "User not found in any role table"]);
    exit;
}
if ($result && pg_num_rows($result) > 0) {
$user = pg_fetch_assoc($result);
    if (password_verify($data['password'], $user['password'])) {
        http_response_code(200);
        echo json_encode([
            "id" => $user[$idField],
            "name" => $user[$nameField],
            "email" => $user['email'],
             "role" => $role,
            "message" => "Login successful"
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid password"]);
    }
} else {
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password"]);
}
?>

