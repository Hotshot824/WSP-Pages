<?php
require __DIR__ . '/lib/tmpfile.php';

$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// temporary file clear function.
\tmpfile\random_remove_tmpfile();

// Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);
$response = Array();

$temp_key = $decoded['temp_key'];
$upload_path = $db_default['ptmp.path'];
$upload_path = $upload_path . $temp_key . "/";

if (!file_exists($upload_path)) {
    mkdir($upload_path, 0777, true);
}

\tmpfile\move_file($decoded['original_img'], $upload_path, 'f_original.png');
\tmpfile\move_file($decoded['label_img'], $upload_path, 'f_label.png');

// check login
if (isset($decoded['stay_in'])) {
    $lifetime = 86400;
    ini_set("session.gc_maxlifetime", $lifetime);
}
session_save_path('/tmp');
session_start();

if (!isset($_SESSION['patientID'])) {
    exit(json_encode($response));
}

$cur_date = date("Y-m-d_H-i-s");
$area = $decoded['area'];
$store_path = $db_default['ptmp.storage_path'] . $_SESSION['patientID'] . "/";
$stroe_original = $store_path . "frontend/original/" . $cur_date . ".png";
$stroe_label = $store_path . "frontend/label/" . $cur_date . ".png";

$sql_insert = "INSERT INTO `frontend_area`(`patient_id`, `area`, `date`, `original_img`, `label_img`)".
" VALUES ('".$_SESSION['patientID']."','". $area ."','".$cur_date."','".$stroe_original."','".$stroe_label."')";

\tmpfile\stoage_file($upload_path . 'f_original.png', $stroe_original);
\tmpfile\stoage_file($upload_path . 'f_label.png', $stroe_label);

try {
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e) {
    $response['error_status'] = "Error: Database connection error!";
    exit(json_encode($response));
}

try {
    $result = mysqli_query($mysqli, $sql_insert);
} catch (Exception $e){
    $response['error_status'] = "Error: Database insert error!";
    exit(json_encode($response));
}

echo json_encode($response);
?>