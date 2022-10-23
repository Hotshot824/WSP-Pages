<?php
$host = 'Database';
$dbuser ='root';
$dbpassword = 'test';
$dbname = 'WSP';
$link = mysqli_connect($host, $dbuser, $dbpassword, $dbname);

$id = "TestID";
$passsword = "Hello,world!";

$sql_select = "SELECT 1 FROM `patient_info` WHERE patient_id = '$id' LIMIT 1;";
$sql_insert = "INSERT INTO `patient_info` (patient_id, patient_password) VALUE ('$id', '$passsword');";

$result = mysqli_query($link, $sql_select);
if(mysqli_num_rows($result) > 0){
    echo "This account exists!\n";
} else {
    echo "This account not exists!\n";
}

if($link){
    $result = mysqli_query($link, $sql_insert);
    echo gettype($result) . "\n";
    echo "Connection succeeded!\n";
}
else {
    echo "Connection failed!\n" . mysqli_connect_error();
}
?>