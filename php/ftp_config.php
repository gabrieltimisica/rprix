<?php
$ftp_server = "192.168.13.17";
$ftp_user = "webapp";
$ftp_pass = "BEnV8Qr8.8qqy32ev!FTP";
$ftpConn = ftp_connect($ftp_server, 12021) or die ("Cannot connect to host");
ftp_login($ftpConn, $ftp_user, $ftp_pass)or die("Cannot login"); 
?>