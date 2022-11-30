<?php

require __DIR__ . '/lib/image.php';

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

echo json_encode($response);

?>