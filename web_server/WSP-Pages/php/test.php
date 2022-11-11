<?php
// get default var
$path = "/etc/php//8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// check ip address 
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

// check queue
$queue_path = "/tmp/queue.json";

$JsonParser = file_get_contents($queue_path);
$array = json_decode($Json, true);

$array = Array (
    Array (
        "id" => "01",
        "name" => "Olivia Mason",
        "designation" => "System Architect"
    ),
    Array (
        "id" => "02",
        "name" => "Jennifer Laurence",
        "designation" => "Senior Programmer"
    ),
    Array (
        "id" => "03",
        "name" => "Medona Oliver",
        "designation" => "Office Manager"
    )
);

foreach($array as $i){
    echo $i["id"];
}

// $array = Array ();

$json = json_encode($array);
$bytes = file_put_contents($queue_path, $json); 

echo $db_default['pqueue.max_user']

?>