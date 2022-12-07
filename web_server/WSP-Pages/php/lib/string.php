<?php
namespace string;
function generate_random_string($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function getPath ($path) {
    $path = preg_replace("/[\w-]+\.png/i","",$path); 
    return $path;
}

function getFilename ($path) {
    $path = explode("/", $path);
    return $path[count($path) - 1];
}
?>