<?php
// get default var
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

function resultToArray($result) {
    $rows = array();
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    return $rows;
}

// check login
if (isset($decoded['stay_in'])) {
    $lifetime = 86400;
    ini_set("session.gc_maxlifetime", $lifetime);
}
session_save_path('/tmp');
session_start();

$response = Array();
$sql_select = "SELECT `date`, `area`, `original_img`, `predict_img`, `comment` " .
"FROM `area_record` " .
"WHERE `patient_id` = '" . $_SESSION['patientID'] . "' AND `disable` IS NULL ".
"ORDER BY `date`;";

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e) {
    $response['error_status'] = "Error: Database connection error!";
    exit(json_encode($response));
}

if($mysqli){
    $result = mysqli_query($mysqli, $sql_select);
    $row = resultToArray($result);
    $response['data'] = $row;
    $response['id'] = $_SESSION['patientID'];
    echo json_encode($response);
}
?>