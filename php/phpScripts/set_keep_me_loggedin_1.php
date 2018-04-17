<?php
    session_start();
    $_SESSION['keep_logged'] = 1;
    echo $_SESSION['keep_logged'];
?>