<!-- ############################################################## -->
<!-- INIT LOGIC -->
<?php
include_once '../lib/DB.php';
include_once '../lib/core.php';
require_once "header.php"; 

core_checkSession();

$DB = new DB();
define("SELECT_NAME_INDEX", "SELECT_NAME_INDEX");

function getExportSql($DB)
{
    $sql = "select * from 1_export_sql";
    $data = $DB->query_array($sql);
    return $data;
}

function getTextSql($data, $index)
{
    $index--;
    return $data[$index]["text_sql"];
}

function getSelectExportSql($data)
{
    $options = "<option value=''>--SELECT QUERY--</option>";
    $index = 1;
    foreach ($data as $d) {
        $label = $d["label"];
        $selected = $index == $_POST[SELECT_NAME_INDEX] ? "selected" : "";
        $options .= "<option $selected value='$index'>$label</option>";
        $index++;
    }
    $toRet = "<select name='" . SELECT_NAME_INDEX . "'>$options</select>";
    return $toRet;
}

function validateSql($sql)
{
    $sql = strtoupper($sql);
    $err = "";

    if ($sql == "") {
        return "Please Select A Query";
    }

    $bannedStr = ["DELETE ", "DROP ", "ALTER ", "TRUNCATE ", "UPDATE "];
    foreach ($bannedStr as $ban) {
        if (strpos($sql, $ban) !== false) {
            $err = "Query contained invalid token '$ban'";
            return $err;
        }
    }

    $compulsaryStr = ["SELECT"];
    foreach ($compulsaryStr as $com) {
        if (strpos($sql, $com) === false) {
            $err = "Query must contain compulsary token '$com'";
            return $err;
        }
    }

    return null;
}

$selectData = getExportSql($DB);
$selectedIndex = $_POST[SELECT_NAME_INDEX];
$selectedSql = getTextSql($selectData, $selectedIndex);
$error = validateSql($selectedSql);
$view = "";
?>

<!-- ############################################################## -->
<!-- FORM -->
<b>Select A Query And Run It</b><br><br>
<form method="post">
    <?=getSelectExportSql($selectData) ?>
    <input type="submit" value="Run This Query"/>
    <br><br>

    <textarea rows="3"><?= $selectedSql ?></textarea>
</form>


<!-- ############################################################## -->
<!-- LOGIC -->

<?php
if ($error == null) {
    //$q = "select * from cfs";
    $data = $DB->query_array($selectedSql);

    $header = "<thead>";
    $body = "<tbody>";
    $index = 0;
    $keys = array();
    foreach ($data as $d) {
        // create header
        if ($index == 0) {
            $keys = array_keys($d);
            $header .= "<tr>";
            foreach ($keys as $k) {
                $header .= "<th>$k</th>";
            }
            $header .= "</tr>";
        }

        $body .= "<tr>";
        foreach ($keys as $k) {
            $body .= "<td>" . $d[$k] . "</td>";
        }
        $body .= "</tr>";

        $index++;
    }

    $header .= "</thead>";
    $body .= "</tbody>";
    $view = "<table id='table-sql'>$header $body</table><br><br><br>";
}
?>

<!-- ############################################################## -->
<!-- VIEWS -->
<div id="error"><br><?=$error ?></div>
<?=$view ?>

