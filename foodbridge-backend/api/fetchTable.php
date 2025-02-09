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
$table_name = pg_escape_string($dbconn,$data['table_name']);

$query = "SELECT * FROM $table_name";
$result = pg_query($dbconn, $query);

$table_data = [];
while ($row = pg_fetch_assoc($result)) {
    $table_data[] = $row;
}

echo json_encode(["success" => true, "tabledata" => $table_data]);
?>

