<?php
//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);
$message = $decoded['message'];

$cur_date = date('Y-m-d_H-i-s');

$response = Array();
$response['t1'] = $message;
$response['status'] = 'Thanks for you feedback!';
echo json_encode($response);
?>