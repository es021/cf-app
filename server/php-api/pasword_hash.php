<?php
include_once 'lib/class-phpass.php';

$hasher = new PasswordHash(8, true);

switch ($_POST["action"]) {
    case 'check_password':
        if($hasher->CheckPassword($_POST["password"], $_POST["hashed"])){
            echo "1";
        }else{
            echo "0";
        }
        break;
        
    case 'hash_password':
        echo $hasher->HashPassword($_POST["password"]);
        break;
}

exit();


//$password = "admin12345";
//$hash = '$P$BXldlSv06404.woLSMWodZVqkHV9gn1';

//create password
//$hashed = $hasher->HashPassword(trim($password));

//check password
//$check = print_r($check);
