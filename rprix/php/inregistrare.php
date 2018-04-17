<?php 
    error_reporting(0); // dezactivez erorile de la echo
    ini_set('session.use_strict_mode', 1);
    session_start();
    session_regenerate_id();

    unset($_SESSION['email_value_attribute']); // le stergem la inceput, in caz ca intram pe alt register fara sa fie primul inchis
    unset($_SESSION['nume_value_attribute']);
    unset($_SESSION['prenume_value_attribute']);

    if (isset($_SESSION['email'])) // daca e setat mailul si facem redirectare
    {
        $server_adr = "192.168.12.114:8799";
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
            unset($_SESSION['error']); // daca am ajuns aici nu avem erori, si trebuie sa il stergem, in caz ca am avut la loginu precedent
            header('Location: welcome.php');
        }
    } // end else
?>


<?php 
    // $user_input este un obiect care contine toate datele pe care le-a introdus la inregistrare
    // $_SESSION['error'] este un obiect care contine error_text si indici care spun ce campuri trebuie inrosite
    $user_input = new \stdClass();
    $user_input->email = $user_input->pw = $user_input->prenume = $user_input->nume = $user_input->confirm_pw = '';

    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        $server_adr = "192.168.12.114:8799";
        $db_username = "gabi";
        $db_pw = "130819";
        $db_name = "Licenta";

        $user_input->email = input_test($_POST["email"]);
        $user_input->pw = input_test($_POST["password"]);
        $user_input->nume = input_test($_POST["firstname"]);
        $user_input->prenume = input_test($_POST["lastname"]);
        $user_input->confirm_pw = input_test($_POST["password-check"]);

        $_SESSION['error_text'] = '';

        if (empty($user_input->email))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Camp de email gol ! <br/>";
            $_SESSION['email_error'] = 1;
        } else if (!filter_var($user_input->email, FILTER_VALIDATE_EMAIL))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Format email gresit ! <br/>";
            $_SESSION['email_error'] = 1;
        }

        if(!empty($user_input->email))
        {
            // salvam ca sa il afisam in value in input data viitoare
            // trebuie sa il retinem fie ca e gresit, fie ca nu, cu exceptia cand e gol
            $_SESSION['email_value_attribute'] = $user_input->email; 
        }

        if (empty($user_input->pw))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Camp de parola gol ! <br/>";
            $_SESSION['pw_error'] = 1;
        } else if (!preg_match("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}^", $user_input->pw))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Format parola gresit ! <br/>";
            $_SESSION['pw_error'] = 1;
        }

        if (empty($user_input->confirm_pw))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Reintroduceti parola pentru confirmare ! <br/>";
            $_SESSION['confirm_pw_error'] = 1;
        } else if ($user_input->confirm_pw != $user_input->pw)
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Parolele nu corespund ! <br/>";
            $_SESSION['confirm_pw_error'] = 1;
        }

        if (empty($user_input->nume))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Camp de nume gol ! <br/>";
            $_SESSION['nume_error'] = 1;
        } else 
        {
            $_SESSION['nume_value_attribute'] = $user_input->nume; // salvam ca sa il afisam in value in input data viitoare
        }

        if (empty($user_input->prenume))
        {
            $_SESSION['error_text'] = $_SESSION['error_text'] . "Camp de prenume gol ! <br/>";
            $_SESSION['prenume_error'] = 1;
        } else
        {
            $_SESSION['prenume_value_attribute'] = $user_input->nume; // salvam ca sa il afisam in value in input data viitoare
        }

        // nu exista o eroare la inputuri
        if (!isset($_SESSION['email_error']) &&
            !isset($_SESSION['pw_error']) &&
            !isset($_SESSION['confirm_pw_error']) &&
            !isset($_SESSION['nume_error']) &&
            !isset($_SESSION['prenume_error']) ) 
        {
            $connection = new mysqli($server_adr, $db_username, $db_pw, $db_name);
            if ($connection->connect_error) 
            {
                $_SESSION['error_text'] = "Conexiune esuata cu serverul !";
                die("Conexiune esuata: " . $connection->connect_error);
            } 

            // Verificam daca exista deja emailul in BD
            $procedure_return = $connection->prepare('CALL verificare_email_existent(?)');
            $procedure_return->bind_param("s",$user_input->email);
            $procedure_return->execute();
            $procedure_return = $procedure_return->get_result();
            $procedure_return = mysqli_fetch_assoc($procedure_return); // devine NULL daca nu gasesste emailu
            if (!$procedure_return) // emailul este valabil, continuam cu inregistrarea
            {
                $procedure_return = '';
                $user_input->pw = password_hash($user_input->pw, PASSWORD_DEFAULT); // hashuim parola 
                $procedure_return = $connection->prepare('CALL inregistrare_cont(?, ?, ?, ?)');
                $procedure_return->bind_param("ssss", $user_input->nume, $user_input->prenume, $user_input->email, $user_input->pw);
                $procedure_return->execute();
                unset($_SESSION['error']); // o sa ne trimita pe login si nu trebuie sa avem erori pentru ca o sa le afiseze, deci le stergem
                // echo "<script> window.location.replace('../index.php'); </script>";
                unset($_SESSION['error_text']);
                unset($_SESSION['email_error']);
                unset($_SESSION['pw_error']);
                unset($_SESSION['confirm_pw_error']);
                unset($_SESSION['nume_error']);
                unset($_SESSION['prenume_error']);

                $_SESSION['succes_register_alert'] = $_SESSION['email_value_attribute']; // salvam emailul ca sa il afisam in value de la input login
                unset($_SESSION['email_value_attribute']);
                unset($_SESSION['nume_value_attribute']);
                unset($_SESSION['prenume_value_attribute']);

                header('Location: ../index.php');

            } else // daca emailul a fost deja folosit
            {
                $_SESSION['error_text'] = "Emailul este deja folosit !";
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
    <link rel="stylesheet" href="../css/login.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <title>Inregistrare</title>
    <!-- Functia care afiseaza erorile in alert box in caz ca sunt erori la inputuri. E apelata de php -->
    <script src="../js/scripts/inregistrare_show_input_errors.js"></script>    
    
</head>
<body>
    <div class="container">
        <h2 class="mb-5 text-center">Inregistreaza-te</h2>
        <!-- Aici sunt afisate erorile. Initial este d-none, functia de jquery o sa schimbe asta daca exista erori -->
        <div class="error-alert-box col mb-2"> 
            <p class="mb-0"></p>
        </div> 
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>">
            <div>
                <input id="nume" class="input-em mb-3 col" type="text" value="<?php echo $_SESSION['nume_value_attribute'];?>" name="firstname" autofocus autocorrect="off" spellcheck="false" required autocomplete="off">
                <label for="nume">Nume</label>
            </div>
            <div>
                <input id="prenume" class="input-em mb-3 col" type="text" value="<?php echo $_SESSION['prenume_value_attribute'];?>" name="lastname" autocorrect="off" spellcheck="false" required autocomplete="off">
                <label for="prenume">Prenume</label>
            </div>
            <div>
                <input id="email" class="input-em mb-3 col" type="text" value="<?php echo $_SESSION['email_value_attribute'];?>" name="email" autocorrect="off" spellcheck="false" required autocomplete="off">
                <label for="email">Email</label>
            </div>
            <div>
                <input id="password" class="input-pw mb-3 col" type="password" name="password" required>
                <label for="password">Parola</label>
            </div>
            <div>
                <input id="confirm-pw" class="input-pw mb-2 col" type="password" name="password-check" required>
                <label for="confirm-pw">Confirmare parola</label>
            </div>
            <div class="d-flex flex-row justify-content-between mb-3">
                <div class="d-block mx-auto"><a href="../index.php">Inapoi la logare</a></div>
                <!-- <a class"justify-content-between" href="">Am uitat parola</a> -->
            </div>
            <button class="col" type="submit" class="d-block mx-auto ">Inregistrare</button>
        </form>
    </div> <!-- END OF div container -->
</body>





<?php
    // Daca avem scris ceva in error_text, inseamna ca am avut o eroare, deci o afisam si facem blocurile rosii
    if ($_SESSION['error_text'] != '')
    {
        // apelam functia ca sa arate eroarea
        echo "<script> show_input_error(1, '".$_SESSION['error_text']."','".$_SESSION['email_error']."','".$_SESSION['pw_error']."','".$_SESSION['confirm_pw_error']."','".$_SESSION['nume_error']."','".$_SESSION['prenume_error']."');</script>"; 
    } else
    {
        echo "<script> show_input_error(0, 0, 0, 0, 0, 0, 0);</script>"; // nu avem eroare, deci ascundem divul
    }
    unset($_SESSION['error_text']);
    unset($_SESSION['email_error']);
    unset($_SESSION['pw_error']);
    unset($_SESSION['confirm_pw_error']);
    unset($_SESSION['nume_error']);
    unset($_SESSION['prenume_error']);
?>
</html>