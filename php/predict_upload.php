<?php

$location = "../wound/upload/test/images/" . "111.png";
if ( move_uploaded_file($_FILES['file']['tmp_name'], $location) ) { 
		
    $command = escapeshellcmd('python ../wound/predict.py');
    $output = shell_exec($command);
    echo $output ."<br>";

    $command = escapeshellcmd('python ../wound/edge.py');
    $output = shell_exec($command); 
    
    echo $output ."<br>";		
}

?>