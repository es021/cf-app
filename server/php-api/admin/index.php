<html>
<head></head>
<body>
<?php
include_once '../lib/secret.php';
include_once '../lib/core.php';
require_once 'style.php';

$name = $_POST['name'];
$pass = $_POST['pass'];

$err = null;
$success = null;

// FOR LOGIN
if (isset($name) || isset($pass)) {
    if (empty($name)) {
        $err = "ERROR: Please enter username!";
    }
    if (empty($pass)) {
        $err = "ERROR: Please enter password!";
    }

    if ($name == AUTH_USER && $pass == AUTH_PASSWORD) {
        // Authentication successful - Set session
        session_start();
        $_SESSION['auth'] = 1;
        $_SESSION['login_time'] = time();
        $_SESSION['username'] = $_POST['name'];

        setcookie("username", $_POST['name'], time() + (84600 * 30));
        $success = "Access granted!";
    } else {
        $err = "ERROR: Incorrect username or password!";
    }
}

if ($success != null) {
    header("Location: export_sql.php");
} else { ?>
    <h3>Login To Admin Page</h3>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        Username: <input type="text" name="name" value="<?php echo $_COOKIE['username']; ?>">
        <br>
        Password: <input type="password" name="pass">
        <br>
        <input class="my-btn" type="submit" name="submit" value="Log In">
    </form>
    <div style="color:green;">
        <?=$success ?>
    </div>
    <div style="color:red;">
        <?=$err ?>
    </div>

<?php
}
?>
</body>
</html>