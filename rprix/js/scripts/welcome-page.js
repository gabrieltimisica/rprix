$(function() {
    // primul chart apare automat
    create_new_chart();
    // Incepem executia scripturilor de python
    callphp_script_exec();

    // Logout button
    $("button.loggout-btt").click(function() {  
        $.ajax({
            type: "POST",
            url: "phpScripts/destroy_cookie_session.php",
            data: { check: 0 },
            success: function(data) 
            {
                window.location.replace("../index.php");
            }
        }); // end ajax
    }); // END  $("button").click(function()
}); // END READY FUNCTION


// intervalul la care se executa scripturile 
var exec_interval = {"temp" : 1, 
                    "humid" : 1,
                    "lum" : 1};

/**
 * Functia executa un ajax request la fiecare secunda.
 * Json-ul trimis contine 3 valori (0 sau 1) pentru fiecare senzor, care indica daca trebuie executati in secunda respectiva sau nu
 * Scriptul de php se afla pe pi si se numeste exec_python_scripts.php
 * temp_time_contor, humid_time_contor, lum_time_contor    sunt 3 variabile care se incrementeaza la fiecare secunda.
 * Cand cele 3 variabiile de mai sus ajung la valoarea de executie   temp_interval_exec etc, atunci se face json-ul 1 si este trimis ca sa se execute python-ul
 */
function callphp_script_exec()
{
    // Numara cate secunde sunt de la ultima executare
    var time_contor = {"temp" : 0, 
                        "humid" : 0,
                        "lum" : 0};
    // json-ul care va fi trimis. 1 = se execute, 0 = nu. Toate sunt 1 ca sa execute prima valoare imediat
    var sensors_to_execute = {"temp" : 1,  
                            "humid" : 1,
                            "lum" : 1};
    setInterval(function()
    {
        if(time_contor.temp == exec_interval.temp && exec_interval.temp)
        {
            sensors_to_execute.temp = 1; // setam temperatura 1, sa ia valoare de la senzor
            time_contor.temp = 0; // resetam
        }
        if(time_contor.humid == exec_interval.humid && exec_interval.humid)
        {
            sensors_to_execute.humid = 1; // setam umiditatea 1, sa ia valoare de la senzor
            time_contor.humid = 0;
        }
        if(time_contor.lum == exec_interval.lum && exec_interval.lum)
        {
            sensors_to_execute.lum = 1; // setam luminarea 1, sa ia valoare de la senzor
            time_contor.lum = 0;
        }

        time_contor.temp ++;
        time_contor.humid ++;       
        time_contor.lum ++;  

        // se iau valori in secunda asta daca e cel putin un senzorcare trebuie
        if(sensors_to_execute.temp || sensors_to_execute.humid || sensors_to_execute.lum) 
        {   
            $.ajax({
                type: "POST",
                url: "http://192.168.12.114/exec_python_scripts.php", // se afla in www/html/ pe rasberry
                data: {myData: JSON.stringify(sensors_to_execute)},
                success: function(response)
                {
                    var resp_decrypted = JSON.parse(response)
                    console.log(resp_decrypted);
                    // Afisam doar daca 
                    if(resp_decrypted.temp != "not_set")
                    {
                        $("div.temp-value-box p.show-value").html(resp_decrypted.temp, "<span>&#8451;</span>");
                    }
                    if(resp_decrypted.humid != "not_set")
                    {
                        $("div.humid-value-box p.show-value").html(resp_decrypted.humid, "<span>%</span>");
                    }
                    if(resp_decrypted.lum != "not_set")
                    {
                        $("div.lum-value-box p.show-value").html(resp_decrypted.lum, "<span>%</span>");
                    }
                },
                error: function(xhr, status, text)
                {
                    console.log(xhr.status,"-------",status,"---------",text);
                }
            }); // end ajax
        } // end    if(!sensors_to_execute.temp && !sensors_to_execute.humid && !sensors_to_execute.lum)

        sensors_to_execute = {"temp" : 0,  // resetam de fiecare data
                            "humid" : 0,
                            "lum" : 0};
    }, 1000); // end setinterval
} // END function callphp_script_exec()




