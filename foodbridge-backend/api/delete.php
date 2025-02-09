<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../config.php';

try {
    $dbconn = connectDatabase();
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['table_name']) || !isset($data['id'])) {
        throw new Exception("Missing table name or ID");
    }

    $table_name = pg_escape_identifier($dbconn,$data['table_name']);
    $id = (int) $data['id'];  // Ensure ID is integer

    // 🔍 Fetch Primary Key Column Name
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

    // 🔥 Perform DELETE operation
    $deleteQuery = "DELETE FROM $table_name WHERE $primary_key = $id";
    
    // Log the query
    //error_log("Executing Query: $deleteQuery", 3, "/var/www/html/foodbridge/error.log");

    $deleteResult = pg_query($dbconn, $deleteQuery);

    if (!$deleteResult) {
        throw new Exception("Delete failed: " . pg_last_error($dbconn));
    }

    echo json_encode(["success" => true, "message" => "Record deleted successfully"]);
} catch (Exception $e) {
    http_response_code(500);
    //error_log("Error: " . $e->getMessage(), 3, "/var/www/html/foodbridge/error.log");
    echo json_encode(["success" => false, "message" => "Error deleting record", "error" => $e->getMessage()]);
}
?>

