<?php
require __DIR__ . '/lib/image.php';

function getPath ($path) {
    $path = preg_replace("/[\w-]+\.png/i","",$path); 
    return $path;
}

function getFilename ($path) {
    $path = explode("/", $path);
    return $path[count($path) - 1];
}

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$response = Array();

// $response['original_img'] = getPath($decoded['orignal']);
// $response['predict_img'] = getFilename($decoded['orignal']);
$response['original_img'] = \image\get_image_to_base64(getPath($decoded['orignal']), getFilename($decoded['orignal']));
$response['predict_img'] = \image\get_image_to_base64(getPath($decoded['predict']), getFilename($decoded['predict']));

echo json_encode($response);
?>