<?php
require __DIR__ . '/lib/remove_tmp.php';

\tmpfile\random_remove_tmpfile();

$response = Array();
$response['last_time'] = "Hello";
echo json_encode($response);
?>