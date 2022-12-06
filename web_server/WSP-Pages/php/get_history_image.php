<?php
require __DIR__ . '/lib/image.php';
require __DIR__ . '/lib/string.php';

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$response = Array();

$response['original_img'] = \image\get_image_to_base64(\string\getPath($decoded['orignal']), 
\string\getFilename($decoded['orignal']));
$response['predict_img'] = \image\get_image_to_base64(\string\getPath($decoded['predict']), 
\string\getFilename($decoded['predict']));

$response['tt'] = \string\getPath($decoded['orignal']);
$response['qq'] = \string\getPath($decoded['predict']);

echo json_encode($response);
?>