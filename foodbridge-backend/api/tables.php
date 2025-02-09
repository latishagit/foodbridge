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

$query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'";
$result = pg_query($dbconn, $query);

$tables = [];
while ($row = pg_fetch_assoc($result)) {
    $tables[] = $row['table_name'];
}

echo json_encode(["tables" => $tables]);
?>

