<?php
namespace tmpfile;
require __DIR__ . '/string.php';

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
?>
