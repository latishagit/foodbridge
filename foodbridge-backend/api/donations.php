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

if (!isset($data['donor_id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing donor ID"]);
    exit;
}
$dbconn = connectDatabase();
$donorId = $data['donor_id'];
$role = $data['role'];

if($role==='donor')
{
$query = 
"SELECT DISTINCT
    d.donation_id,
    d.food_details,
    d.expiry_date,
    d.quantity,
    d.approval,
    d.pickup_latitude,
    d.longitude,
    d.donor_id,
    t.status AS task_status,
    v.volunteer_name,
    v.contact AS volunteer_contact
FROM 
    donation d
LEFT JOIN 
    tasks t ON d.donation_id = t.donation_id
LEFT JOIN 
    volunteer v ON t.volunteer_id = v.volunteer_id
WHERE 
    d.donor_id = $donorId;
";
$result = pg_query($dbconn, $query);

if ($result) {
    $donations = [];
    while ($row = pg_fetch_assoc($result)) {
        $donations[] = $row;
    }
    echo json_encode(["donations" => $donations]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching donations"]);
}
}
else if($role==='recipient')
{
$query = 
"SELECT DISTINCT
    d.donation_id,
    d.food_details,
    d.expiry_date,
    d.quantity,
    d.approval,
    d.pickup_latitude,
    d.longitude,
    d.donor_id,
    dn.donor_name,
    dn.contact AS donor_contact,
    t.status AS task_status,
    v.volunteer_name,
    v.contact AS volunteer_contact
FROM 
    tasks t
JOIN 
    donation d ON t.donation_id = d.donation_id
JOIN 
    donor dn ON d.donor_id = dn.donor_id
LEFT JOIN 
    volunteer v ON t.volunteer_id = v.volunteer_id
WHERE 
    t.recipient_id = $donorId
    AND d.approval = 'approved';

";
$result = pg_query($dbconn, $query);

if ($result) {
    $donations = [];
    while ($row = pg_fetch_assoc($result)) {
        $donations[] = $row;
    }
    echo json_encode(["donations" => $donations]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching donations"]);
}
}
else
{
$query = 
"SELECT 
    d.*,
    dn.donor_name,
    dn.contact AS donor_contact,
    r.recipient_name,
    r.contact AS recipient_contact,
    r.latitude AS recipient_latitude,
    r.longitude AS recipient_longitude,
    t.status,
    t.task_id
FROM 
    donation d
LEFT JOIN 
    donor dn ON d.donor_id = dn.donor_id
LEFT JOIN 
    tasks t ON d.donation_id = t.donation_id
LEFT JOIN 
    recipient r ON t.recipient_id = r.recipient_id
WHERE 
    t.recipient_id IS NOT NULL
    AND t.volunteer_id = $donorId;";
$result = pg_query($dbconn, $query);

if ($result) {
    $donations = [];
    while ($row = pg_fetch_assoc($result)) {
        $donations[] = $row;
    }
    echo json_encode(["donations" => $donations]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error fetching tasks"]);
}	
}

?>

