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
    <link rel="stylesheet" href="../css/metadata.css">
    <!-- Devextreme --> 
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.1.3/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.1.3/css/dx.light.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js"></script>
    <script type="text/javascript" src="https://cdn3.devexpress.com/jslib/18.1.3/js/dx.all.js"></script>

    <!-- Ready function -->
    <script src="../js/scripts/metadata.js"></script>
    <title>Contracts</title>
</head>
<body>
    <div class="col container">
        <div class="topnav">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-sm-block d-none pl-3 pr-3">
                    <p class="mb-0">LOGO ROMPRIX</p>
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
        <h3 class="page-header text-center">Gestiunea contractelor</h3>
        <h5 class="mb-3">
            <a href="home.php" style="color: #aa4b4d">Projects / </a>
            <a href="" style="">Metadata</a>
        </h5>
        <!-- Headerul de deasupra tabelului pentru custom buttons -->
        <div class="display-container">
            <div class="form-group">
                <input type="checkbox"> Agree
            </div>
        </div>
    </div> <!-- END container -->
</body>
</html>

