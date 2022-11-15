<?php
namespace image;
function get_image_to_base64($dir_path, $filename) {
    $filepath = $dir_path  . $filename;
    $im = file_get_contents($filepath);
    $type = pathinfo($filepath, PATHINFO_EXTENSION);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($im);
    return $base64;
}
?>