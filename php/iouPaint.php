<?php

// Upload directory

$content = trim(file_get_contents("php://input"));

$decoded = json_decode($content, true);

$uploadpath   = "../wound/upload/";
$img = $decoded['label'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $uploadpath  . '1111.png';
$success = file_put_contents($file, $data);
   
$command = escapeshellcmd('../wound/creatlabel.py');
$IOU = shell_exec($command);

$command = escapeshellcmd('../wound/iou.py');
$output = shell_exec($command);	


?>