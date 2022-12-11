<?php
$path = "/etc/php/8.1/cli/php.ini";
$php_default = parse_ini_file($path);
$Max_size = $php_default['ptmp.storage_maxsize'];

echo $Max_size;
?>