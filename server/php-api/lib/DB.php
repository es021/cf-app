<?php

include_once 'core.php';
include_once 'secret.php';

class DB {

    var $common;
    var $conn = false;
    var $db_hostname;
    var $db_name;
    var $db_username;
    var $db_password;
    var $db_sql;

    public function __construct() {
        $this->db_hostname = DB_HOST;
        $this->db_name = DB_NAME;
        $this->db_username = DB_USER;
        $this->db_password = DB_PASSWORD;
        $this->init();
    }

    private function init() {
        if (!$this->conn) {
            $this->conn = mysqli_connect($this->db_hostname, $this->db_username, $this->db_password, $this->db_name);
        }
    }

    public function query($q) {
        $this->init();
        $this->db_sql = $q;
        $result = mysqli_query($this->conn, $q);
        if (!$result) {
            die("Invalid query -- $q -- " . mysqli_error($this->conn));
        }
        return $result;
    }

    public function query_delete($tableName = "", $wherePhrase = "") {
        return $this->query(sprintf("DELETE FROM %s %s", ($tableName != "") ? $tableName : $this->db_tablename, ($wherePhrase != "") ? $wherePhrase : $this->db_wherephrase));
    }

    public function query_array($q) {
        $this->init();
        $this->db_sql = $q;
        $result = mysqli_query($this->conn, $q);
        if (!$result) {
            die("Invalid query -- $q -- " . mysqli_error($this->conn));
        }

        $result_array = array();
        $count = 0;
        while ($item = mysqli_fetch_assoc($result)) {
            $result_array[$count] = $item;
            $count++;
        }

        return $result_array;
    }

    public function query_insert($table, $arr = array()) {

        $sql = "";
        $sql .= "INSERT INTO ";
        $sql .= $table;
        $sql .= " ( ";
        $count = 1;
        foreach ($arr as $k => $arrItem) {
            $sql .= "`" . $k . "`";
            if ($count < count($arr))
                $sql .= ", ";
            $count++;
        }
        $sql .= " ) ";
        $sql .= " VALUES ";
        $sql .= " ( ";
        $count = 1;
        foreach ($arr as $k => $arrItem) {
            $arrItem = stripslashes($arrItem);
            //$sql .= "'".str_replace("'", "''", $arrItem)."'";
            $sql .= "'" . addslashes(mysqli_escape_string($this->conn, $arrItem)) . "'";
            //$sql .= "'".$arrItem."'";
            if ($count < count($arr))
                $sql .= ", ";
            $count++;
        }
        $sql .= " ) ";
        return $this->query($sql);
    }

    public function query_replace($table, $arr = array()) {

        $sql = "";
        $sql .= "REPLACE INTO ";
        $sql .= $table;
        $sql .= " ( ";
        $count = 1;
        foreach ($arr as $k => $arrItem) {
            $sql .= "`" . $k . "`";
            if ($count < count($arr))
                $sql .= ", ";
            $count++;
        }
        $sql .= " ) ";
        $sql .= " VALUES ";
        $sql .= " ( ";
        $count = 1;
        foreach ($arr as $k => $arrItem) {
            $arrItem = stripslashes($arrItem);
            //$sql .= "'".str_replace("'", "''", $arrItem)."'";
            $sql .= "'" . addslashes(mysqli_escape_string($this->conn, $arrItem)) . "'";
            //$sql .= "'".$arrItem."'";
            if ($count < count($arr))
                $sql .= ", ";
            $count++;
        }
        $sql .= " ) ";
        return $this->query($sql);
    }

    public function query_update($table, $where, $arr = array()) {

        $sql = "";
        $sql .= "UPDATE ";
        $sql .= $table;
        $sql .= " SET ";
        $count = 1;
        foreach ($arr as $k => $arrItem) {
            $arrItem = stripslashes($arrItem);
            $sql .= "`" . $k . "`=";
            $sql .= ($arrItem != '') ? "'" . addslashes(mysqli_escape_string($this->conn, $arrItem)) . "'" : "''";
            if ($count < count($arr))
                $sql .= ", ";
            $count++;
        }
        $sql .= " " . $where;
        return $this->query($sql);
    }

    public function generateUniqueID() {
        return strtoupper(md5(uniqid((time() * rand()), true)));
    }

}
