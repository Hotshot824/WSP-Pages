<?php
use LDAP\Result;
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/tmpfile.php';
require __DIR__ . '/lib/database.php';

$path = "/etc/php/8.1/cli/php.ini";
$php_default = parse_ini_file($path);

// temporary file clear function.
\tmpfile\random_remove_tmpfile();

// receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$temp_key = $decoded['temp_key'];
$result_path = $php_default['ptmp.path'] . $temp_key . "/";
$upload_path = $result_path . "upload/";

// decode image move to upload path
\tmpfile\upload_file($decoded['oringnal_image'], $upload_path, 'original.png');
copy($upload_path.'original.png', $result_path.'unresize_original.png');

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
$response['area'] = $area;
$response['oringnal_image'] = \image\get_image_to_base64($result_path, 'resize_original.png');
$response['overlay_image'] = \image\get_image_to_base64($result_path, 'overlay.png');
$response['super_position_image'] = \image\get_image_to_base64($result_path, 'superposition.png');
$response['area_image'] = \image\get_image_to_base64($result_path, 'area.png');

$db = new \database\WSPDB(isset($decode["stay_in"]));
if (!$db -> Check_login()) {
    exit(json_encode($response));
}

$response['error'] = $db -> Database_connect();
if (isset($response['error'])) {
    exit(json_encode($response));
}

$store_path = $php_default['ptmp.storage_path'] . $_SESSION['patientID'] . "/backend/";
$cur_date = date("Y-m-d_H-i-s");
$_SESSION['last_predict_date'] = $cur_date;

\tmpfile\stoage_file(
    $result_path.'resize_original.png',
    $store_path."original/".$cur_date.".png",
);
\tmpfile\stoage_file(
    $result_path.'unresize_original.png',
    $store_path."unresize_original/".$cur_date.".png",
);
\tmpfile\stoage_file(
    $result_path.'predict_ccl.png',
    $store_path."predict/".$cur_date.".png",
);

$response['error'] = $db -> Insert_predict_result(
    $area, 
    $cur_date, 
    $store_path."original/".$cur_date.".png",
    $store_path."unresize_original/".$cur_date.".png",
    $store_path."predict/".$cur_date.".png",
);
if (isset($response['error'])) {
    exit(json_encode($response));
}

echo json_encode($response);
?>