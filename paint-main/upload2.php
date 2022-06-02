<?php
//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

$decoded = json_decode($content, true);

$output = shell_exec("pwd");
echo $output;

$uploadpath   = 'upload/';
$img = $decoded['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $uploadpath  . '123.png';
$success = file_put_contents($file, $data);
  
$pixel = $decoded['pixel'];

$command = escapeshellcmd("./A.py ".$pixel);
$output = shell_exec($command);
 
?>