<?php
namespace tmpfile;

require __DIR__ . '/string.php';
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

function upload_file($img, $upload_path, $filename) {
    // decode image move to upload path
    if (!file_exists($upload_path)) {
        mkdir($upload_path, 0775, true);
    }

    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $upload_path . $filename;
    $success = file_put_contents($file, $data);
}

function stoage_file($upload_path, $store_path) {
    if (!file_exists(\string\getPath($store_path))) {
        mkdir(\string\getPath($store_path), 0775, true);
    }

    try {
        copy($upload_path, $store_path);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Storage file error!";
        exit(json_encode($response));
    }
}

function random_remove_tmpfile() {
    $path = "/etc/php/8.1/cli/php.ini";
    $db_default = parse_ini_file($path);

    // 1 / ptmp.probability do tempoaray file clear;
    if (1 != rand(1, $db_default['ptmp.probability'])) {
        return;
    }

    $path = $db_default['ptmp.path'];
    $lifetime = $db_default['ptmp.tmpfile_lifetime'];

    $command = "find " . $path . "* -maxdepth 1 -name '*' -mmin +" . $lifetime . " -type d | xargs rm -rf";
    $output = shell_exec($command);
}

function store_result($patientID, $area, $store_path, $result_path) {
    try {
        $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    if (!file_exists($store_path)) {
        mkdir($store_path . "original/", 0775, true);
    }
}
?>
