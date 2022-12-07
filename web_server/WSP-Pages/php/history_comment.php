<?php
// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e) {
    $response['error_status'] = "Error: Database connection error!";
    exit(json_encode($response));
}

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$comment = $decoded['comment'];
$original = $decoded['original'];

$response = Array();

$update_backend = "UPDATE `backend_area` " .
"SET `comment` = '" . $comment . "' " .
"WHERE `original_img` = '" . $original . "';";

$update_frontend = "UPDATE `frontend_area` " .
"SET `comment` = '" . $comment . "' " .
"WHERE `original_img` = '" . $original . "';";

if($mysqli){
    $result = mysqli_query($mysqli, $update_backend);
}

if($mysqli){
    $result = mysqli_query($mysqli, $update_frontend);
}

$response['status'] = "Successfully comment!";
echo json_encode($response);

?>