<?php 
    error_reporting(0); // dezactivez erorile de la echo
    ini_set('session.use_strict_mode', 1);
    session_start();
    session_regenerate_id();
    
    if (!isset($_SESSION['email'])) // a intrat pe pagina fara cookie / nu a intrat nici pe login sa isi faca sesiune
    {
        $_SESSION["cookie_exp_date"] = time() + 14 * 24 * 3600; // aici e initiata pentru prima oara
    } else // Are deja sessionu deschis / a folosit cookie
    {
        $server_adr = "192.168.12.114:3306";
        $db_username = "gabi";
        $db_pw = "130819";
        $db_name = "Licenta";
        $email = $_SESSION['email'];
        $connection = new mysqli($server_adr, $db_username, $db_pw, $db_name);
        $sql = "SELECT email FROM Utilizatori WHERE email = '".$email."';";
        $result = $connection->query($sql); // raspunsul la executia din query in DB
        $result = mysqli_fetch_object($result);
        if ($result->email) // exista in DB
        {
            if(isset($_COOKIE['c_id'])) // daca a folosit cookie, il updatam cu acelasi expire si un id diferit
                setcookie("c_id", session_id(), $_SESSION["cookie_exp_date"], '/', "localhost", FALSE, TRUE);
            else
            {
                setcookie("c_id", FALSE, -1, '/', "localhost", FALSE, TRUE);
                // am pus astea mai jos in cazul in care gresesc informatia
                session_unset();
                session_destroy();
            }
            unset($_SESSION['error']); // daca am ajuns aici nu avem erori, si trebuie sa il stergem, in caz ca am avut la loginu precedent
            header('Location: php/home.php');
        }
    } // end else
?>


<?php 
    $server_adr = "192.168.12.114:3306";
    $db_username = "gabi";
    $db_pw = "130819";
    $db_name = "Licenta";

    $email = $pw = "";
    // $NO_ERROR = 0;  avem eroare
    // $NO_ERROR = 1;  nu avem eroare

    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        $email =  input_test($_POST["email"]);
        $pw = input_test($_POST["password"]);

        if(!empty($email))
        {
            // salvam ca sa il afisam in value in input data viitoare
            // trebuie sa il retinem fie ca e gresit, fie ca nu, cu exceptia cand e gol
            $_SESSION['email_value_attribute'] = $email; 
        }

        if (empty($email) || empty($pw)) // Nu a introdus emailul sau parola
        {
            $_SESSION["error"] = "Introduceti atat emailul, cat si parola !"; 
        } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)  || !preg_match("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}^", $pw)) 
        {
            $_SESSION["error"] = "Email sau parola invalida !";
        } else 
        {
            $connection = new mysqli($server_adr, $db_username, $db_pw, $db_name);
            if ($connection->connect_error) 
            {
                $_SESSION["error"] = "Conexiune esuata cu serverul !";
                die("Conexiune esuata: " . $connection->connect_error);
            } 
            
            // $hashed_pw = password_hash($pw, PASSWORD_DEFAULT); // hashuim parola inainte sa o verificam
            $procedure_return = $connection->prepare('CALL verificare_login(?)');
            $procedure_return->bind_param("s", $email);
            $procedure_return->execute();
            $procedure_return = $procedure_return->get_result();
            $procedure_return = mysqli_fetch_object($procedure_return);
            if($procedure_return->email && password_verify($pw , $procedure_return->parola)) // exista contul cu email si parola corecta
            {
                $_SESSION['email'] = $procedure_return->email;
                // SCHIMBA PROCEDURA SA RETURNEZE MAI MULTE CHESTII
                $_SESSION['nume'] = $procedure_return->nume;
                $_SESSION['prenume'] = $procedure_return->nume;
                $_SESSION['privilegiu'] = $procedure_return->privilegiu;
                unset($_SESSION['email_value_attribute']);
                echo "<script> window.location.replace('php/home.php'); </script>"; // e in loc de header pentru ca headerul il poti pune doar in.... header sus :))
            } else // daca e gresit
            {
                $_SESSION["error"] = "Email sau parola gresita !";
            }
            $connection->close();
        }
    }

    /**
     * If PHP_SELF is used in your page then a user can enter a slash (/) 
     * and then some Cross Site Scripting (XSS) commands to execute.
     * Most data that comes from a $_POST[""] is a string. 
     * Malicious JavaScript code can be added inside the <script> tag!
     * trim($input_data);                Strips unnecessary characters (extra space, tab, newline) from the user input data
     * stripslashes($input_data);        Remove backslashes (\) from the user input data
     * htmlspecialchars($input_data);    If a user tries to submit the following in a text field:
     *                                   <script>location.href('http://www.hacked.com')</script>
     *                                   This would not be executed, because it would be saved as HTML escaped code, like this:
     *                                   &lt;script&gt;location.href('http://www.hacked.com')&lt;/script&gt;
     * @param  $input_data  Data that comes from the $_POST[""] after a submit
     * @return $input_data  Returns the data 
     * @link    https://www.w3schools.com/php/php_form_validation.asp
     */
    function input_test($input_data)
    { 
        $input_data = trim($input_data);
        $input_data = stripslashes($input_data);
        $input_data = htmlspecialchars($input_data);
        return $input_data;
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="css/login.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <title>Login</title>
    <!-- Scriptul in care se afla ready function-ul de jquery. E pus aici ca sa vada php-ul definit -->
    <script src="js/scripts/login_jq_readyfunc.js"></script>    
</head>
<body>
    </div> <!-- End div container alert-box -->
    <div class="container">
        <h2 class="mb-5 text-center">Bun venit </h2>
        <!-- Aici sunt afisate erorile. Initial este d-none, functia de jquery o sa schimbe asta daca exista erori -->
        <div class="error-alert-box col mb-2"> 
            <p class="mb-0"></p>
        </div> 
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
            <div>
                <input id="email"  class="input-em mb-3 col" type="text" oninvalid="setCustomValidity('camp obligatori')" value="<?php echo $_SESSION['succes_register_alert']; echo $_SESSION['email_value_attribute'];?>" name="email" title="Va rugam introduceti emailul !" autofocus required  spellcheck="false" autocomplete="off">
                <label for="email">Email</label>
            </div>
            <div>
                <input id="input_parola" class="input-pw mb-2 col" type="password" name="password" title="Va rugam introduceti parola !" required  spellcheck="false" autocomplete="off">
                <label for="input_parola">Parola</label>
            </div>
            <div class="d-flex flex-row justify-content-between mb-4">
                <div class="checkbox">
                    <label><input class="keep_logged mr-2" type="checkbox" style="cursor:pointer;"  name="remember">Pastreaza-ma logat
                    </label>
                </div>
                <div class="">
                    <a href="php/inregistrare.php">Creeaza cont</a>
                </div>
                <!-- <a class"justify-content-between" href="">Am uitat parola</a> -->
            </div> 
            <button class="col" type="submit" class="d-block mx-auto">Logare</button>
        </form>
    </div> <!-- END OF div container -->
</body>





<?php 
    // Afisam erorile daca exista dintr-o verificare trecuta
    // Daca nu e setata eroarea, folosim 0 ca parametru in loc de 1, iar jquery ul o sa dea clasa d-block sau d-none in functie de el.
    // Functia se afla in scriptul js/scripts/login_jq_readyfunc.js 
    if(isset($_SESSION['error']))
    {
        echo "<script> show_input_error('".$_SESSION['error']."', 1); 
            $(function(){  // daca gresim emailul sau parola, facem focus la parola
                $('#input_parola').focus(); 
            }); 
            </script>"; // apelam functia ca sa arate eroarea
    } else
    {
        echo "<script> show_input_error('NULL', 0);</script>"; // nu avem eroare, deci ascundem divul
    }
    unset($_SESSION['error']);

    // Verificam daca s-a efectuat o create de cont cu succes, ca sa apara acel div 
    if(isset($_SESSION['succes_register_alert']))
    {
        $html = "<div class=\'col mb-2\' style=\'border:1px solid green;background-color:#ade2aa;\'><p class=\'mb-0\'>Inregistrare efectuata cu succes !</p></div>";
        echo "<script> $('form').before('$html'); 
        $('#input_parola').focus();
            </script>";

        unset($_SESSION['succes_register_alert']);
    }
?>
</html>

