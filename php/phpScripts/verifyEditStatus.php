<?php
    // Aici preiau toate contractele bazandu-ma pe id-ul utilizatorului din cookie
    include("../db_config.php");
    // error_reporting(0);

    $data_sent = json_decode($_POST['myData']);

    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($conn->connect_error) 
    {
        die("Connection failed: " . $conn->connect_error);
    } 
    // print_r($data_sent);
    $procedure_return = $conn->prepare('CALL rpx_sp_VerifyEditStatus(?, ?, ?)');
    $procedure_return->bind_param(
        "iii",
        $data_sent->actionID,
        $data_sent->contractID,
        $data_sent->userID);
    $procedure_return->execute();
    $procedure_return = $procedure_return->get_result();
        
    $data_obj = new ArrayObject();
    while($row_obj = mysqli_fetch_assoc($procedure_return))
    {
        $data_obj->append($row_obj);
    }
    // echo '<pre>'; print_r($data_obj); echo '</pre>';

    echo json_encode($data_obj);
    $conn->close();
?>