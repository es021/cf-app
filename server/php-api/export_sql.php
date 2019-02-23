<!-- ############################################################## -->
<!-- INIT LOGIC -->
<?php
error_reporting(1);
include_once 'lib/DB.php';
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

    $bannedStr = ["DELETE", "DROP", "ALTER", "TRUNCATE", "UPDATE "];
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
<form method="post">
    <?=getSelectExportSql($selectData) ?>
    <input type="submit" value="Run This Query"/>
    <br><br>

    <textarea rows="10"><?= $selectedSql ?></textarea>
</form>

<!-- ############################################################## -->
<!-- STYLE -->
<style>
html{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
}

textarea{
    width: 100%;
}

#error{
    font-weight : bold;
    color:red;
}

#table-sql {
  border-collapse: collapse;
  width: 100%;
  font-size: 13px;
}

#table-sql td, #table-sql th {
  border: 1px solid #ddd;
  padding: 2px;
}

#table-sql tr:nth-child(even){background-color: #f2f2f2;}

#table-sql tr:hover {background-color: #ddd;}

#table-sql th {
  padding : 4px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
</style>


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

