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
$emailAddress = $text['emailAddress'];

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

// password add salt
// random salt
// $salt = \string\generate_random_string() . "\n";
// $password = hash('sha256', $password . $salt);

// fixed password
$salt = "Hello";
$password = hash('sha256', $password . $salt);
$invite_code = "isu2022";
$invite_code = hash('sha256', $invite_code);
$invite_code = hash('sha256', $invite_code . $salt);

// sql language
$sql_exist = "SELECT 1 FROM `patient_info` WHERE patient_id = '" . $patientID . "' LIMIT 1;";
$sql_insert = "INSERT INTO `patient_info` (patient_id, patient_password, salt)" . 
" VALUE ('" . $patientID . "', '" . $password . "', '" . $salt . "');";

if($mysqli){
    $result = mysqli_query($mysqli, $sql_exist);
    if(mysqli_num_rows($result) > 0){
        $respond['error_status'] = 2;
        exit(json_encode($respond));
    }

    if($password != $invite_code){
        $respond['error_status'] = 3; 
        exit(json_encode($respond));
    }

    $result = mysqli_query($mysqli, $sql_insert);
    $respond['error_status'] = FALSE; 
}

echo json_encode($respond);
close_mysqli($mysqli);

return;
?>