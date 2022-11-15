<?php
$uploadpath   = "../wound/upload/test/images/";
$file = $uploadpath  . 'original.png';
$im = file_get_contents($file);
$type = pathinfo($file, PATHINFO_EXTENSION);
$base64 = 'data:image/' . $type . ';base64,' . base64_encode($im);
echo $base64;
?>
