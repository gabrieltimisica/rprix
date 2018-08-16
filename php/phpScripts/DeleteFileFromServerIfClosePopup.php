<?php
session_start();
include("../db_config.php");
include("../ftp_config.php");
$Token = $_REQUEST['Token'];
// echo $Token;
$procedure = $db->prepare('CALL rpx_sp_DeleteFileIfCancelAdd(?)');
$procedure->bind_param("s",$Token);
$procedure->execute();
$ResultOfProcedure = $procedure->get_result();
// $ResultOfProcedure = mysqli_fetch_object($ResultOfProcedure);
// $FileUploadNewName = new ArrayObject();
$RemoteFile = ftp_chdir($ftpConn, "/Dropbox/_contracte");
    while($row_obj = mysqli_fetch_object($ResultOfProcedure))
    {
        $FileUploadNewName = $row_obj->FileNameToDelete; 
        ftp_delete($ftpConn, $FileUploadNewName);
    }


?>
