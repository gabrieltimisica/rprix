// arrayOfValuesToBeFilteredFromHeaderCheckboxes este un vector in care fiecare element reprezinta o valoare de filtru. Eu iau toate aceste valori si din ele creez arrayOfFilters
var arrayOfValuesToBeFilteredFromHeaderCheckboxes = [];

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
    // i = 1 Status canceled
    // i = 2 Status active
    // i = 3 closed
    // i = 4 preliminary
    $("#filter-by-status-active").click(function () 
    {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-active").is(':checked'))
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[2] = 1;
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[2] = 0;
        applyFiltersToDatagrid('ContractStatusID');
    });
    $("#filter-by-status-canceled").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-canceled").is(':checked'))
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[1] = 1;
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[1] = 0;
        applyFiltersToDatagrid('ContractStatusID');
    });
    $("#filter-by-status-closed").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-closed").is(':checked'))
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[3] = 1;
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[3] = 0;
        applyFiltersToDatagrid('ContractStatusID');
    });
    $("#filter-by-status-preliminary").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-preliminary").is(':checked'))
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[4] = 1;
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            arrayOfValuesToBeFilteredFromHeaderCheckboxes[4] = 0;
        applyFiltersToDatagrid('ContractStatusID');
    });


}); // END READY FUNCTION



// Functia aplica modificarile bazat pe array-ul arrayOfValuesToBeFilteredFromHeaderCheckboxes
function applyFiltersToDatagrid(columnNameFromDB) 
{
    // referinta  https://www.devexpress.com/Support/Center/Question/Details/T483994/dxdatagrid-how-to-specify-a-filter-for-multiple-values
    var dataTable = $('#dataGrid').dxDataGrid('instance');
    dataTable.clearFilter(); // scapam de filtrele precedente
    var filter = []; // vectorul final de aplicat
    var executeFilter = 0; // daca aplicam sau nu filtre
    for (var i = 1; i < arrayOfValuesToBeFilteredFromHeaderCheckboxes.length; i++)
    {
        // Pozitia i reprezinta statusul. i = 1 (status active)
        // arrayOfValuesToBeFilteredFromHeaderCheckboxes[i] = 1/0 indica daca este sau nu de aplicat filtrul pentru statusul i
        if (arrayOfValuesToBeFilteredFromHeaderCheckboxes[i])
        {
            executeFilter = 1;
            filter.push([columnNameFromDB, "=", i]);
            filter.push("or");
        }
    }
    filter.pop(); // ultimul 'or'
    // Daca nu avem niciun filtru, deja am dat clear la ele la inceput
    if (executeFilter)
        dataTable.filter(filter);
}


// Variabilele astea sunt vectori de obiecte
// In ele stochez optiunile din care se poate alege in dropdown uri cand apas pe edit / add
var statusTable, organisationTable, clientsTable, contractTypeTable;

statustable = [{
    "StatusID": 2,
    "Name": "Active"
}, {
    "StatusID": 1,
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
                // allow filtering si headerfiltering sunt puse asa ca sa dispara de la status filtrarea din cell-ul de jos
                allowFiltering: false,
                allowHeaderFiltering: true,
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
        selection: {
            mode: "multiple"
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


