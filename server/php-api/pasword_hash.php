<?php

include_once 'class-phpass.php';

$hasher = new PasswordHash(8, true);

$password = "admin12345";
$hash = '$P$BXldlSv06404.woLSMWodZVqkHV9gn1';

//create password
$hashed = $hasher->HashPassword(trim($password));

//check password
$check = $hasher->CheckPassword($password, $hash);

print_r($check);
