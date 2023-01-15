<?php

require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/tmpfile.php';
require __DIR__ . '/lib/database.php';

// Upload directory
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$path = "/etc/php/8.1/cli/php.ini";
$php_default = parse_ini_file($path);

$temp_key = $decoded['temp_key'];
$result_path = $php_default['ptmp.path'] . $temp_key . "/";
$upload_path = $result_path . "upload/";

\image\decode_images_move($decoded['label'], $result_path, 'iou_label.png');

$command = escapeshellcmd('python ../wound/iou.py ' . $result_path);
$output = shell_exec($command);
$IOU = str_replace("\n", "", $output);

$response = Array();
$response['iou_image'] = \image\get_image_to_base64($result_path, 'iou_result.png');
$response['iou_value'] = $IOU; 

// check login
$db = new \database\WSPDB(isset($decode["stay_in"]));
if (!$db -> Check_login()) {
    exit(json_encode($response));
}

$response['error'] = $db -> Database_connect();
if (isset($response['error'])) {
    exit(json_encode($response));
}

$cur_date = $_SESSION['last_predict_date'];
$store_path = $php_default['ptmp.storage_path'] . $_SESSION['patientID'] . "/backend/";

\tmpfile\stoage_file(
    $result_path.'iou_label.png',
    $store_path."iou/".$cur_date.".png",
);

$response['error'] = $db -> Update_iou_result($store_path."iou/".$cur_date.".png", $cur_date);
if (isset($response['error'])) {
    exit(json_encode($response));
}

echo json_encode($response);
?>