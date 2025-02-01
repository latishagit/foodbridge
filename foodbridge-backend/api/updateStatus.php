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
$dbconn = connectDatabase();
if (isset($data['task_id'])) {
    $task_id = $data['task_id'];

    $query = "UPDATE tasks SET status = 'completed' WHERE task_id = $task_id";
    $result = pg_query($dbconn,$query);
    

    if ($result) {
        echo json_encode(["success" => true, "message" => "Task status updated to completed."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update task status."]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
}
?>

