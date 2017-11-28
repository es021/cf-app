<?php
class AppMailer {

    const TYPE_STUDENT_REGISTRATION = "STUDENT_REGISTRATION";
    const TYPE_RESET_PASSWORD = "RESET_PASSWORD";
    const TYPE_NEW_RECRUITER = "NEW_RECRUITER";
    const EMAIL_TEMPLATE = MYP_ROOT_PATH . "/ajax/app/email_template";

    public static function send_mail($to_email, $email_data, $type) {
        //** filter set to html **/
        function app_set_html_mail_content_type() {
            return 'text/html';
        }

        add_filter('wp_mail_content_type', 'app_set_html_mail_content_type');

        $apps_name = get_bloginfo("name");
        $content = file_get_contents(EMAIL_TEMPLATE . "/$type.html");
        $title = "";

        //** title and content generation using $user_data ***//
        switch ($type) {
            case self::TYPE_STUDENT_REGISTRATION:
                $title = "Welcome To $apps_name";

                //replace constant from template
                $search = array("{#first_name}", "{#last_name}", "{#activation_link}");
                $replace = array($email_data[SiteInfo::USERMETA_FIRST_NAME]
                    , $email_data[SiteInfo::USERMETA_LAST_NAME]
                    , $email_data["activation_link"]);
                $content = str_replace($search, $replace, $content);
                break;

            case self::TYPE_RESET_PASSWORD:
                $title = "[$apps_name] Reset Password Link";

                //replace constant from template
                $search = array("{#first_name}", "{#link}");
                $replace = array($email_data[SiteInfo::USERMETA_FIRST_NAME], $email_data["link"]);
                $content = str_replace($search, $replace, $content);
                break;

            case self::NEW_RECRUITER:
                $title = "Welcome To $apps_name";

                //replace constant from template
                $search = array("{#company_name}", "{#app_name}", "{#set_password_link}");
                $replace = array($email_data["company_name"], $apps_name, $email_data["reset_password_link"]);
                $content = str_replace($search, $replace, $content);
                break;
        }

        $ret = wp_mail($to_email, $title, $content);
        remove_filter('wp_mail_content_type', 'app_set_html_mail_content_type');
        return $ret;
    }
}
?>

