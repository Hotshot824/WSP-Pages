<?php
// Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

$decoded = json_decode($content, true);

$uploadpath   = "../wound/upload/test/images/";
$img = $decoded['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $uploadpath  . '111.png';
$success = file_put_contents($file, $data);
 
$command = escapeshellcmd('../wound/predict.py');
$output = shell_exec($command);

$command = escapeshellcmd('../wound/edge.py');
$output = shell_exec($command); 

$x = $decoded['x'];
$y = $decoded['y'];
$length = $decoded['length'];
$originx = $decoded['originx'];
$originy = $decoded['originy'];
$after_cut_x = $decoded['after_cut_x'];
$after_cut_y = $decoded['after_cut_y'];

$command = escapeshellcmd("../wound/cutPaintArea.py ".$x." ".$y." ".$length." ".$originx." ".$originy." ".$after_cut_x." ".$after_cut_y);
$output = shell_exec($command);
?>