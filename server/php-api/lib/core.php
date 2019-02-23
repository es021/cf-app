<?php
error_reporting(1);
function X($x)
{
    echo "<pre>";
    print_r($x);
    echo "</pre>";
}

function core_checkSession()
{
    session_start();
    // check session
    if (!isset($_SESSION['auth'])) {
        header("Location: index.php");
    }
}

?>
