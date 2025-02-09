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
$id = $data['id'];

 $pk_query = "
        SELECT a.attname AS primary_key
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary;
    ";

    $pk_stmt = pg_prepare($dbconn, 'fetch_pk', $pk_query);
    $pk_result = pg_execute($dbconn, 'fetch_pk', [$data['table_name']]);

    if (!$pk_result || pg_num_rows($pk_result) == 0) {
        throw new Exception("Primary key column not found for table: " . $data['table_name']);
    }

    $row = pg_fetch_assoc($pk_result);
    $primary_key = pg_escape_identifier($dbconn,$row['primary_key']);

$updates = [];

foreach ($data['data'] as $key => $value) {
    $updates[] = "$key = '$value'";
}

$query = "UPDATE $table_name SET " . implode(", ", $updates) . " WHERE $primary_key = '$id'";
$result = pg_query($dbconn, $query);

echo json_encode(["success" => $result]);
?>

