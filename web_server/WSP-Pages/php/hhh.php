<?php
    $path = "/etc/php/8.1/cli/php.ini";
    $db_default = parse_ini_file($path);
    $path = $db_default['pqueue.path'];
    $path_queue = $db_default['pqueue.path'] . "queue.json";
    $probability = $db_default['pqueue.probability'];
    $lifetime = $db_default['pqueue.tmpfile_lifetime'] . " MINUTE";

    $array = Array();
    $json = json_encode($array);
    $bytes = file_put_contents($path_queue, $json); 
?>
