<?php
    // Folosit ca sa preiau, cand se incarca pagina, informatiile care apar in lookup-urile din edit/add popup
    // ex: dropdownul de status, contract type, responsable 
    include('../db_config.php');

    // echo "<pre>";
    // print_r($data_sent);
    // echo "</pre>";
    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($connection->connect_error) 
    {
        echo "Conexiune esuata cu serverul!";
        die("Conexiune esuata: " . $connection->connect_error);
    } 

    $procedure = $connection->prepare('CALL rpx_sp_GetDataForDropdown()');
    $procedure->execute();
    $procedure_result = $procedure->get_result();
    $data_obj = new ArrayObject();

    while($row_obj = mysqli_fetch_object($procedure_result))
    {
        $data_obj->append($row_obj);
    }

    echo json_encode($data_obj);
    $connection->close();
?>


