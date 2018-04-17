<?php 
    // error_reporting(0); // dezactivez erorile de la echo
    // ini_set('session.use_strict_mode', 1); // Folosim session strict mode pentru securitate
    // session_start();
    // session_regenerate_id();

    // if (!isset($_SESSION['email'])) // nu avem nici cookie / nu avem nici macar sesiune
    // {
    //     // nu stiu daca trebuie sa dau astea 
    //     session_unset(); 
    //     setcookie("PHPSESSID", FALSE, -1, '/', "localhost", FALSE, TRUE);
    //     setcookie("c_id", FALSE, -1, '/', "localhost", FALSE, TRUE);
    //     session_destroy();
    //     header('Location: ../index.php'); // daca nu are ce trebuie, il trimitem la login
    // } else  // Are sesiune temporara buna sau cookie
    // {
    //     if ($_SESSION['keep_logged'] == 1) // daca foloseste cookiuri, il updatam cu noul id
    //     {
    //         setcookie("c_id", session_id(), $_SESSION["cookie_exp_date"], '/', "localhost", FALSE, TRUE);
    //     }
    //     else
    //     {
    //         setcookie("c_id", FALSE, -1, '/', "localhost", FALSE, TRUE);
    //     }

    // } // end else
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <link rel="stylesheet" href="../css/home.css">
    <title>Welcome</title>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript" src="../js/scripts/create_new_chart.js"></script>
</head>
<body>
    <div class="container">
        <div class="topnav">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-sm-block d-none pl-3 pr-3">
                    <p class="mb-0">Licenta 2018</p>
                    <p class="mb-0">Timisica Gabriel</p>
                </div>
                <!-- <div class="col-3 d-none d-lg-block text-center">
                    <p class="mb-0">Bine ai venit!</p>
                </div> -->
                <div class="display-user col-4 col-sm-3 justify-content-between">
                    <div class="d-inline-block">
                        <img src="https://png.icons8.com/ios/50/000000/gender-neutral-user-filled.png">
                        <span> 
                            Gabriel Timisica
                            <?php 
                                // echo ($_SESSION['prenume'] + " " + $_SESSION['nume']);
                            ?> 
                        </span> 
                    </div>
                    <img class="d-none d-sm-inline-block" src="https://png.icons8.com/ios-glyphs/50/000000/menu.png">
                </div> <!-- end div display-user -->
                <div class="col-1 d-block d-sm-none">
                    <a href="">
                        <img style="" src="https://png.icons8.com/ios-glyphs/50/000000/menu.png">    
                    </a>
                </div>
            </div> <!-- end div d-flex -->
        </div> <!-- end div topnav -->
        <div class="row d-sm-flex justify-content-sm-around">
            <div class="temp-value-box container-afisare col-sm-3 mb-3 ml-0 ml-sm-2">
                <!-- <img class="icon-sensor-settings" src="https://png.icons8.com/material/50/000000/settings.png"> -->
                <p class="title-value">Temperatura</p>
                <div class="col" style="border-top: 1px solid black"></div>
                <p class="show-value"> <span>&#8451;</span></p>
                <p>Verificare in <span class="temp-sec-left">2s</span></p> 
            </div>

            <div class="humid-value-box container-afisare col-sm-3 mb-3">
                <p class="title-value">Umiditate</p>
                <div class="col" style="border-top: 1px solid black"></div>
                <p class="show-value"> <span>%</span></p>
                <p>Verificare in <span class="humid-sec-left">2s</span></p>       
            </div>
            
            <div class="lum-value-box container-afisare col-sm-3 mb-3 mr-0 mr-sm-2">
                <p class="title-value">Luminozitate</p>
                <div class="col" style="border-top: 1px solid black"></div>
                <p class="show-value"> <span>%</span></p>
                <p>Verificare in <span class="lum-sec-left">2s</span></p> 
            </div>
        </div> <!--  end div row -->

    <!-- Grafice - - - - - - - - - - - - - - - - - - - - - -->
        <!-- Folosesc div-ul ca punct de reper ca sa adaug un grafic la inceput/sfarsit -->
        <div class="all-charts-after-this-div"></div> 
        <div class="all-charts-before-this-div"></div> 
    </div>  <!--  end div container -->

    <button class="loggout-btt" type="button">logout</button>
    <button class="python-exec-btt" type="button" onclick="callphp_script_exec(1,3)">php exec</button>
    <button class="" type="button" onclick="create_new_chart()">add chart</button>
</body>

<script src="../js/scripts/welcome-page.js"></script>

</html>

