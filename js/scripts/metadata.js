
$(function() {
    // DEFAULT SCRIPT =======================================================================
    // Logout button
    $(".loggout-btt").click(function() {  
        $.ajax({
            type: "POST",
            url: "phpScripts/destroy_cookie_session.php",
            data: { check: 0 },
            complete: function(data) 
            {
                window.location.replace("../"); // index.php
            }
        }); // end ajax
    }); // END  $("button").click(function()

    // Cand apesi pe menu-icon sa apara si sa dispara dropdownul
    $(".menu-icon").click(function(){
        $(".menu-icon ~ .dropdown-menu1").toggleClass("not-visible");
    });
    $(window).click(function() {
        if(!$(".menu-icon").is(':hover') && !$("ul.dropdown-menu1").is(':hover'))
        {
            $("ul.dropdown-menu1").addClass("not-visible");
        }
    });

    // END DEFAULT SCRIPTS ===================================================================

    getHtmlElementsFromDB();

}); // END READY FUNCTION


// function createHtmlElement() {
//     switch () {
//         case:
//             break;
//     }
// }

function getHtmlElementsFromDB() {
    $.ajax({
        type: "POST",
        url: "phpScripts/addEditDelete_contracts_fromDB.php",
        // data: {myData: JSON.stringify(newjson)}, 
        // dataType: "json",
        success: function(response) 
        {
            console.log("merge");
        },
        error: function() {
            console.log("nu mere");
        }
    }); // end ajax
}