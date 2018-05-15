<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);

    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 
    
    switch ($data_sent->action)
    {
        case 'deleteContract':
            $procedure = $connection->prepare('CALL rpx_sp_DeleteContract(?, ?)');
            $procedure->bind_param("ii",$data_sent->contractID, $data_sent->userID); // userID este cine a modificat contractul
        case 'editContract':
            $procedure = $connection->prepare('CALL rpx_sp_DeleteContract(?, ?)');
            $procedure->bind_param("ii",$data_sent->contractID, $data_sent->userID); // userID este cine a modificat contractul

    }


    $procedure->execute();
    $procedure_result = $procedure->get_result();

    // echo $data_sent->contractID;
    // echo $data_sent->userID_whoDeletedTheContract;
    echo 1;
    $connection->close();
?>