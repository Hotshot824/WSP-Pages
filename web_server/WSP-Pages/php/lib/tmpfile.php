<?php
namespace tmpfile;
$path = "/etc/php/8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
define('_DBhost', $db_default['mysqli.default_host']);
define('_DBuser', $db_default['mysqli.default_user']);
define('_DBpassword', $db_default['mysqli.default_pw']);
define('_DBname', 'WSP');

function move_file($img, $upload_path, $filename) {
    // decode image move to upload path
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $file = $upload_path . $filename;
    $success = file_put_contents($file, $data);
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

function store_predict_result($patientID, $area, $store_path, $result_path, $cur_date) {
    $unresize_origin = $result_path . 'unresize_original.png';
    $origin = $result_path . 'resize_original.png';
    $predict = $result_path . 'predict_ccl.png';
    $origin_store = $store_path . "original/" . $cur_date . ".png";
    $predict_store = $store_path . "predict/" . $cur_date . ".png";
    $unresize_origin_store = $store_path . "unresize_original/" . $cur_date . ".png";

    try {
        $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    if (!file_exists($store_path)) {
        mkdir($store_path . "original/", 0775, true);
        mkdir($store_path . "predict/", 0775, true);
        mkdir($store_path . "unresize_original/", 0775, true);
    }
    
    try {
        copy($origin, $origin_store);
        copy($unresize_origin, $unresize_origin_store);
        copy($predict, $predict_store);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    // sql language
    $sql_insert = "INSERT INTO `area_record`(`patient_id`, `area`, `date`, `original_img`, `unresize_original_img` ,`predict_img`)" .
    " VALUES ('" . $patientID . "','" . $area . "', '" . $cur_date . "','" . $origin_store . "','" . $unresize_origin_store . "','" . $predict_store . "')";
    try {
        mysqli_query($mysqli, $sql_insert);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Database error!";
        exit(json_encode($response));
    }
}

function store_iou_result($patientID, $store_path, $iou, $cur_date) {

    if (!file_exists($store_path)) {
        mkdir($store_path, 0775, true);
    }

    $store_path = $store_path . $cur_date . ".png";

    try {
        $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    try {
        copy($iou, $store_path);
    } catch (\Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    // $sql_update = "UPDATE `area_record`" .
    $sql_update = "UPDATE `area_record` " .
    "SET `iou_img` = '" . $store_path . "' " .
    "WHERE `patient_id` = '" . $patientID . "' AND `original_img` LIKE '%" . $cur_date . "%';";
    mysqli_query($mysqli, $sql_update);
}
?>
