<?php
    // facut sa schimbe o variabila data din sesiune cu o variabila data 
    // motivul e sa nu mai scrii 100 de alte scripturi de php pentr aceeasi functionalitate
    session_start();
    $data_sent = json_decode($_POST['myData']);
    $_SESSION[$data_sent->varName] = $data_sent->value;
    echo $_SESSION[$data_sent->varName];
?>