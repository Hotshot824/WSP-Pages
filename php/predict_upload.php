<?php

$location = "../wound/upload/test/images/" . "111.png";
if ( move_uploaded_file($_FILES['inputPredictImg']['tmp_name'], $location) ) { 
    
    $command = escapeshellcmd('../wound/predict.py');
    $output = shell_exec($command);
    echo $output;

    $command = escapeshellcmd('../wound/edge.py');
    $output = shell_exec($command); 
    echo $output;		

}

?>