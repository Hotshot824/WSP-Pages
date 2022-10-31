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
    $respond['sql_connection'] = TRUE;
} catch (Exception $e){
    $respond['sql_connection'] = FALSE;
    $respond['sql_connection_error'] = "Error: Database connection failed!";

    // for testing, don't for external use 
    // $respond['sql_connection_error'] = $e->getMessage();
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


if($password != $invite_code){
    $respond['invite_code'] = FALSE;
    exit(json_encode($respond));
} else {
    $respond['invite_code'] = TRUE; 
}

// sql language
$sql_select = "SELECT 1 FROM `patient_info` WHERE patient_id = '" . $patientID . "' LIMIT 1;";
$sql_insert = "INSERT INTO `patient_info` (patient_id, patient_password, salt)" . 
" VALUE ('" . $patientID . "', '" . $password . "', '" . $salt . "');";


if($mysqli){
    $result = mysqli_query($mysqli, $sql_select);
    if(mysqli_num_rows($result) > 0){
        $respond['exist'] = TRUE;
    } else {
        $respond['exist'] = FALSE;
        $result = mysqli_query($mysqli, $sql_insert);
    }
}

echo json_encode($respond);
close_mysqli($mysqli);

return;
?>