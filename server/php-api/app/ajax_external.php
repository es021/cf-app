<?php

///should not use any constant from SiteInfo

include_once 'AppMailer.php';

// if error than return res.error
// if success than return res.data

function app_return_res($data = null, $err = null) {
    $res = array();

    if ($err != null) {
        $res["err"] = $err;
    } else {
        $res["data"] = $data;
    }

    echo json_encode($res);

    wp_die();
}

function app_filter_err_param($params) {
    $resErr = null;
    foreach ($params as $p) {
        if (!isset($_POST["data"][$p])) {
            $resErr = "Param '$p' is not specified";
            break;
        }
    }

    if ($resErr != null) {
        app_return_res(null, $resErr);
    } else {
        return true;
    }
}

add_action('wp_ajax_app_register_user', 'app_register_user');
add_action('wp_ajax_nopriv_app_register_user', 'app_register_user');

function app_register_user() {
    app_filter_err_param(array("userdata", "usermeta"));


    $resErr = null;
    $resData = null;

    $userdata = $_POST["data"]["userdata"];
    $usermeta = $_POST["data"]["usermeta"];

    //wp_die();
    //role might need to stringify
    //USERMETA_ROLES_ARRAY
    // serialize();
    //insert to users table
    $user_id = wp_insert_user($userdata);

    //if error
    if (is_wp_error($user_id)) {
        $resErr = $user_id->get_error_message();
    }
    // if success update user meta
    else {
        $key = sha1($user_id . time());

        //insert to meta users table
        $usermeta["activation_key"] = $key;

        if (is_array($usermeta)) {
            foreach ($usermeta as $k => $v) {
                update_user_meta($user_id, $k, $v);
            }
        }

        $resData = array(
            "ID" => $user_id,
            "activation_key" => $key
        );
    }

    app_return_res($resData, $resErr);


    // return here?
    // we might need to skip this ...
    //** Send activation email ***//
    /*
      $activation_link = add_query_arg(
      array(SiteInfo::USERMETA_ACTIVATION_KEY => $key,
      SiteInfo::USERS_ID => $user_id), get_permalink(get_page_by_path(SiteInfo::PAGE_USER_ACTIVATION)));

      $email_data = array();
      $email_data["activation_link"] = $activation_link;
      $email_data[SiteInfo::USERMETA_FIRST_NAME] = $usermeta[SiteInfo::USERMETA_FIRST_NAME];
      $email_data[SiteInfo::USERMETA_LAST_NAME] = $usermeta[SiteInfo::USERMETA_LAST_NAME];
      //myp_send_email($userdata[SiteInfo::USERS_EMAIL], $email_data, SiteInfo::EMAIL_TYPE_USER_ACTIVATION);

      AppMailer::send_mail($userdata[SiteInfo::USERS_EMAIL], $email_data, AppMailer::TYPE_STUDENT_REGISTRATION);


      $res['status'] = SiteInfo::STATUS_SUCCESS;
      $res['data'] = $user_id;
      return $res;

     */
}

add_action('wp_ajax_app_send_email', 'app_send_email');
add_action('wp_ajax_nopriv_app_send_email', 'app_send_email');

function app_send_email() {
    app_filter_err_param(array("to", "params", "type"));
    $resData = null;
    $resErr = null;
    
    $to = $_POST["data"]["to"];
    $params = $_POST["data"]["params"];
    $type = $_POST["data"]["type"];

    if (AppMailer::send_mail($to, $params, $type)) {
        $resData = "Successfully sent email $type to $to";
    } else {
        $resErr = "Failed to send email $type to $to";
    }
    app_return_res($resData, $resErr);
}

?>