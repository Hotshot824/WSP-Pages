<?php
// get jsondecode
$content = trim(file_get_contents("php://input"));
$text = json_decode($content, true);
$patientID = $text["patientID"];
$password = $text["inviteCode"];
$patientName = $text['patientName'];
$emailAddress = $text['emailAddress'];

// get default var
$path = "/etc/php//8.1/cli/php.ini";
$db_default = parse_ini_file($path);

// database link
try {
    define('_DBhost', $db_default['mysqli.default_host']);
    define('_DBuser', $db_default['mysqli.default_user']);
    define('_DBpassword', $db_default['mysqli.default_pw']);
    define('_DBname', 'WSP');
    $mysqli = mysqli_connect(_DBhost, _DBuser, _DBpassword, _DBname);
} catch (Exception $e){
    echo $e->getMessage();
}

// check database
// if ($result = $mysqli -> query("SELECT DATABASE()")) {
//     $row = $result -> fetch_row();
//     echo "Default database is " . $row[0] . "\n";
//     $result -> close();
// }

$sql_select = "SELECT 1 FROM `patient_info` WHERE patient_id = '".$patientID."' LIMIT 1;";
$sql_insert = "INSERT INTO `patient_info` (patient_id, patient_password, salt)" . 
" VALUE ('".$patientID."', '".$password."', 'Hello');";

if($mysqli){
    $result = mysqli_query($mysqli, $sql_select);
    if(mysqli_num_rows($result) > 0){
        echo "This account exists!\n";
    } else {
        echo "This account not exists!\n";
        $result = mysqli_query($mysqli, $sql_insert);;
        
    }
} else {
    echo "Database connection failed!\n" . mysqli_connect_error();
}
?>