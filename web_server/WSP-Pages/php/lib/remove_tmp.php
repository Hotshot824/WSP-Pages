<?php
namespace tmpfile;
function random_remove_tmpfile() {
    $path = "/etc/php/8.1/cli/php.ini";
    $db_default = parse_ini_file($path);
    $path = $db_default['ptmp.path'];
    $lifetime = $db_default['ptmp.tmpfile_lifetime'];

    // $command = "ls -l " . $path . " | grep '^d' | wc -l";
    // $output = shell_exec($command);
    // echo $output;

    $command = "find " . $path . "* -maxdepth 1 -name '*' -mmin +" . $lifetime . " -type d | xargs rm -rf";
    $output = shell_exec($command);
    echo $output;
}
?>
