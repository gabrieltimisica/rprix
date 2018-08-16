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

    $FileToken = $_POST['fileToken'];
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
    $procedure = $db->prepare('CALL rpx_sp_AddFile(?, ?, ?, ?, ?, ?, ?, 1, ?)');
    $procedure->bind_param("sisssiss",  
                                $OriginalFileName,
                                $FileSize,
                                $FilePath,
                                $OriginalFileExtension,
                                $FileType,
                                $UserIDUpload,
                                $FileDescription,
                                $FileToken
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



?>

   





