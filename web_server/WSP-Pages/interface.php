<?php
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        switch ($_GET['type']) {
            case 'logout':
                include './php/logout.php';
                break;
            default:
                exit(json_encode(Array(
                    'error' => 'Error GET request!'
                )));
                break;
        }
        break;
    case 'POST':
        $_POST = json_decode(file_get_contents("php://input"), true);
        switch ($_POST['type']) {
            case 'checklogin':
                include './php/check_login.php';
                break;
            case 'signin':
                include './php/sign_in.php';
                break;
            case 'signup':
                include './php/sign_up.php';
                break;
            default:
                exit(json_encode(Array(
                    'error' => 'Error POST request!'
                )));
                break;
        }
        break;
    case 'PUT':
        break;
    case 'DELETE':
        break;
    default:
        // 預設方法
        break;
}
?>