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
$columns = array_keys($data['data']);
$values = array_values($data['data']);

$query = "INSERT INTO $table_name (" . implode(", ", $columns) . ") VALUES ('" . implode("', '", $values) . "')";
$result = pg_query($dbconn, $query);

echo json_encode(["success" => $result]);
?>

