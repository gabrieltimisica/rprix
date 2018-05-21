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

    // Datagrid methods
    // -----------------------------------------
    // Butonul de clear filters
    $("#clear-datagrid-filters").click(function () {
        var dataTable = $('#dataGrid').dxDataGrid('instance');
        dataTable.clearFilter();
    });

    // Aplicam filtrele de status din checkboxul din header
    // arrayOfFilters este un vector in care fiecare element reprezinta un filtru. Intre elemente trebuie sa existe un 'or', el aflandu-se pe pozitii impare
    $("#filter-by-status-active").click(function () {
        
        var dataTable = $('#dataGrid').dxDataGrid('instance');
        dataTable.filter(["ContractStatusID", "=", 1]); // Active
        console.log(dataTable.getCombinedFilter());
    });
    $("#filter-by-status-canceled").click(function () {
        var dataTable = $('#dataGrid').dxDataGrid('instance');
        dataTable.filter(["ContractStatusID", "=", 2]); // Canceled
    });

    // !!!!!!!!!!!!!!!!!!!!!
    // Ce mai ai de facut e asa:
    // schimba cursorul sa fie pointer cand este peste checkboxuri
    // Fa sa poti combina filtrele, adica sa fie mai multe de ales si sa le afiseze pe taote
    // Fa sa se stearga filtrul daca nu e apasat


}); // END READY FUNCTION

// arrayOfValuesToBeFilteredFromHeaderCheckboxes este un vector in care fiecare element reprezinta o valoare de filtru. Eu iau toate aceste valori si din ele creez arrayOfFilters
// var arrayOfValuesToBeFilteredFromHeaderCheckboxes = new array();
// Functia aplica modificarile bazat pe array-ul de mai sus
// function applyFiltersToDatagridFromHeaderCheckboxes () {

// }


// Variabilele astea sunt vectori de obiecte
// In ele stochez optiunile din care se poate alege in dropdown uri cand apas pe edit / add
var statusTable, organisationTable, clientsTable, contractTypeTable;

statustable = [{
    "StatusID": 1,
    "Name": "Active"
}, {
    "StatusID": 2,
    "Name": "Canceled"
}, {
    "StatusID": 3,
    "Name": "Closed"
}, {
    "StatusID": 4,
    "Name": "Preliminary"
}];


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
                caption:'Organisation',
                dataField:'OrganisationName',
                allowGrouping: true
            },
            {
                caption:'Contract Type',
                dataField:'ContractType',
                allowGrouping: true
            },
            {
                // Apare in tabel, nu apare la add / edit
                caption:'Status',
                dataField:'ContractStatusID',
                alignment: 'center',
                allowGrouping: true,
                lookup: {
                    dataSource: statustable,
                    displayExpr: "Name",
                    valueExpr: "StatusID"
                }
            },
            {
                caption:'Contract Number IN',
                dataField:'ContractNumberIn',
                visible: false
            },
            {
                caption:'Contract Number OUT',
                dataField:'ContractNumberOut',
                visible: false
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
            }
        ],
        editing: {
            allowAdding: true,
            allowDeleting:true,
            allowUpdating:true,
            mode: 'popup',
            form: {
                customizeItem: function(item) {
                    if (item.dataField == "ContractID" ||
                         item.label.text == "Row Number" ||
                         item.dataField == "ContractAddDate")
                    {
                        item.visible = false;
                    }
                } // end customizeitem
            },  
            popup: {
                title: "Add contract",
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
                deleteRow: 'Cancel', // textul delete e inlocuit cu cancel
                addRow: "Add contract"// 
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
            excelFilterEnabled: true,
            fileName:"Contracts",
            texts: {
                exportAll: "Export all data",
                exportTo: "Export"
            }
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
            allowedPageSizes: [10, 50, 100, 200, 500],
            infoText: "Page {0} of {1}",
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            visible: true
        },
        masterDetail: {
            enabled: true
        },
       
        stateStoring: {
            enabled: true,
            type: 'SessionStorage',
            ignoreColumnOptionNames: []
        },
        onRowInserted: function(e) {
            console.log("asta e");
            console.log(e.data);
            var json_toSend = {
                "data": e.data, // informatia despre contract adaugata
                "userID": userID_fromSession,
                "action": "addContract"
            };
            // Adaugam in BD
            contracts_action_editAddDelete(json_toSend);
            // updatam tabelul, ca sa ia si  contractID din BD, pentru ca se creeaza cand ajunge in bd, nu are de unde sa o ia, deci luam toata informatia din nou
            get_table_data();
            
        },
        onEditorPrepared: function(e) {
            console.log("mergeee");
        },
        onRowUpdating: function(e) {
            var json_toSend = {
                "data": e.oldData, // oldData este un obiect care contine toti parametrii din baza de date, cu update-ul facut
                "userID": userID_fromSession,
                "action": "editContract"
            };
            console.log("Json editare");
            console.log(json_toSend);
            contracts_action_editAddDelete(json_toSend);
        },
        onEditingStart: function(e) {
            // settimeout ca sa aiba popup-ul timp sa apara mai intai, ca sa aiba ce sa modifice
            setTimeout(function(){
                // Div-ul in care se afla titlul de la popup-ul de editare
                $(".dx-datagrid-edit-popup .dx-toolbar-label .dx-item-content div").text("Edit contract");
            });   
            // Cand incepe editarea trebuie sa luam din baza de date lista de optiuni care apare in dropdown pentr organizatii, clienti si status
            // getDataOptionsForDropdowns();
        },
        onRowRemoved: function(e){
            console.log(e.data.ContractID, userID_fromSession);
            var json_toSend = {
                "contractID": e.data.ContractID,
                "userID": userID_fromSession,
                "action": "deleteContract"
            };
            contracts_action_editAddDelete(json_toSend);
        }
        // https://www.devexpress.com/Support/Center/Question/Details/T451111/dxdatagrid-how-to-get-row-values-on-editing-adding-of-a-row
        // site ca sa vezsi edit-ul
    });
}

// Functie apelata din eventul de add/edit/delete contracts din dxdatagrid 
function contracts_action_editAddDelete(json_toSend) 
{
    $.ajax({
        type: "POST",
        url: "phpScripts/addEditDelete_contracts_fromDB.php",
        data: {myData: JSON.stringify(json_toSend)}, // json_filter e global
        dataType: "json",
        success: function(returned_data) 
        {
            console.log("merge");
        },
        error: function() {
            // console.log("Ori nu merge, ori s-a dat add fara toti parametrii, dar oricum se baga bine in BD deci np");
        }
    }); // end ajax
}

// luam toata tabela de contracte din BD
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

            // Acum desenam tabelul
            draw_table(array);
        },
        error: function(xhr, status, text)
        {
                console.log(xhr.status,"-------",status,"---------",text);
        }
    }); // end ajax
}

// Functie care preia atunci cand se apasa pe edit optiunile care sunt afisate in dropdown pentru organizatii, clienti si status
function getDataOptionsForDropdowns()
{
    $.ajax({
        type: "POST",
        url: "phpScripts/getTableDataForDropdownInEdit.php",
        success: function(returned_data) 
        {
            console.log("status organizatie clienti");
            console.log(returned_data);
            // Din obj de obj facem vector de object
            var array = $.map(returned_data, function(value, index) {
                return [value];
            });

            // Acum desenam tabelul
            draw_table(array);
        },
        error: function(xhr, status, text)
        {
                console.log(xhr.status,"-------",status,"---------",text);
        }
    }); // end ajax
}


