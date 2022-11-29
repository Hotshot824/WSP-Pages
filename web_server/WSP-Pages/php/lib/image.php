<?php
namespace image;
function get_image_to_base64($dir_path, $filename) {
    $filepath = $dir_path  . $filename;
    $im = file_get_contents($filepath);
    $type = pathinfo($filepath, PATHINFO_EXTENSION);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($im);
    return $base64;
}

function decode_images_move($decoded, $path, $filename) {
    $img = $decoded;
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $path . $filename;
    if (file_put_contents($file, $data)) {
        return true;
    }
    return false;
}
?>