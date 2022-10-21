<?php
// Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

$decoded = json_decode($content, true);

$uploadpath   = "../wound/upload/";
$img = $decoded['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $uploadpath  . 'frontend_label.png';
$success = file_put_contents($file, $data);

$img = $decoded['original_img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $uploadpath  . 'frontend_original.png';
$success = file_put_contents($file, $data);

$command = escapeshellcmd('python ../wound/frontend_save.py');
$output = shell_exec($command); 
?>