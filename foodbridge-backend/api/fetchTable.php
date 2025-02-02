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

try {
    $dbconn = connectDatabase();
    $data = json_decode(file_get_contents("php://input"), true);
       if (!isset($data['table_name']) || empty($data['table_name'])) {
        throw new Exception("Table name is missing.");
    }   
    
    $table_name = $data['table_name'];

    $query = "SELECT * from $table_name";

    $result = pg_query($dbconn, $query);

    if (!$result) {
        throw new Exception("Database query failed: " . pg_last_error($dbconn));
    }

    $table_data = [];
    while ($row = pg_fetch_assoc($result)) {
        $table_data[] = $row;
    }

  echo json_encode(["success" => true, "tabledata" => $table_data]);
 
  
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching data", "error" => $e->getMessage()]);
}
?>

