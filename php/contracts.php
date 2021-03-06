<?php 
    error_reporting(0); // dezactivez erorile de la echo
    ini_set('session.use_strict_mode', 1); // Folosim session strict mode pentru securitate
    session_start();
    session_regenerate_id();

    if (!isset($_SESSION['username'])) // nu avem nici cookie / nu avem nici macar sesiune
    {
        // nu stiu daca trebuie sa dau astea 
        session_unset(); 
        setcookie("PHPSESSID", FALSE, -1, '/', "", FALSE, TRUE);
        setcookie("c_id", FALSE, -1, '/', "", FALSE, TRUE);
        session_destroy();
        header('Location: ../index.php'); // daca nu are ce trebuie, il trimitem la login
    } else {

    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    
    <link rel="stylesheet" href="../css/home.css">
    <!-- Este folosit in mare parte css-ul de la home, dar vreau sa dau overwrite la cateva deci pun unul separat dupa -->
    <link rel="stylesheet" href="../css/contracts-expansion.css">
    <!-- Devextreme --> 
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.1.3/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.1.3/css/dx.light.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js"></script>
    <script type="text/javascript" src="https://cdn3.devexpress.com/jslib/18.1.3/js/dx.all.js"></script>
    <!-- Ready function -->
    <script src="../js/scripts/contracts.js"></script>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
    <!-- Notify.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js"></script>
    <!-- Alertify -->
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/alertify.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/default.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/semantic.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/bootstrap.min.css"/>
    <title>Contracts</title>
</head>
<body>

        <!-- <iframe src="http://192.168.13.17/Dropbox/_contracte/110.doc&embedded=true" width='1290' height='500'></a> -->

    <div class="col container1">
        <div class="topnav">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-sm-block d-none pl-3 pr-3">
                    <span class="mb-0" style='font-size: 35px'>ROMPRIX</span>
                    <span class="" style="top: 3px; left: 165px; position: absolute">&#169;</span>
                </div>
                <div class="display-user col col-sm-6 col-md-5 col-lg-3 d-flex justify-content-between justify-content-sm-end align-items-center">
                    <div class="d-inline-block">
                        <img src="https://png.icons8.com/ios/50/000000/gender-neutral-user-filled.png">
                        <?php echo $_SESSION['prenume'] . " " . $_SESSION['nume']; ?> 
                    </div> 
                    <div class="dropdown-block d-sm-inline-block align-items-center">
                        <img class="menu-icon" style="" src="https://png.icons8.com/ios-glyphs/50/000000/menu.png">
                        <ul class="dropdown-menu1 not-visible">
                            <li>Settings</li>
                            <li class="loggout-btt">Logout</li>
                        </ul>    
                    </div>
                </div> <!-- end div display-user -->
            </div> <!-- end div d-flex -->
        </div> <!-- end div topnav -->

        <!-- Content - - - - - - - - - - - - - - - - - -->
        <h2 class="page-header text-center"><b>CONTRACT MANAGEMENT</b></h2>
        <h5 class="mb-3">
            <a href="home.php" style="color: #aa4b4d; margin-left: 10px">Projects / </a>
            <a href="" style="">Contract Management</a>
        </h5>
        <!-- Headerul de deasupra tabelului pentru custom buttons -->
        <div class="dataGrid-custom-header col">
            <div style='height: 5px'></div>
            <!-- Quick filters -->
            <!-- Active -->
            <input id="filter-by-status-active" class="filter-checkbox" type="checkbox">
            <label class="checkbox-label-filter checkbox-active" for="filter-by-status-active"> Active </label>
            <span style="margin-left: 10px"></span>
            <!-- Closed -->
            <input id="filter-by-status-closed" class="filter-checkbox" type="checkbox">
            <label class="checkbox-label-filter checkbox-closed" for="filter-by-status-closed"> Closed </label>
            <span style="margin-left: 10px"></span>
            <!-- Canceled -->
            <input id="filter-by-status-canceled" class="filter-checkbox" type="checkbox">
            <label class="checkbox-label-filter checkbox-canceled" for="filter-by-status-canceled"> Canceled </label>
            <span style="margin-left: 10px"></span>
            <!-- Preliminary -->
            <input id="filter-by-status-preliminary" class="filter-checkbox" type="checkbox">
            <label class="checkbox-label-filter checkbox-preliminary" for="filter-by-status-preliminary"> Preliminary </label>
            <span style="margin-left: 10px"></span>
            <!-- Deleted -->
            <input id="filter-by-status-deleted" class="filter-checkbox" type="checkbox">
            <label class="checkbox-label-filter checkbox-deleted" for="filter-by-status-deleted"> Deleted </label>
            <span style="margin-left: 10px"></span>
            <!-- Others -->
            <button id="clear-datagrid-filters" type="button">Clear filters</button>
            <span style="margin-left: 10px"></span>
            <button id="reset-workspace" type="button" >Reset workspace</button>
        </div> <!--  end custom header  -->
        <div id='dataGrid'></div>
    </div> <!-- END container -->
</body>


<script>
    // Aici salvez in variabila useridfromsession id-ul utilizatorului ca sa nu dau ajax mai tarziu, ca sa il trimit cand dau delete prin ajax sa stim cine a facut modificarea
    var userID_fromSession = "<?php echo $_SESSION['userID']; ?>";
</script>
</html>

