<?php
// config.php
function connectDatabase()
{
    $host = "localhost";
    $port = "5432";
    $dbname = "foodbridge";
    $user = "postgres";
    $password = "new_password";

   
    $dbconn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

    if (!$dbconn) {
        die("Error: Could not connect to database.\n");
    }

    return $dbconn;
}
?>
