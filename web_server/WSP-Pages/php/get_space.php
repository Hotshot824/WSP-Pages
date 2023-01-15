<?php
require __DIR__ . '/lib/database.php';

$db = new \database\WSPDB(isset($_GET['stay_in']));

// check data
$response = Array();
if ($db -> Check_login()) {
    $response['storage_size'] = $db -> Get_storage_size();
    $response['max_size'] = $db -> Get_maxsize();
    exit(json_encode($response));
} else {
    $response['error'] = 'No login!';
    exit(json_encode($response));
}

?>