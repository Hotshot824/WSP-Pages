<?php
namespace tmpfile;
function random_remove_tmpfile() {
    $path = "/etc/php/8.1/cli/php.ini";
    $db_default = parse_ini_file($path);
    $path = $db_default['pqueue.path'];
    $path_queue = $db_default['pqueue.path'] . "queue.json";
    $probability = $db_default['pqueue.probability'];
    $lifetime = $db_default['pqueue.tmpfile_lifetime'] . " MINUTE";

    if(1 != rand(1, $probability)){
        return FALSE;
    }

    $JsonParser = file_get_contents($path_queue);
    $array = json_decode($JsonParser, true);

    $limit_time = date_create(date("Y-m-d H:i:s"));
    date_sub($limit_time, date_interval_create_from_date_string($lifetime));
    $limit_time = date_format($limit_time,"Y-m-d H:i:s") . "\n";

    foreach ($array as $key => $val){
        if (strtotime($limit_time) > strtotime($array[$key]['last_time'])){
            echo "Hello";
            unset($array[$key]);
            $command = "rm -rf " . $path . $key;
            $output = shell_exec($command);
        }
    }

    $json = json_encode($array);
    $bytes = file_put_contents($path_queue, $json); 

    return TRUE;
}
?>
