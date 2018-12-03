<?php
$email_data = array(
                "to"=> "zulsarhan.shaari@gmail.com",
                "params"=>array(
                    "title" => "Test",
                    "content" => "what ev"
                ),
                "type"=> "CUSTOM_EMAIL"
            );

$params = array( 
    "action" => "app_send_email",
    "data" => $email_data
);

$url ="https://seedsjobfair.com/career-fair/wp-admin/admin-ajax.php";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));

// receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec ($ch);

curl_close ($ch);