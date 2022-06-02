<?php
/* Get the name of the uploaded file */
$filename = $_FILES['file']['name'];

/* Choose where to save the uploaded file */
$location = "upload/".$filename;

/* Save the uploaded file to the local filesystem */
move_uploaded_file($_FILES['file']['tmp_name'], $location);
?>