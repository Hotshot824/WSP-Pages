<?php
require __DIR__ . '/lib/string.php';

function close_mysqli($mysqli) {
    $mysqli -> close();
}

// get jsondecode
$content = trim(file_get_contents("php://input"));
$text = json_decode($content, true);
$patientID = $text["patientID"];
$password = $text["password"];

$respond = array();

// get default var
$path = "/etc/php//8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e){
    $respond['error_status'] = 1;
    exit(json_encode($respond));
}

$sql_exist = "SELECT 1 FROM `patient_info` WHERE patient_id = '" . $patientID . "' LIMIT 1;";
$sql_select = "SELECT * FROM `patient_info` WHERE `patient_id` = '" . $patientID ."'";

if($mysqli){
    $result = mysqli_query($mysqli, $sql_exist);
    if(!(mysqli_num_rows($result) > 0)){
        $respond['error_status'] = 2;
        exit(json_encode($respond));
    }else{
        $result = mysqli_query($mysqli, $sql_select);
        $result = mysqli_fetch_array($result);
    }

    $password = hash('sha256', $password . $result['salt']);

    if($password != $result['patient_password']){
        $respond['error_status'] = 3; 
        exit(json_encode($respond));
    }

    session_save_path('/tmp');
    session_start();
    
    $_SESSION['session_id'] = $patientID;
}

echo json_encode($respond);
close_mysqli($mysqli);

return;
?>