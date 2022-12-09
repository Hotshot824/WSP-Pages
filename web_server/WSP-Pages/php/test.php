<?php

use database\BaseDatabase;

require __DIR__ . '/lib/database.php';

$content = trim(file_get_contents("php://input"));
$decode = json_decode($content, true);

$db = new \database\WSPDB();
// $db -> database_connect();

?>