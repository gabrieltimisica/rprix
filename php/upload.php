<?php
session_start();
include("db_config.php");
include("ftp_config.php");


for($i = 0; $i < count($_FILES); $i++) {
    $file = $_FILES['file'.$i];

    $TemporaryName = $file['tmp_name'];

    $OriginalFileName = $file['name'];

    $FileSize = $file['size'];

    $FilePath = 'a';

    $FileNameComponents = explode(".", $file['name']);
    $OriginalFileExtension = $FileNameComponents[count($FileNameComponents) - 1];

    $FileType = $file['type'];

    $UserIDUpload = $_POST['UserIDUpload'];

    $FileDescription = $_POST['fileDescription']; 

    //$procedure = $db->prepare('CALL rpx_sp_NumberOfFiles');
    // $procedure->bind_param();
    //$procedure->execute();

    //$NumberOfElements = $procedure->get_result();
    //$NumberOfElements = mysqli_fetch_object($NumberOfElements);
    
    //$FileUploadNewName = $NumberOfElements->NumberOfFile;
    // echo $FileUploadNewName;
    //$FileUploadNewName = $FileUploadNewName.".".$OriginalFileExtension;
    //unset($procedure);
    unset($procedure);
    $procedure = $db->prepare('CALL rpx_sp_AddFile(?, ?, ?, ?, ?, ?, ?)');
    $procedure->bind_param("sisssis",  
                                $OriginalFileName,
                                $FileSize,
                                $FilePath,
                                $OriginalFileExtension,
                                $FileType,
                                $UserIDUpload,
                                $FileDescription
                            ); 
    $procedure->execute();
    $ResultOfProcedure = $procedure->get_result();
    $ResultOfProcedure = mysqli_fetch_object($ResultOfProcedure);
    $FileUploadNewName = $ResultOfProcedure->FileNewNameFromDatabase;                        
    unset($procedure);

    $RemoteFile = ftp_chdir($ftpConn, "/Dropbox/_contracte");
    // $result = ftp_put($ftpConn, $FileUploadNewName, $TemporaryName, FTP_BINARY);
    // $result = move_uploaded_file($AnotherName, $destination.$file_upload_new_name);
    // if ($result) {
    //     echo 'succes';
    // } else {
    //     echo 'nu merge';
    // }

    if(ftp_put($ftpConn, $FileUploadNewName, $TemporaryName, FTP_BINARY))
        $WasUploaded = (object)[
            "WasUploaded"=>1
        ];
    else    
        $WasUploaded = (object)[
            "WasUploaded"=>0
        ];
    

}

if(count($_FILES) == 0)
    $WasUploaded = (object)[
        "WasUploaded"=>2
    ];
$jsonen= json_encode($WasUploaded);
echo $jsonen;
ftp_close($ftpConn);
$db->close();


// $files = $_FILES['file'];
// print_r($files)
// $NumberOfFiles = count($files);
// for($i = 0; $i < $number_of_files; $i++)
// {
//     $original_file_name = $files["file".i]['name'];
//     echo $original_file_name;
// }
// $files["file".i]
// $data_sent = json_decode($_POST);

// print_r( $data_sent);
// $number_of_files = count($data_sent);
// for($i = 0; $i < $number_of_files; $i++)
// {
//     $original_file_name = $data_sent[$i]->name;
//     $file_size = $data_sent[$i]->size;
//     $file_path = $data_sent[$i]->path;
//     $uploadedExtension = explode(".",$original_file_name);
//     $original_file_extension = $uploadedExtension[1];
//     $file_type = $data_sent[$i]->type;
//     $file_upload_new_name = ($i+1).".cnt";
//     $userID_upload = $data_sent[$i]->userID;
//     $PHP_session_id =  session_id();
//     $file_description = $data_sent[$i]->description;
//     // $file_temporary_name = $data_sent[$i]->temporary; 
//     $procedure = $db->prepare('CALL rpx_sp_AddFile(?, ?, ?, ?, ?, ?, ?, ?, ?)');
//     $procedure->bind_param("sissssiss",  
//                                 $original_file_name,
//                                 $file_size,
//                                 $file_path,
//                                 $original_file_extension,
//                                 $file_type,
//                                 $file_upload_new_name,
//                                 $userID_upload,
//                                 $PHP_session_id,
//                                 $file_description
//                             ); 
//     $procedure->execute();
    // $success = ftp_put($ftpConn, "/Dropbox/_contracte", $file_path, FTP_ASCII);
// }//end for



?>

   





