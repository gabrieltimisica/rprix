<?php
    session_start();
    $_SESSION['keep_logged'] = 0;
    echo $_SESSION['keep_logged'];
?>