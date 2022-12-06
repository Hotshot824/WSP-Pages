<?php
use LDAP\Result;
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/tmpfile.php';

$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// temporary file clear function.
\tmpfile\random_remove_tmpfile();

// receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$temp_key = $decoded['temp_key'];
$upload_path = $db_default['ptmp.path'];
$upload_path = $upload_path . $temp_key . "/";

// predict result image path
$result_path = $upload_path;
$upload_path = $upload_path . "upload/";

if (!file_exists($upload_path)) {
    mkdir($upload_path, 0777, true);
}

// decode image move to upload path
$img = $decoded['oringnal_image'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $upload_path  . 'original.png';
$success = file_put_contents($file, $data);

copy($file, $result_path . "unresize_original.png");

// executed predict
$command = escapeshellcmd('python ../wound/resize_image.py ' . $result_path);
$output = shell_exec($command);

$command = escapeshellcmd('python ../wound/predict.py ' . $result_path);
$output = shell_exec($command);

// area augsment
$x = $decoded['x'];
$y = $decoded['y'];
$length = $decoded['length'];
$originx = $decoded['originx'];
$originy = $decoded['originy'];
$after_cut_x = $decoded['after_cut_x'];
$after_cut_y = $decoded['after_cut_y'];

$command = escapeshellcmd("python ../wound/area_calc.py "
.$x." ".$y." ".$length." ".$originx." ".$originy." ".$after_cut_x." ".$after_cut_y." ".$result_path);
$output = shell_exec($command);
$area = str_replace("\n","",$output);

// response images
$response = Array();
$response['oringnal_image'] = \image\get_image_to_base64($result_path, 'resize_original.png');
$response['overlay_image'] = \image\get_image_to_base64($result_path, 'overlay.png');
$response['super_position_image'] = \image\get_image_to_base64($result_path, 'superposition.png');
$response['area_image'] = \image\get_image_to_base64($result_path, 'area.png');
$response['area'] = $area;

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

$store_path = "/home/wsp/mysql_image/" . $_SESSION['patientID'] . "/";
$cur_date = date("Y-m-d_H-i-s");
$_SESSION['last_predict_date'] = $cur_date;

\tmpfile\store_predict_result($_SESSION['patientID'], $area, $store_path, $result_path, $cur_date);

echo json_encode($response);
?>