<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);
    // $data_sent = (object) [
    //     "contractID"=> 7,
    //     "userID_whoDeletedTheContract" => 1
    // ];

    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 
    
    $procedure_return = $connection->prepare('CALL rpx_sp_DeleteContract(?, ?)');
    $procedure_return->bind_param("ii",$data_sent->contractID, $data_sent->userID_whoDeletedTheContract);
    $procedure_return->execute();
    $procedure_return = $procedure_return->get_result();

    echo $data_sent->contractID;
    echo $data_sent->userID_whoDeletedTheContract;
    $connection->close();
?>