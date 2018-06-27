<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);

    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 

    $procedure = $connection->prepare('CALL rpx_sp_SearchByValue(?, ?, ?)');
    $procedure->bind_param("iss", $data_sent->filter,
                                $data_sent->columnName,
                                $data_sent->value
                                ); 
    $procedure->execute();
    $elementsFound = $procedure->get_result();

    // echo "<pre>";
    // print_r($elementsFound);
    // echo "</pre>";

    $data_obj = new ArrayObject();
    while($row_obj = mysqli_fetch_object($elementsFound)) {
        $data_obj->append($row_obj);
    }
    // echo "<pre>";
    // print_r($data_obj);
    // echo "</pre>";
    echo json_encode($data_obj);
    $connection->close();
?>


