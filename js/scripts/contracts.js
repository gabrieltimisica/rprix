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


// Aici este apelat devextreme si creeaza tabelul
function draw_table(table_data) 
{
    $("#dataGrid").dxDataGrid({
        dataSource: table_data,
        columns: [
            {
                caption:'Row Number',
                cellTemplate: function(cellElement, cellInfo)
                {
                    cellElement.text(cellInfo.row.rowIndex + 1) // + 1 ca sa inceapa de la 1 ordinea
                }
            },
            {
                caption:'Contract ID',
                dataField:'ContractID',
                alignment: 'left',
                allowGrouping: true
            },
            {
                
                caption:'Contract Name',
                dataField:'ContractName',
                allowGrouping: true
            },
            {
                caption:'Client',
                dataField:'ClientName',
                alignment: 'left',
                allowGrouping: true
            },
            {
                caption:'Status',
                dataField:'StatusName',
                alignment: 'center',
                allowGrouping: true
            },
            {
                caption:'Expire Date',
                dataField:'ContractExpireDate',
                allowGrouping: true,
                dataType: 'datetime'
            },
            {
                caption:'Start Date',
                dataField:'ContractBeginDate',
                allowGrouping: true,
                dataType: 'datetime',
                visible: false
            },
            {
                caption:'Add Date',
                dataField:'ContractAddDate',
                allowGrouping: true,
                dataType: 'datetime',
                visible: false
            },
            {
                caption:'Short Description',
                dataField:'ContractShortDescription',
                visible: false
            },
            {
                caption:'Client Code',
                dataField:'ContractClientCode',
                allowGrouping: true,
                visible: false
            }

        ],
        editing: {
            allowAdding: true,
            allowDeleting:true,
            allowUpdating:true,
            mode: 'popup',
            popup: {
                title: "Contract edit",
                showTitle: true,
                width: 700,
                height: 500,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }
            },
            texts: {
                deleteRow: 'Cancel' // textul delete e inlocuit cu cancel
            }
        },
        columnChooser: {
            allowSearch: true,
            enabled: true,
            height: 300,
            mode: "select",
            title: "Column Chooser",
            width: 250
        },
        columnAutoWidth: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        columnHidingEnabled: true, // la asta sa mai cauti, se poate sa fie overwrited de autowidth 
        filterRow: { // Filtrare dupa valoare pe fiecare coloana
            visible: true 
        },
        headerFilter: { // apare acel icon in care poate filtra cu clickuri dupa valori
            allowSearch: true,
            visible: true,
            height: 400
        },
        export: {
            allowExportSelectedData: true,
            enabled: true,
            excelFilterEnabled: true
        },
        groupPanel: {
            visible: true
        },
        paging: {
            enabled: true,
            pageIndex: 0,
            pageSize: 20
        },
        pager: {
            allowedPageSizes: "auto",
            infoText: "Page {0} of {1}",
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            visible: true
        },
        masterDetail: {
            enabled: true
        },
        onRowRemoved: function(e){
            console.log(e.data.ContractID, userID_fromSession);
            var json_toSend = {
                "contractID": e.data.ContractID,
                "userID_whoDeletedTheContract": userID_fromSession
            };
            $.ajax({
                type: "POST",
                url: "phpScripts/delete_contracts_dxDataGrid.php",
                data: {myData: JSON.stringify(json_toSend)}, // json_filter e global
                dataType: "json",
                success: function(returned_data) 
                {
                    console.log("merge");
                },
                error: function() {
                    console.log("nu merge stergerea");
                }
            }); // end ajax
        },
        // https://www.devexpress.com/Support/Center/Question/Details/T451111/dxdatagrid-how-to-get-row-values-on-editing-adding-of-a-row
        // site ca sa vezsi edit-ul
        stateStoring: {
            enabled: true,
            type: 'SessionStorage'
        },
        onRowInserted: function(e) {
            console.log(e.data.row);
            console.log("asd"); 
        }

        

    });
}



// luam contractele din BD
function get_table_data()
    {
        $.ajax({
            type: "POST",
            url: "phpScripts/get_table_data.php",
            data: {myData: JSON.stringify({"nuConteazaCeEAici": null})}, // nu avem data
            dataType: "json",
            success: function(returned_data) 
            {
                console.log(returned_data);
                
                // Din obj de obj facem vector de object
                var array = $.map(returned_data, function(value, index) {
                    return [value];
                });

                // chart_data e un obiect care contine informatia structurata array array pe care o trimitem pt desenarea chartului
                // definim chart_data
                var chart_data = new Array();
                for (var k = 0; k < array.length ; k ++)
                {
                    chart_data[k] = new Array();
                }
                
                // Aici, memoram in chart_data coloanele pe care vrem sa i le trimitem graficului gantt intr-o ordine stabilita de chart
                var j = 0;
                for(var i = 0; i < array.length  ; i++)
                {
                    j = 0;
                    chart_data[i][j++] = array[i].ContractID; 
                    chart_data[i][j++] = array[i].ContractName; 
                    chart_data[i][j++] = 'Romprix';  // resources
                    chart_data[i][j++] = array[i].ContractBeginDate;
                    chart_data[i][j++] = array[i].ContractExpireDate;
                    chart_data[i][j++] = null; // durata, dar o calculeaza singur deci ii dau null
                    chart_data[i][j++] = 100; // percent done
                    if(array[i].ContractParentID != null) // dependente
                    {
                        chart_data[i][j++] = array[i].ContractParentID.toString(); // daca avem, primim id contractului extins si il trecem in string pentru ca asta e formatul chartului
                    } else chart_data[i][j++] = '';
                } // end for

                // Acum desenam tabelul
                draw_table(array);
                gantt_chart_draw(chart_data);


            },
            error: function(xhr, status, text)
            {
                    console.log(xhr.status,"-------",status,"---------",text);
            }
        }); // end ajax
    }



