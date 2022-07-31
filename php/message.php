<?php
//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

$message = $decoded['message'];

$today = date('Y-m-d_H-i-s');

$TxtFileName = "../save/feedback/" . $today . ".txt";
if( ($TxtRes=fopen ($TxtFileName,"w ")) === FALSE){
    exit();
}
$StrConents = $message;
if(!fwrite ($TxtRes,$StrConents)){
    fclose($TxtRes);
    exit();
}
fclose ($TxtRes);
 
?>