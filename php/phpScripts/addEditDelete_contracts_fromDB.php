<?php
    include('../db_config.php');
    // $data_sent = json_decode($_POST['myData']);
    $data_sent = (object)[
        "data" => (object) [
            "OrganisationName" => "ROMPRIX EXIM SRL",
            "ContractType" => "Vanzare",
            "ClientName" => "DAVIO PAN GRUP IMPEX",
            "ContractName" => "AICIVCICICICIICUIC",
            "ContractNumberIn" => "acvbnmSDVJNSDFJK",
            "ContractNumberOut" => "asdfghjklASDFBASDJK",
            "ContractShortDescription" => "descriere descriere descriere",
            "Status" => "Canceled",
            "ContractBeginDate" => "2018/10/20 00:00:00",
            "ContractExpireDate" => "2019/10/20 00:00:00"
        ],
        "action" => 'addContract',
        "userID" => 1
    ];
    echo "<pre>";
    print_r($data_sent);
    echo "</pre>";
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
            $procedure->bind_param("ii",$data_sent->contractID, $data_sent->userID);
            break;
        case 'editContract':
            $procedure = $connection->prepare('CALL rpx_sp_DeleteContract(?, ?)');
            $procedure->bind_param("ii",$data_sent->contractID, $data_sent->userID);
            break;
        case 'addContract':
            echo "merge adaugarea";
            echo $data_sent->data->OrganisationName;
            $procedure = $connection->prepare('CALL rpx_sp_AddContract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $procedure->bind_param("ssssssssssi",$data_sent->data->OrganisationName         , 
                                                 $data_sent->data->ContractType             , 
                                                 $data_sent->data->ClientName               , 
                                                 $data_sent->data->ContractName             ,
                                                 $data_sent->data->ContractNumberIn         ,
                                                 $data_sent->data->ContractNumberOut        ,
                                                 $data_sent->data->ContractShortDescription ,
                                                 $data_sent->data->Status                   ,
                                                 $data_sent->data->ContractBeginDate        ,
                                                 $data_sent->data->ContractExpireDate       ,
                                                 $data_sent->userID  
                                                ); 
            break;
    }


    $procedure->execute();
    $procedure_result = $procedure->get_result();
    print_r( $procedure_result = mysqli_fetch_object($procedure_result));

    // echo $data_sent->contractID;
    // echo $data_sent->userID_whoDeletedTheContract;
    echo '1';
    $connection->close();
?>


