<?php
// Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$uploadpath   = "../wound/upload/test/images/";
$img = $decoded['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $uploadpath  . 'original.png';
$success = file_put_contents($file, $data);
 
$command = escapeshellcmd('python ../wound/predict.py');
$output = shell_exec($command);

$command = escapeshellcmd('python ../wound/edge.py');
$output = shell_exec($command);

// area augsment
$x = $decoded['x'];
$y = $decoded['y'];
$length = $decoded['length'];
$originx = $decoded['originx'];
$originy = $decoded['originy'];
$after_cut_x = $decoded['after_cut_x'];
$after_cut_y = $decoded['after_cut_y'];

// $x = 5;
// $y = 5;
// $length = 5;
// $originx = 5;
// $originy = 5;
// $after_cut_x = 5;
// $after_cut_y = 5;


$command = escapeshellcmd("python ../wound/backend_area_calc.py ".$x." ".$y." ".$length." ".$originx." ".$originy." ".$after_cut_x." ".$after_cut_y);
$output = shell_exec($command);

// // save image
$command = escapeshellcmd('python ../wound/backend_save.py');
$output = shell_exec($command);
?>