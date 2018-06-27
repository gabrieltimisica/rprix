<?php
    // Cu scriptul asta preluam privilegiile din baza de date 
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);

    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 
    // echo $data_sent->userID;
    $procedure = $connection->prepare('CALL rpx_sp_GetPrivilegesForUser(?)');
    $procedure->bind_param("i",$data_sent->userID);
    $procedure->execute();
    $procedure_result = $procedure->get_result();

    $data_obj = new ArrayObject();
    while($row_obj = mysqli_fetch_object($procedure_result))
    {
        $data_obj->append($row_obj);
    }

    // var_dump($data_obj);
    echo json_encode($data_obj);
    $connection->close();
?>
