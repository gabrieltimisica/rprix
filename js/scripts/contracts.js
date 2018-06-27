// LINKURI UTILE
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Lookup/Templates/jQuery/Light/       a definit fiecare linie din lookup
// http://jsfiddle.net/o1qu92v2/     custom button in header 
// https://www.devexpress.com/Support/Center/Question/Details/T477153/dxselectbox-how-to-determine-if-the-user-click-on-clear-button          custom button click event(varianta 2, prima e cu un rand mai sus)


// arrayOfValuesToBeFilteredFromHeaderCheckboxes este un vector in care fiecare element reprezinta o valoare de filtru. Eu iau toate aceste valori si din ele creez arrayOfFilters
var arrayOfValuesToBeFilteredFromHeaderCheckboxes = [];


// pula mea
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
        $(".checkbox-active").css("font-weight","Normal");
        $(".checkbox-canceled").css("font-weight","Normal");
        $(".checkbox-closed").css("font-weight","Normal");
        $(".checkbox-preliminary").css("font-weight","Normal");
        $(".filter-checkbox").prop('checked', false);
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
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[2] = 1;
                $(".checkbox-active").css("font-weight","Bold");
            }
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[2] = 0;
                $(".checkbox-active").css("font-weight","Normal");
            }
        applyFiltersToDatagrid('ContractStatusID');
    });
    $("#filter-by-status-canceled").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-canceled").is(':checked'))
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[1] = 1;
                $(".checkbox-canceled").css("font-weight","Bold");
            }
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[1] = 0;
                $(".checkbox-canceled").css("font-weight","Normal");
            }
        applyFiltersToDatagrid('ContractStatusID');
    });
    $("#filter-by-status-closed").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-closed").is(':checked'))
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[3] = 1;
                $(".checkbox-closed").css("font-weight","Bold");
            }
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[3] = 0;
                $(".checkbox-closed").css("font-weight","Normal");
            }
        applyFiltersToDatagrid('ContractStatusID');
    });
    $("#filter-by-status-preliminary").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-preliminary").is(':checked'))
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[4] = 1;
                $(".checkbox-preliminary").css("font-weight","Bold");
            }
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[4] = 0;
                $(".checkbox-preliminary").css("font-weight","Normal");
            }
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
    "key": 1,
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

orgtable = ["plm1", "plm2", "plm3"];


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
                caption:'Organisation',
                dataField:'OrganisationName',
                allowGrouping: true,
                editCellTemplate: function (cellElement, cellInfo) {
                    console.log(cellElement, cellInfo);
                    var div = document.createElement("div");
                    cellElement.get(0).appendChild(div);
                    $(div).dxSelectBox({
                        dataSource: statustable,
                        valueExpr: 'StatusID',
                        displayExpr: 'Name',
                        showClearButton: true,
                        openOnFieldClick: false, // ca sa facem prevent la dropdown cand apasam pe container
                        hoverStateEnabled: false,  // sa nu se inegreasca dropdownul cand faci hover
                        searchEnabled: true, // ca sa poata scrie in search, nu doar sa selecteze din dropdown
                        // onValueChanged: function (e) {
                        //     cellInfo.setValue(e.value);
                        // },
                        fieldTemplate: function (value) {
                            var $container = $("<div>");
                            var $input = $("<div>").dxTextBox({
                                text: value
                            }).on('click', function (args) {
                                // events cand apesi pe containerul cu text
                            });
                            var $customButton = $("<div>").dxButton({
                                // text: "Custom",
                                icon: "search",
                                onClick: function (args) {
                                    console.log("inputtext",$input.text);
                                    console.log("CustomButton");
                                    console.log("args", args);
                                    console.log("valuee=", $input);
                                    var e = args.event; // facem astea 3 ca sa oprim dropdownul
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }).css({
                                position: "absolute",
                                right: "0",
                                top: "0"
                            }); // end customButton
                            $container.append($input).append($customButton);
                            return $container;
                        } // end fieldTemplate
                    }).find(".dx-texteditor-buttons-container").css({"display": "none", "pointer-events": "none"}); // ca sa dam hidden la dropdown icon
                } // end editCellTemplate
            },
            {
                caption:'Client',
                dataField:'ClientName',
                alignment: 'left',
                allowGrouping: true
            },
            {
                
                caption:'Contract Name',
                dataField:'ContractName',
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
                // cellTemplate: function (container, options) {
                //     var div = document.createElement("div");
                //     $(div).appendTo(container);
                // },
                
                // allow filtering si headerfiltering sunt puse asa ca sa dispara de la status filtrarea din cell-ul de jos
                allowFiltering: false,
                allowHeaderFiltering: true,
                allowGrouping: true,
                options:{
 
                },
                lookup: {
                    dataSource: statustable,
                    displayExpr: "Name",
                    valueExpr: "StatusID"
                },
               
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
                format: 'dd/MM/yyyy',
                allowGrouping: true,
                dataType: 'date'
            },
            {
                caption:'Start Date',
                dataField:'ContractBeginDate',
                allowGrouping: true,
                format: 'dd/MM/yyyy',
                dataType: 'date',
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
            mode: 'popup',
            allowAdding: true,
            allowDeleting:true,
            allowUpdating:true,
            useIcons: true,
            
            form: {
                colCount: 2,
                items: [{
                    itemType: "group",
                    items: [{ 
                        dataField: "ContractType" 
                    }]
                },
                {
                    // Asta e pus aici ca sa ocupe loc, sa ocupe jumatate de coloana
                    itemType: "group",
                    items: [{
                        caption: "spatiugol2"
                    }]
                },
                {
                    itemType: "group",
                    colSpan: 2,
                    items: [{ 
                        dataField: "OrganisationName",
                        cssClass: "popupCells"
                    }]
                },
                {
                    itemType: "group",
                    colSpan:2,
                    items: [{ 
                        dataField: "ContractName",
                        cssClass: "popupCells" 
                    }]
                },
                {
                    itemType: "group",
                    colSpan:2,
                    items: [{ 
                        dataField: "ClientName",
                        cssClass: "popupCells" 
                    }]
                },
                {
                    itemType: "group",
                    items: [{ 
                        dataField: "ContractNumberIn" 
                    }]
                },
                {
                    itemType: "group",
                    items: [{ 
                        dataField: "ContractNumberOut",
                        cssClass: "popupCells" 
                    }]
                },
                {
                    itemType: "group",
                    items: [{ 
                        dataField: "ContractBeginDate",
                        editorType: "dxCalendar" 
                    }]
                },
                {
                    itemType: "group",
                    items: [{ 
                        dataField: "ContractExpireDate",
                        editorType: "dxCalendar",
                        cssClass: "popupCells" 
                    }]
                },
                {
                    itemType: "group",
                    items: [{ 
                        dataField: "ContractStatusID"
                    }]
                },
                {
                    // Asta e pus aici ca sa ocupe loc, sa faca short descriptionul pe tot randul
                    itemType: "group",
                    items: [{
                        caption: "spatiugol"
                    }]
                },
                {
                    itemType: "group",
                    colSpan: 2,
                    items: [{ 
                        dataField: "ContractShortDescription",
                        editorType: "dxTextArea",
                        editorOptions: {
                            height: 90
                        },
                        cssClass: "popupCells" 
                    }]
                },
                {
                    itemType: "group",
                    colSpan: 2,
                    template: function(data, itemElement) 
                    {
                    var div = document.createElement("div");
                    itemElement.get(0).appendChild(div);
                    $(div).dxFileUploader({
                        multiple: true,
                        accept: "*",
                        selectButtonText: "Select file",
                        labelText: "Upload the contract only in format PDF",
                        uploadMode: "useForm",
                        uploadUrl: ""// aici vom pune adresa serverului unde vor fi salvate contractele;
                    }).dxFileUploader("instance");
                    }// end template: function(data, itemElement)

                },

                
            ]}, // end form si ] se inchide items
            popup: {
                title: "Add contract",
                showTitle: true,
                width: 800,
                height: 650,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }
                // toolbarItems:
                //     [{
                //     // location: 'before',
                //     widget: "dxButton",
                //     location: "bottom",
                //     options: {
                //       text: 'Add',
                //       icon: 'save'
                //     },
                // }]
                //     // onClick: onClick
                
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
        onRowPrepared: function (info) {
            if (info.rowType == 'data')
                    {
                    if (info.data.ContractStatusID== 1)
                        info.rowElement.css("background-color", "#ffa8a8");// daca contractul are status de canceled randul cu contractul respectiv este coloroat cu #ffa8a8
                    }
            //     info.rowElement.css('background', 'red');
     },
    // onCellPrepared: function(e) {
    //     // console.log("plm",e);
    //    console.log( e.cell.text);
    // },
        onRowInserted: function(e) {
            console.log("asta e");
            console.log(e.data);
            var json_toSend = {
                "data": e.data, // informatia despre contract adaugata
                "userID": userID_fromSession,
                "action": "addContract"
            };
            setTimeout(function(){
                console.log("asdfgh");
                $(".dx-toolbar-button:nth-of-type(1) span").text("Add");
            });
            // Adaugam in BD
            contracts_action_editAddDelete(json_toSend);
            // updatam tabelul, ca sa ia si  contractID din BD, pentru ca se creeaza cand ajunge in bd, nu are de unde sa o ia, deci luam toata informatia din nou
            get_table_data();
            
        },

        onRowUpdating: function(e) {
            console.log("aici incepe editarea");
            
            var json_toSend = {
                "data": e.oldData, // oldData este un obiect care contine toti parametrii din baza de date, cu update-ul facut
                "userID": userID_fromSession,
                "action": "editContract"
            };
            contracts_action_editAddDelete(json_toSend);
        },
        onEditingStart: function(e) {
            // settimeout ca sa aiba popup-ul timp sa apara mai intai, ca sa aiba ce sa modifice
            setTimeout(function(){
                // Div-ul in care se afla titlul de la popup-ul de editare
                $(".dx-datagrid-edit-popup .dx-toolbar-label .dx-item-content div").text("Edit contract");
                // $(".dx-toolbar-button:nth-of-type(1) span").text("");
                // $(".dx-toolbar-button:nth-of-type(2) span").text("");
            }); 
         
        },
        onCellPrepared: function(e) {

        },
        // event pentru textarea la contract short description
        onEditorPreparing: function(e) {
            if (e.parentType == "dataRow" && e.dataField == "ContractShortDescription") {
                e.editorName = "dxTextArea";
                e.colSpan = 2;
            }

                
        },
        onRowRemoved: function(e) {
            console.log(e.data.ContractID, userID_fromSession);
            var json_toSend = {
                "contractID": e.data.ContractID,
                "userID": userID_fromSession,
                "action": "deleteContract"
            };
            contracts_action_editAddDelete(json_toSend);
        }
    }); // end dxdatagrid
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
            console.log("errrr");
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


