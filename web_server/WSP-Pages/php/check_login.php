<?php

require __DIR__ . '/lib/database.php';

$content = trim(file_get_contents("php://input"));
$decode = json_decode($content, true);

$db = new \database\WSPDB(isset($decode["stay_in"]));

// check data
$response = Array();
if ($db -> Check_login()) {
    $response['patientID'] = $db -> Get_patient_id();
} else {
    $response['patientID'] = FALSE;
    exit(json_encode($response));
}

echo json_encode($response);
?>