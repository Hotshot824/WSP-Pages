<?php
$dbname = 'WSP';
$link = mysqli_connect(ini_get("mysqli.default_host"), 
ini_get("mysqli.default_user"), 
ini_get("mysqli.default_pw"),
$dbname);

$id = "Babalseas";
$passsword = "Hello,world!";

$sql_select = "SELECT 1 FROM `patient_info` WHERE patient_id = '$id' LIMIT 1;";
$sql_insert = "INSERT INTO `patient_info` (patient_id, patient_password, salt)" . 
" VALUE ('$id', '$passsword', 'Hello');";

if($link){
    $result = mysqli_query($link, $sql_select);
    if(mysqli_num_rows($result) > 0){
        echo "This account exists!\n";
    } else {
        echo "This account not exists!\n";
        $result = mysqli_query($link, $sql_insert);;
        echo "Add account succeeded!\n";
    }
} else {
    echo "Connection failed!\n" . mysqli_connect_error();
}
?>