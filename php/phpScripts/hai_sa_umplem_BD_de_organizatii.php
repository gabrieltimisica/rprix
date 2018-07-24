<?php
    // folosim scriptul asta ca sa umple baza de date de organizatii sau contracte pentru testare
    include('../db_config.php');
    ini_set('max_execution_time', 3000);
    $connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    
    for ($i = 5; $i < 40000; $i++) {
        $org = 'contractnr-' . $i;
            $status = 'Canceled';
        $procedure = $connection->prepare('CALL sp_addcontracts(?)');
        $procedure->bind_param("s", $org); 
        $procedure->execute();
        echo $org;
        echo "<br>";

    }
    $connection->close();
?>


