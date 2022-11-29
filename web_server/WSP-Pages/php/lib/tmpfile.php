<?php
namespace tmpfile;
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

function store_predict_result($area, $store_path, $origin, $predict) {
    $path = "/etc/php/8.1/cli/php.ini";
    $db_default = parse_ini_file($path);
    
    // database link
    define('_DBhost', $db_default['mysqli.default_host']);
    define('_DBuser', $db_default['mysqli.default_user']);
    define('_DBpassword', $db_default['mysqli.default_pw']);
    define('_DBname', 'WSP');

    $cur_date = date("Y-m-d_h-i-s", $d);
    $origin_store = $store_path . "original/" . $cur_date . ".png";
    $predict_store = $store_path . "predict/" . $cur_date . ".png";

    try {
        $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
    } catch (Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    if (!file_exists($store_path)) {
        mkdir($store_path . "original/", 0775, true);
        mkdir($store_path . "predict/", 0775, true);
    }
    
    try {
        $moved = rename($origin, $origin_store);
        $moved = rename($predict, $predict_store);
    } catch (Exception $e){
        $response['error_status'] = "Error: Database connection error!";
        exit(json_encode($response));
    }

    // sql language
    $sql_insert = "INSERT INTO `area_record`(`patient_id`, `area`, `date`, `original_img`, `predcit_img`)" .
    " VALUES ('" . $_SESSION['patientID'] . "','" . $area . "','" . $cur_date . "','" . $origin_store . "','" . $predict_store . "')";
    mysqli_query($mysqli, $sql_insert);
    
}
?>
