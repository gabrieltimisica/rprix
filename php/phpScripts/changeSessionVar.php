<?php
    session_start();
    $data_sent = json_decode($_POST['myData']);
    $_SESSION[$data_sent->varName] = $data_sent->value;
    echo $_SESSION[$data_sent->varName];
?>