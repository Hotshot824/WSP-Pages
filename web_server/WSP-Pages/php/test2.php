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

$respond = array();

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
    $respond['sql_connection'] = TRUE;
} catch (Exception $e){
    $respond['sql_connection'] = FALSE;
    $respond['sql_connection_error'] = "Error: Database connection failed!";

    // for testing, don't for external use 
    // $respond['sql_connection_error'] = $e->getMessage();
}


// sql language
$sql_search = "SELECT * FROM `patient_info` WHERE `patient_id` = 'Benson'";


if($mysqli){
    $result = mysqli_query($mysqli, $sql_search);
}
$result = mysqli_fetch_array($result);

echo $result['patient_password'] . "\n";
echo json_encode($respond) . "\n";
close_mysqli($mysqli);

return;
?>