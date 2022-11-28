<?php
$store_path = "/root/mysql_image/" . "isutest" . "/";
if (!file_exists($store_path)) {
    echo "hello!";
    echo $store_path . "original/";
    mkdir($store_path . "original/", 0755, true);
    mkdir($store_path . "predict/", 0755, true);
}
?>
