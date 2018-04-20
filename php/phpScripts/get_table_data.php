<?php
    include("../db_config.php");
    // $filter_options = json_decode($_POST['myData']);
    $filter_options = (object) 
    [
        'contractStatus' => (object)
        [
            'active' => 1,
            'expired' => 1,
            'extended' => 1,
            'deleted' => 1
        ],
        'fromDate' => '2016-10-06 00:00',
        'toDate' => '2016-10-06 00:00'
    ];

    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if ($conn->connect_error) 
    {
        die("Connection failed: " . $conn->connect_error);
    } 

    $procedure_return = $conn->prepare('CALL rpx_sp_filter_test(?, ?, ?, ?, ?, ?)');
    $procedure_return->bind_param("iiiiss", 
                                    $_filter_options->contractStatus->active,
                                    $_filter_options->contractStatus->expired,
                                    $_filter_options->contractStatus->extended,
                                    $_filter_options->contractStatus->deleted,
                                    $_filter_options->fromDate,
                                    $_filter_options->toDate
                                    );
    $procedure_return->execute();
    $procedure_return = $procedure_return->get_result();

    $data_obj = new ArrayObject();
    while($row_obj = mysqli_fetch_object($procedure_return))
    {
        $data_obj->append($row_obj);
    }
    // echo '<pre>'; print_r($data_obj); echo '</pre>';

    echo json_encode($data_obj);
?>