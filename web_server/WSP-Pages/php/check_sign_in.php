<?php

$content = trim(file_get_contents("php://input"));
$text = json_decode($content, true);
$stay_in = $text["stay_in"];

if ($stay_in == TRUE) {
    $lifetime = 86400;
    ini_set("session.gc_maxlifetime", $lifetime);
} else {
    $lifetime = 1800;
    ini_set("session.gc_maxlifetime", $lifetime);
}

// if hava anyone creat session will check time out session
ini_set("session.gc_probability", 1);
ini_set("session.gc_divisor", 1);
session_save_path('/tmp');
session_start();

// check data
$response = array();
$response['patientID'] = $_SESSION['patientID'];

echo json_encode($response);
?>