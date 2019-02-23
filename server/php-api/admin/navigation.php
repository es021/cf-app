<div id="navigation">
    <?php
include_once '../lib/core.php';
$currentPage = $_SERVER["PHP_SELF"];
$pageArr = explode("/", $currentPage);
$currentPage = $pageArr[sizeof($pageArr) - 1];

$pages = array(
    array(
        "page" => "Career Fair Data",
        "url" => "export_sql.php",
    ),
    array(
        "page" => "About",
        "url" => "about.php"
    )
);
?>
<?php
    foreach ($pages as $p) {
    ?>
        <a class="my-btn <?= $currentPage == $p["url"] ?"active" :"" ?>" href="<?=$p["url"] ?>">
            <?= $p["page"] ?>
        </a>
    <?php
    } 
    ?>
</div>