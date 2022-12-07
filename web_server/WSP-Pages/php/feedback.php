<?php
// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);
$type = $decoded['type'];
$message = $decoded['message'];

// check login
if (isset($decoded['stay_in'])) {
    $lifetime = 86400;
    ini_set("session.gc_maxlifetime", $lifetime);
}
session_save_path('/tmp');
session_start();

$response = Array();

$sql_insert = "INSERT INTO `feedback`(`patient_id`, `date`, `type`, `message`) " .
"VALUES ('". $_SESSION['patientID'] ."', Now(), '". $type ."','" . $message . "');";

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e){
    $response['error_status'] = "Error: Database connect error!";
    exit(json_encode($response));
}

try {
    $result = mysqli_query($mysqli, $sql_insert);
} catch (Exception $e){
    $response['error_status'] = "Error: Database error!";
    exit(json_encode($response));
}

$response['status'] = 'Thanks for you feedback!';
echo json_encode($response);
?>