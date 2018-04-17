$(function() {
    $("input.keep_logged").change(function() // cand apas checkboxu
    {
        if($("input.keep_logged").is(':checked')) // tocmai l-am bifat
        {
            $.ajax({
                type: "POST",
                url: "php/phpScripts/set_keep_me_loggedin_1.php",
                data: { check: 1 },
                success: function(data) 
                {
                    console.log(data);
                }
            }); 
            console.log("REMEMBER= 1");
        } else // tocmai l-am debifat
        { 
            $.ajax({
                type: "POST",
                url: "php/phpScripts/set_keep_me_loggedin_0.php",
                data: { check: 0 },
                success: function(data) 
                {
                    console.log(data);
                }
            });
            console.log("REMEMBER = 0");
        } // END else 
    }); // END $("input.keep_logged").change(function() 
}); // END READY FUNCTION


// Functia care afiseaza erorile in alert box in caz ca sunt erori la inputuri. E apelata de php
function show_input_error(error, show_the_div)
{
    if(show_the_div)
    {
        $("div.error-alert-box").addClass("d-block");
        $("div.error-alert-box p").text(error);
    } 
    else
    {
        $("div.error-alert-box").addClass("d-none");
    }
} // END show_input_error(char error)     

