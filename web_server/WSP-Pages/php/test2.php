<?php
session_save_path('/tmp');
session_start();

echo $_SESSION['userName'];
?>