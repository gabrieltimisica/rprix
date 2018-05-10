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
    } else  // Are sesiune temporara buna sau cookie
    {
        if ($_SESSION['keep_logged'] == 1) // daca foloseste cookiuri, il updatam cu noul id
        {
            setcookie("c_id", session_id(), $_SESSION["cookie_exp_date"], '/', "", FALSE, TRUE);
        }
        else
        {
            setcookie("c_id", FALSE, -1, '/', "", FALSE, TRUE);
        }

    } // end else
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <link rel="stylesheet" href="../css/home.css">
    <!-- Este folosit in mare parte css-ul de la home, dar vreau sa dau overwrite la cateva deci pun unul separat dupa -->
    <link rel="stylesheet" href="../css/contracts-expansion.css">
    <!-- Datatables -->
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/17.2.7/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/17.2.7/css/dx.light.css" />
    <script type="text/javascript" src="https://cdn3.devexpress.com/jslib/17.2.7/js/dx.all.js"></script>

    <!-- Google charts gantt -->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="../js/scripts/google_charts_gantt_draw.js"></script>
    <!-- Ready function -->
    <script src="../js/scripts/contracts.js"></script>
    <title>Contracts</title>
</head>
<body>
    <div class="col container1">
        <div class="topnav">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-sm-block d-none pl-3 pr-3">
                    <p class="mb-0">LOGO ROMPRIX</p>
                </div>
                <!-- <div class="col-3 d-none d-lg-block text-center">
                    <p class="mb-0">Bine ai venit!</p>
                </div> -->
                <div class="display-user col col-sm-6 col-md-5 col-lg-3 d-flex justify-content-between justify-content-sm-end align-items-center">
                    <div class="d-inline-block col">
                        <img src="https://png.icons8.com/ios/50/000000/gender-neutral-user-filled.png">
                        <span>Gabriel Timisica
                            <?php 
                                // echo ($_SESSION['prenume'] + " " + $_SESSION['nume']);
                            ?> 
                        </span> 
                    </div> 

                    <!-- <img class="menu-icon d-none d-sm-inline-block align-items-center" src="https://png.icons8.com/ios-glyphs/50/000000/menu.png"> -->
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
        <h3 class="page-header text-center">Gestiunea contractelor</h3>
        <div class="test"><p>plm</p></div>
        <div class="dataGrid-custom-header col"></div>
        <div id='dataGrid'>
            
        </div>
        <div id='chart_div' class="col" style=''></div>
    </div> <!-- END container -->
</body>


<script>
    // Aici salvez in variabila useridfromsession id-ul utilizatorului ca sa nu dau ajax mai tarziu, ca sa il trimit cand dau delete prin ajax sa stim cine a facut modificarea
    var userID_fromSession = <?php echo $_SESSION['userID']; ?>;
</script>
</html>

