<?php
// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$reomve = $decoded['original'];

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

$response = Array();

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e) {
    $response['error_status'] = "Error: Database connection error!";
    exit(json_encode($response));
}

$sql_update = "UPDATE `area_record`" .
"SET `disable` = true " .
"WHERE `original_img` = '" . $reomve . "';";

if($mysqli){
    $result = mysqli_query($mysqli, $sql_update);
    $response['status'] = "Successfully deleted!";
}

echo json_encode($response);
?>