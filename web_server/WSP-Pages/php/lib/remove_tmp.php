<?php
namespace tmpfile;
function random_remove_tmpfile() {
    $path = "/etc/php/8.1/cli/php.ini";
    $db_default = parse_ini_file($path);
    $path = $db_default['pqueue.path'];

    // $command = "ls -l " . $path . " | grep '^d' | wc -l";
    // $output = shell_exec($command);
    // echo $output;

    $command = "find " . $path . " -maxdepth 1 -name '*' -mmin +0 -type d ";
    $command = "find . -maxdepth 1 -type d -name'*' -mmin +0 -exec rm -rf {} \;";
    $output = shell_exec($command);
    echo $output;
}
?>
