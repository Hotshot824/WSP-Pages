<?php

// Upload directory
$upload_location = "../wound/upload/test/images/"  . "111.png";
$location="../wound/upload/"  . "1111.png";

if ( 
   move_uploaded_file($_FILES['image']['tmp_name'],$upload_location) &&
   move_uploaded_file($_FILES['label']['tmp_name'],$location)
   ) { 
    
   echo $_FILES['image']['name'];
   echo $_FILES['label']['name'];
   
   $command = escapeshellcmd('../wound/creatlabel.py');
   $IOU = shell_exec($command);
   
   $command = escapeshellcmd('../wound/predict.py');
   $output = shell_exec($command);
   
   $command = escapeshellcmd('../wound/iou.py');
   $output = shell_exec($command);
   
      
   // echo $output ."<br>";		
   // echo "<img src= 'Wound-Segmentation-Pages-main/upload/edge.png'/>"."<br>";	

} else {
   echo "file move fail!";
}

?>