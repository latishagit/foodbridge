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
if (!isset($data['id'], $data['name'], $data['email'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

$dbconn = connectDatabase();
if (!$dbconn) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit();
}

$id = pg_escape_string($data['id']);
$name = pg_escape_string($data['name']);
$email = pg_escape_string($data['email']);
$availability = isset($data['availability']) && $data['availability'] === true ? 'true' : 'false';

$preferred_area = isset($data['preferred_area']) ? pg_escape_string($data['preferred_area']) : null;

$contact_number = isset($data['contact_number']) && is_numeric($data['contact_number']) 
    ? pg_escape_string($data['contact_number']) 
    : null;

$userQuery = "UPDATE users SET name = '$name', email = '$email', contact_number = $contact_number WHERE id = $id";
$result = pg_query($dbconn, $userQuery);
error_log("update on user: " . $userQuery);
if (!$result) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update user profile"]);
    exit();
}

if ($data['role'] === 'volunteer') {
    error_log("Inside volunteer update");
    $volunteerQuery = "SELECT * FROM volunteers WHERE volunteer_id = $id";
    $volunteerResult = pg_query($dbconn, $volunteerQuery);

    if ($volunteerResult && pg_num_rows($volunteerResult) > 0) {
        $updateQuery = "UPDATE volunteers SET availability = $availability, preferred_area = '$preferred_area' WHERE volunteer_id = $id";
        $result = pg_query($dbconn, $updateQuery);
        error_log("Update Query Executed: " . $updateQuery);
    } else {
        $insertQuery = "INSERT INTO volunteers (volunteer_id, availability, preferred_area) VALUES ($id, $availability, '$preferred_area')";
        $result = pg_query($dbconn, $insertQuery);
        error_log("Insert Query Executed: " . $insertQuery);
    }

    if (!$result) {
        error_log("Error with volunteer query: " . pg_last_error($dbconn));
        http_response_code(500);
        echo json_encode(["message" => "Failed to update volunteer profile"]);
        exit();
    }
}

echo json_encode(["message" => "Profile updated successfully"]);

?>

