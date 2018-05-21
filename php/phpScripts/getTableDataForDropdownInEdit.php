<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);

    // echo "<pre>";
    // print_r($data_sent);
    // echo "</pre>";
    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 

    $procedure = $connection->prepare('CALL rpx_sp_DeleteContract(?, ?)');
    $procedure->bind_param("ii",$data_sent->contractID, $data_sent->userID);
    break;

    $procedure->execute();
    $procedure_result = $procedure->get_result();
    // print_r( $procedure_result = mysqli_fetch_object($procedure_result));
    echo '1';
    $connection->close();
?>


