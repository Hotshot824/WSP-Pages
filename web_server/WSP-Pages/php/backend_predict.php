<?php

use LDAP\Result;

require __DIR__ . '/lib/image.php';

$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$session_id = $decoded['session_id'];
$tmpfile_path = $db_default['ptmp.path'];
$tmpfile_path = $tmpfile_path . $session_id . "/";

// Predict result image path
$result_path = $tmpfile_path;
$tmpfile_path = $tmpfile_path . "upload/";

if (!file_exists($tmpfile_path)) {
    mkdir($tmpfile_path, 0777, true);
}

$img = $decoded['oringnal_image'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $tmpfile_path  . 'original.png';
$success = file_put_contents($file, $data);

$command = escapeshellcmd('python ../wound/predict.py ' . $result_path);
$output = shell_exec($command);

$response = Array();
$response['session_id'] = $session_id;
$response['oringnal_image'] = \image\get_image_to_base64($tmpfile_path, 'original.png');
$response['overlay_image'] = \image\get_image_to_base64($result_path, 'overlay.png');
$response['super_position_image'] = \image\get_image_to_base64($result_path, 'superposition.png');

echo json_encode($response);
?>