<?php
if(isset($_POST["logout"]) && $_POST["logout"] == "1"){
    session_destroy();
    $_SESSION = array();
    header("Location: index.php");
}
?>
<form id="logout" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <input hidden="hidden" type="text" name="logout" value="1">
    <input class="my-btn" type="submit" name="submit" value="Log Out">
</form>
