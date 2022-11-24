<?php

$content = trim(file_get_contents("php://input"));
$text = json_decode($content, true);

if (isset($text["stay_in"])) {
    $lifetime = 86400;
    ini_set("session.gc_maxlifetime", $lifetime);
}

// if hava anyone creat session will check time out session
// ini_set("session.gc_probability", 100);
session_save_path('/tmp');
session_start();

// check data
$response = Array();
if (isset($_SESSION['patientID'])) {
    $response['patientID'] = $_SESSION['patientID'];
}

echo json_encode($response);
?>