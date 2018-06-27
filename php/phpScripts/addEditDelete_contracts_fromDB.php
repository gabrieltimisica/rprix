<?php
    include('../db_config.php');
    $data_sent = json_decode($_POST['myData']);
    // $data_sent = (object)[
    //     "data" => (object) [
    //         "ContractID" => 48,
    //         "OrganisationName" => "ROMPRIX EXIM SRL",
    //         "ContractType" => "Vanzare",
    //         "ClientName" => "DAVIO PAN GRUP IMPEX",
    //         "ContractName" => "test de asdfgh",
    //         "ContractNumberIn" => "acvadsdasdd sdsdas ddasNSDFJK",
    //         "ContractNumberOut" => "asdfdghjSdssD ddJK",
    //         "ContractShortDescription" => "descriere descriere descriere",
    //         "StatusName" => 1,
    //         "ContractBeginDate" => "2018/10/20 00:00:00",
    //         "ContractExpireDate" => "2019/10/20 00:00:00"
    //     ],
    //     "action" => 'editContract',
    //     "userID" => 2
    // ];
    // echo "<pre>";
    print_r($data_sent);
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
            $procedure = $connection->prepare('CALL rpx_sp_EditContract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $procedure->bind_param("isssssssissi",  $data_sent->data->ContractID               ,
                                                    $data_sent->data->OrganizationName         , 
                                                    $data_sent->data->ContractType             , 
                                                    $data_sent->data->ClientName               , 
                                                    $data_sent->data->ContractName             ,
                                                    $data_sent->data->ContractNumberIn         ,
                                                    $data_sent->data->ContractNumberOut        ,
                                                    $data_sent->data->ContractShortDescription ,
                                                    $data_sent->data->ContractStatusID         ,
                                                    $data_sent->data->ContractBeginDate        ,
                                                    $data_sent->data->ContractExpireDate       ,
                                                    $data_sent->userID   
               ); 
            break;
        case 'addContract':
            // echo "merge adaugarea";
            $procedure = $connection->prepare('CALL rpx_sp_AddContract(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $procedure->bind_param("sssssssissi",$data_sent->data->OrganizationName         , 
                                                 $data_sent->data->ContractType             , 
                                                 $data_sent->data->ClientName               , 
                                                 $data_sent->data->ContractName             ,
                                                 $data_sent->data->ContractNumberIn         ,
                                                 $data_sent->data->ContractNumberOut        ,
                                                 $data_sent->data->ContractShortDescription ,
                                                 $data_sent->data->ContractStatusID         ,
                                                 $data_sent->data->ContractBeginDate        ,
                                                 $data_sent->data->ContractExpireDate       ,
                                                 $data_sent->userID  
                                                ); 
            break;
    }


    $procedure->execute();
    $procedure_result = $procedure->get_result();
    // print_r( $procedure_result = mysqli_fetch_object($procedure_result));
    echo '1';
    $connection->close();
?>





<!-- var json_toSend = {
                "data": {
                    "ContractID": e.oldData.ContractID,
                    "OrganisationName":e.oldData.OrganisationName, 
                    "ContractType": e.oldData.ContractType, 
                    "ClientName": e.oldData.ClientName , 
                    "ContractName": e.oldData.ContractName ,
                    "ContractNumberIn": e.oldData.ContractNumberIn ,
                    "ContractNumberOut": e.oldData.ContractNumberOut ,
                    "ContractShortDescription": e.oldData.ContractShortDescription ,
                    "ContractStatusID": e.oldData.ContractStatusID ,
                    "ContractBeginDate": e.oldData.ContractBeginDate ,
                    "ContractExpireDate": e.oldData.ContractExpireDate
                }, // oldData este un obiect care contine toti parametrii din baza de date, cu update-ul facut
                "userID": userID_fromSession,
                "action": "editContract"
            }; -->