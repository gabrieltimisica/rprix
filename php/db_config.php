<?php
//    define('DB_SERVER', '192.168.15.47:3306');
   define('DB_SERVER', '192.168.12.106:3306');
   define('DB_USERNAME', 'romprix');
   define('DB_PASSWORD', 'romprix');
   define('DB_DATABASE', 'test');
   $db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
?>