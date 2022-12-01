<?php

require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/tmpfile.php';

// Upload directory
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

$temp_key = $decoded['temp_key'];
$upload_path = $db_default['ptmp.path'];
$result_path = $upload_path . $temp_key . "/";
$upload_path = $upload_path . $temp_key . "/upload/";

\image\decode_images_move($decoded['label'], $result_path, 'iou_label.png');

$command = escapeshellcmd('python ../wound/iou.py ' . $result_path);
$output = shell_exec($command);
$IOU = str_replace("\n", "", $output);

$response = Array();
$response['iou_image'] = \image\get_image_to_base64($result_path, 'iou_result.png');
$response['iou_value'] = $IOU; 

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

$cur_date = $_SESSION['last_predict_date'];

$predict = $result_path . 'predict_ccl.png';
$store_path = "/home/wsp/mysql_image/" . $_SESSION['patientID'] . "/";
$iou_store_path = $store_path . "iou/";
$iou = $result_path . 'iou_result.png';

\tmpfile\store_iou_result($_SESSION['patientID'], $iou_store_path, $iou, $cur_date);

echo json_encode($response);
?>