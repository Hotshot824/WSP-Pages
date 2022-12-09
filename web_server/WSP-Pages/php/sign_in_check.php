<?php

require __DIR__ . '/lib/database.php';

$content = trim(file_get_contents("php://input"));
$decode = json_decode($content, true);

$db = new \database\WSPDB(isset($decode["stay_in"]));

// check data
$response = Array();
if ($db -> check_login()) {
    $response['patientID'] = $db -> get_patient_id();
} else {
    $response['patientID'] = FALSE;
}

echo json_encode($response);
?>