<?php
require __DIR__ . '/lib/tmpfile.php';

$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// temporary file clear function.
\tmpfile\random_remove_tmpfile();

// Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

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

$response = Array();
$response['upload_path'] = $upload_path;

echo json_encode($response);
?>