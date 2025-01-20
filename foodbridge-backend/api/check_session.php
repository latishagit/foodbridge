<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (isset($_SESSION['user_id'])) {
    echo json_encode(["loggedIn" => true, "user_id" => $_SESSION['user_id'], "email" => $_SESSION['user_email']]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>

