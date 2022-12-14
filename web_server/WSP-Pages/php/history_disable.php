<?php
// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);
$reomve = $decoded['original'];
$response = Array();

// if (!preg_match('/^/home/wsp/mysql_image/.*$/', $reomve)) {
//     $response['error'] = 'This is error path!';
//     exit(json_encode($response));
// }

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e) {
    $response['error_status'] = "Error: Database connection error!";
    exit(json_encode($response));
}

$update_backend = "UPDATE `backend_area`" .
"SET `disable` = true " .
"WHERE `original_img` = '" . $reomve . "';";

$update_frontend = "UPDATE `frontend_area`" .
"SET `disable` = true " .
"WHERE `original_img` = '" . $reomve . "';";

if($mysqli){
    $result = mysqli_query($mysqli, $update_backend);
}

if($mysqli){
    $result = mysqli_query($mysqli, $update_frontend);
}

$response['status'] = "Successfully deleted!";
echo json_encode($response);
?>