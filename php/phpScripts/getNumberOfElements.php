<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);

    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 

    $getNumberOfElements = $connection->prepare('CALL rpx_sp_NumberOfElementsSearchedByValue(?, ?, ?)');
    $getNumberOfElements->bind_param("iss", $data_sent->filter,
                                            $data_sent->columnName,
                                            $data_sent->value
                                            ); 
    $getNumberOfElements->execute();
    $numberOfElements = $getNumberOfElements->get_result();
    $numberOfElements = mysqli_fetch_object($numberOfElements);

    echo json_encode($numberOfElements);
    $connection->close();
?>


