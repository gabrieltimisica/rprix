$(function() {

    get_table_data();
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

}); // END READY FUNCTION

// variabila globala
var json_filter = {
        'contractStatus': {
            'active': 1,
            'expired': 1,
            'extended': 0,
            'deleted': 0
        },
        'fromDate': '2016-10-06 00:00',
        'toDate': '2018-10-06 12:00'
};

// Aici este apelat devextreme si creeaza tabelul
function draw_table(table_data) 
{
    $("#dataGrid").dxDataGrid({
        dataSource: table_data,
        columns: [
                {
                    dataField:'ContractID', 
                    caption:'George Baros'
                },
                 'ContractType',
                 'ContractAddDate'
                //  'Expire Date',
                //  'Status',
                //  'Remindere'
                 ],
        editing: {
            allowAdding: true,
            allowDeleting:true,
            allowUpdating:true
        }
    });
}

// luam contractele din BD
function get_table_data()
    {
        console.log(json_filter);
        $.ajax({
            type: "POST",
            url: "phpScripts/get_table_data.php",
            data: {myData: JSON.stringify(json_filter)}, // json_filter e global
            dataType: "json",
            success: function(returned_data) 
            {
                console.log(returned_data);
                
                // Din obj de obj facem vector de object
                var array = $.map(returned_data, function(value, index) {
                    return [value];
                });

                // chart_data e un obiect care contine informatia structurata array array pe care o trimitem pt desenarea chartului
                var chart_data = new Array();
                for (var k=0; k<array.length;k++)
                {
                    chart_data[k] = new Array();
                }
                var j = 0;
                for(var i = 0; i < array.length  ; i++)
                {
                    j = 0;
                    chart_data[i][j++] =  array[i].ContractID; 
                    chart_data[i][j++] = array[i].ContractName; 
                    chart_data[i][j++] = 'spring'; // resources 
                    chart_data[i][j++] = array[i].ContractBeginDate;
                    chart_data[i][j++] = array[i].ContractExpireDate;
                    chart_data[i][j++] = null; // durata, dar o calculeaza singur deci ii dau null
                    chart_data[i][j++] = 100; // toate completate 100%
                    chart_data[i][j++] = null; // dependente
                }

                console.log(chart_data);

                // Acum desenam tabelul
                draw_table(array);
                ceva_draw(chart_data);

            },
            error: function(xhr, status, text)
            {
                    console.log(xhr.status,"-------",status,"---------",text);
            }
        }); // end ajax
    }



