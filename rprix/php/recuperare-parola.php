<?php 
// echo $_COOKIE["id"];
// if(isset($_COOKIE['id']) && $_COOKIE['id'] == true){
//     echo "ince e activ";
// }
// else echo "nu mai e activ";
// echo time();
// echo "<br/>";
// print_r($_COOKIE);
// echo "<br/>";
 ?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/login.css">
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <title>Recuperare parola</title>
</head>
<body>
    <div class="container">
        <h2 class="mb-5 text-center">Recuperare parola</h2>
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>">
            <input class="input-em mb-3 col" type="email" placeholder="E-mail@example.com" name="email">
            <div class="d-flex flex-row justify-content-between mb-3">
                <div class="d-block mx-auto"><a href="../index.php">Inapoi la logare</a></div>
                <!-- <a class"justify-content-between" href="">Am uitat parola</a> -->
            </div>
            <button class="col" type="submit" class="d-block mx-auto ">Trimite e-mail</button>
        </form>
    </div> <!-- END OF div container -->
</body>
</html>

