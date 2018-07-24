<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);
    // $data_sent = (object)[
    //     "data" => (object) [
    //         "OrganizationName" => "ROMPRIX EXIM SRL",
    //         "ContractTypeID" => "1",
    //         "ClientName" => "DAVIO PAN GRUP IMPEX",
    //         "ContractName" => "test de asdfgh",
    //         "ContractNumberIn" => "acvadsdasdd sdsdas ddasNSDFJK",
    //         "ContractNumberOut" => "asdfdghjSdssD ddJK",
    //         "ContractShortDescription" => "descriere descriere descriere",
    //         "ContractStatusID" => 1,
    //         "ContractBeginDate" => "2018/10/20 00:00:00",
    //         "ContractExpireDate" => "2019/10/20 00:00:00"
    //     ],
    //     "action" => 'addContract',
    //     "userID" => 2
    // ];
    // echo "<pre>";
    // echo ($data_sent->ResponsableID);
    // echo "</pre>";
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
            $procedure = $connection->prepare('CALL rpx_sp_EditContract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $procedure->bind_param("isisssssissii",  $data_sent->data->ContractID               ,
                                                $data_sent->data->OrganizationName         , 
                                                $data_sent->data->ContractTypeID           , 
                                                $data_sent->data->ClientName               , 
                                                $data_sent->data->ContractName             ,
                                                $data_sent->data->ContractNumberIn         ,
                                                $data_sent->data->ContractNumberOut        ,
                                                $data_sent->data->ContractShortDescription ,
                                                $data_sent->data->ContractStatusID         ,
                                                $data_sent->data->ContractBeginDate        ,
                                                $data_sent->data->ContractExpireDate       ,
                                                $data_sent->userID                         , 
                                                $data_sent->data->ResponsableID
                                                ); 
            break;

        
        case 'addContract':
            echo "merge adaugarea";
            $procedure = $connection->prepare('CALL rpx_sp_AddContract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $procedure->bind_param("sisssssissii",$data_sent->data->OrganizationName         , 
                                                $data_sent->data->ContractTypeID           , 
                                                $data_sent->data->ClientName               , 
                                                $data_sent->data->ContractName             ,
                                                $data_sent->data->ContractNumberIn         ,
                                                $data_sent->data->ContractNumberOut        ,
                                                $data_sent->data->ContractShortDescription ,
                                                $data_sent->data->ContractStatusID         ,
                                                $data_sent->data->ContractBeginDate        ,
                                                $data_sent->data->ContractExpireDate       ,
                                                $data_sent->userID                         ,
                                                $data_sent->data->ResponsableID
                                                );
            break;
    }


    $procedure->execute();
    $procedure_result = $procedure->get_result();
    // print_r( $procedure_result = mysqli_fetch_object($procedure_result));
    echo '1';
    $connection->close();
?>