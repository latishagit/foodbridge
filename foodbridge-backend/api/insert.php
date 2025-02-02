<?php
// Include database connection
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
$conn = connectDatabase();

$data = json_decode(file_get_contents("php://input"), true);
// Get table name and record data
$tn = $data['table_name'];
$input = $data['record_data']; 
$values_array = explode(',', $input);
$values_array = array_map('trim', $values_array);

// Get column names for the selected table from the database schema
$query_columns = "SELECT column_name FROM information_schema.columns WHERE table_name = $1";
$stmt_columns = pg_prepare($conn, 'get_columns', $query_columns);
$result_columns = pg_execute($conn, 'get_columns', array($tn));

// Fetch column names
$columns = array();
while ($row = pg_fetch_assoc($result_columns)) {
    $columns[] = $row['column_name'];
}

// Construct the column names string
$column_names = implode(', ', $columns);

// Construct the placeholders string
$placeholders = rtrim(str_repeat('?, ', count($columns)), ', ');

// Construct the query for inserting records
$query = "INSERT INTO $tn ($column_names) VALUES (";
foreach ($values_array as $value) {
    $query .= $value . ", ";
}
// Remove the trailing comma and space
$query = rtrim($query, ', ') . ')';


// Prepare the statement
//$stmt = pg_prepare($conn, 'insert', $query);

// Execute the prepared statement with values from $values_array
//$result = pg_execute($conn, 'insert', $values_array);
$result =pg_query($conn,$query);
// Check if the query executed successfully
if ($result) {
     echo "Success";
    exit();
    
} else {
    // Retrieve and display the error message
    echo "Error inserting records into $tn: " . pg_last_error($conn);
    
} 

// Close the database connection



?>

