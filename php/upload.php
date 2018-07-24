<?php
session_start();
include("db_config.php");
include("ftp_config.php");
$uploads_dir = '/uploads';
$data_sent = json_decode($_POST['myData']);
print_r( $data_sent);
$number_of_files = count($data_sent);
for($i = 0; $i < $number_of_files; $i++)
{
    $original_file_name = $data_sent[$i]->name;
    $file_size = $data_sent[$i]->size;
    $file_path = $data_sent[$i]->path;
    $uploadedExtension = explode(".",$original_file_name);
    $original_file_extension = $uploadedExtension[1];
    $file_type = $data_sent[$i]->type;
    $file_upload_new_name = ($i+1).".cnt";
    $userID_upload = $data_sent[$i]->userID;
    $PHP_session_id =  session_id();
    $file_description = $data_sent[$i]->description;
    // $file_temporary_name = $data_sent[$i]->temporary; 
    $procedure = $db->prepare('CALL rpx_sp_AddFile(?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $procedure->bind_param("sissssiss",  
                                $original_file_name,
                                $file_size,
                                $file_path,
                                $original_file_extension,
                                $file_type,
                                $file_upload_new_name,
                                $userID_upload,
                                $PHP_session_id,
                                $file_description
                            ); 
    $procedure->execute();
    $success = ftp_put($ftpConn, "/Dropbox/_contracte", $original_file_name, FTP_ASCII);
}//end for



?>

   





