<?php

function close_mysqli($mysqli)
{
    $mysqli->close();
}

// get jsondecode
$content = trim(file_get_contents("php://input"));
$text = json_decode($content, true);
$patientID = $text["patientID"];
$password = $text["password"];
$stayIn = $text['stayIn'];

// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

// sql language
$sql_exist = "SELECT 1 FROM `patient_info` WHERE patient_id = '" . $patientID . "' LIMIT 1;";
$sql_select = "SELECT * FROM `patient_info` WHERE `patient_id` = '" . $patientID . "'";

// check data
$response = array();

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e) {
    $response['error_status'] = "Error: Database connection error!";
    exit(json_encode($response));
}

if ($mysqli) {
    $result = mysqli_query($mysqli, $sql_exist);
    if (!(mysqli_num_rows($result) > 0)) {
        $response['error_status'] = "Error: Account not existed!";
        exit(json_encode($response));
    }

    $result = mysqli_query($mysqli, $sql_select);
    $result = mysqli_fetch_array($result);
    $password = hash('sha256', $password . $result['salt']);

    if ($password != $result['patient_password']) {
        $response['error_status'] = "Error: Password error!";
        exit(json_encode($response));
    }

    session_save_path('/tmp');
    if ($stayIn) {
        $lifetime = 86400;
        ini_set("session.gc_maxlifetime", $lifetime);
    } else {
        $lifetime = 1800;
        ini_set("session.gc_maxlifetime", $lifetime);
    }
    session_start();

    $_SESSION['patientID'] = $patientID;
}

echo json_encode($response);
close_mysqli($mysqli);

return;
?>