// Functia care afiseaza erorile in alert box in caz ca sunt erori la inputuri. E apelata de php
    function show_input_error(show_the_div,
                          error_text,
                          email_error,
                          pw_error,
                          confirm_pw_error,
                          nume_error,
                          prenume_error )
    {
        if(show_the_div)
        {
            $("div.error-alert-box").addClass("d-block");
            $("div.error-alert-box p").html(error_text);
            if(nume_error)
            {
                $("#nume").css({"border-color" : "red", "background-color" : "#FFCCCB"});
            }
            if(prenume_error)
            {
                $("#prenume").css({"border-color" : "red", "background-color" : "#FFCCCB"});
            }
            if(email_error)
            {
                $("#email").css({"border-color" : "red", "background-color" : "#FFCCCB"});
            }
            if(pw_error)
            {
                $("#password").css({"border-color" : "red", "background-color" : "#FFCCCB"});
            }
            if(confirm_pw_error)
            {
                $("#confirm-pw").css({"border-color" : "red", "background-color" : "#FFCCCB"});
            }
        } else
        {
            $("div.error-alert-box").addClass("d-none");
        }
    } // END function show_input_error    



