<?php
include_once '../lib/secret.php';
include_once 'lib/PHPMailer.php';

define("TYPE_RESET_PASSWORD", "RESET_PASSWORD");
define("APPS_NAME", "SeedsJobFair");

function sendMail($TITLE, $BODY, $TO_EMAIL, $TO_NAME, $isHTML = false) {

    //Create a new PHPMailer instance
    $mail = new PHPMailer();

    //Tell PHPMailer to use SMTP
    $mail->isSMTP();

    //Enable SMTP debugging
    // 0 = off (for production use)
    // 1 = client messages
    // 2 = client and server messages
    $mail->SMTPDebug = 0;
    //$mail->SMTPDebug = 4;
    //Set the hostname of the mail server
    $mail->Host = 'smtp.gmail.com';
    // use
    // $mail->Host = gethostbyname('smtp.gmail.com');
    // if your network does not support SMTP over IPv6
    //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
    $mail->Port = 587;

    //Set the encryption system to use - ssl (deprecated) or tls
    $mail->SMTPSecure = 'tls';

    //Whether to use SMTP authentication
    $mail->SMTPAuth = true;

    // if($isTestSender){
    //     $mail->Username = EMAIL_FROM_TEST;
    //     $mail->Password = EMAIL_PASSWORD_TEST;
    //     $from_name = $from_name == null ? EMAIL_NAME_TEST : $from_name;
    //     $mail->setFrom(EMAIL_FROM_TEST, $from_name);
    // }else{
    //     $mail->Username = EMAIL_FROM;
    //     $mail->Password = EMAIL_PASSWORD;
    //     $from_name = $from_name == null ? EMAIL_NAME : $from_name;
    //     $mail->setFrom(EMAIL_FROM, $from_name);
    // }

    $mail->Username = EMAIL_FROM;
    $mail->Password = EMAIL_PASSWORD;
    $from_name = EMAIL_NAME;
    $mail->setFrom(EMAIL_FROM, $from_name);
   
    //Set who the message is to be sent to
    $mail->addAddress($TO_EMAIL, $TO_NAME);

    //Set the subject line
    $mail->Subject = $TITLE;
    $mail->Body = $BODY;

    if ($isHTML) {
        $mail->isHTML();
    }

    //Read an HTML message body from an external file, convert referenced images to embedded,
    //convert HTML into a basic plain-text alternative body
    //$mail->msgHTML(file_get_contents('contents.html'), __DIR__);
    //Replace the plain text body with one created manually
    //$mail->AltBody = 'This is a plain-text message body';
    //Attach an image file
    //$mail->addAttachment('images/phpmailer_mini.png');
    //send the message, check for errors
    if (!$mail->send()) {
        //echo "Error sent email to ".$TO_EMAIL;
        //echo $mail->ErrorInfo;
        return $mail->ErrorInfo;
    } else {
        //echo "Successfully sent email to ".$TO_EMAIL;
        return true;
        //Section 2: IMAP
        //Uncomment these to save your message in the 'Sent Mail' folder.
        #if (save_mail($mail)) {
        #    echo "Message saved!";
        #}
    }
}


function returnRes($data = null, $err = null) {
    $res = array();

    if ($err != null) {
        $res["err"] = $err;
    } else {
        $res["data"] = $data;
    }

    echo json_encode($res);

    exit();
}

function body_resetPassword($first_name, $reset_link){
    ob_clean();
    ob_start();
    ?>
        <span>
        <h3>Hi <?= $first_name ?></h3>
            Here is the link to reset your password : <br>
            <a target='_blank' href = '<?= $reset_link ?>'>Reset Password</a>
            <br><br>
            <small>Please ignore this email if you did not make a request to change your password.</small>
            <br><br>
            Regards,<br>
            <i>Innovaseeds Solutions</i>
        </span>
    <?php
    $output_string = ob_get_contents();
    ob_end_clean();
    return $output_string;
}

function Main() {
    $resData = null;
    $resErr = null;
    if(!isset($_POST["to"])){
        $resErr = "POST data 'to' is not set";
    } else if(!isset($_POST["params"])){
        $resErr = "POST data 'params' is not set";
    } else if(!isset($_POST["type"])){
        $resErr = "POST data 'type' is not set";
    } else{

        $to = $_POST["to"];
        $params = $_POST["params"];
        $type = $_POST["type"];
    
        $title = "";
        $body = "";
        $name = "";
        $title = "";
    
        switch ($type) {
            case TYPE_RESET_PASSWORD:
                $title = "[" . APPS_NAME . "] Reset Password Link";
                $body = body_resetPassword($params["first_name"], $params["link"]);
                break;
    
        }
        
        $isHtml = true;
        $responseSend = sendMail($title, $body, $to, $name, $isHtml);
    
        if($responseSend === true){
            $resData = "Successfully sent email $type to $to";
        } else {
            $resErr = "Failed to send email $type to $to. Error => $responseSend";
        }
    }
    
    returnRes($resData, $resErr);
}


// $_POST = array(
//         "to" => "zulsarhan.shaari@gmail.com",
//         "params" => array(
//             "first_name" => "Wan Zul",
//             "link" => "www.link.com",
//         ),
//         "type" => "RESET_PASSWORD",
//);

Main();

?>

