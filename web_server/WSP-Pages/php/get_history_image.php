<?php
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/string.php';

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$response = Array();

if ($decoded['orignal']) {
    $response['original_img'] = \image\get_image_to_base64(\string\getPath($decoded['orignal']), \string\getFilename($decoded['orignal']));
}
if ($decoded['predict']) {
    $response['predict_img'] = \image\get_image_to_base64(\string\getPath($decoded['predict']), \string\getFilename($decoded['predict']));
}

echo json_encode($response);
?>