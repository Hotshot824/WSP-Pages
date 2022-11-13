<?php
// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);
$path_queue = $db_default['pqueue.path'] . "queue.json";

$content = trim(file_get_contents("php://input"));
$text = json_decode($content, true);
$session_id = $text["session_id"];

// check queue
$JsonParser = file_get_contents($path_queue);
$array = json_decode($JsonParser, true);

$response = Array();

$array[$session_id]['last_time'] = date("Y-m-d H:i:s");

$response['last_time'] = $array[$session_id]['last_time'];

echo json_encode($response);

$json = json_encode($array);
$bytes = file_put_contents($path_queue, $json); 

// echo $db_default['pqueue.max_user']

?>
