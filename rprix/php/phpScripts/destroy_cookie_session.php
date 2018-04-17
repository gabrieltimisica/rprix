<?php
    session_start();
    session_unset();
    unset($_COOKIE["c_id"]);
    unset($_SESSION["PHPSESSID"]);
    setcookie("PHPSESSID", FALSE, -1, '/', "localhost", FALSE, TRUE);
    setcookie("c_id", FALSE, -1, '/', "localhost", FALSE, TRUE);
    session_destroy();
?>