// LINKURI UTILE
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Lookup/Templates/jQuery/Light/       a definit fiecare linie din lookup
// http://jsfiddle.net/o1qu92v2/     custom button in header 
// https://www.devexpress.com/Support/Center/Question/Details/T477153/dxselectbox-how-to-determine-if-the-user-click-on-clear-button          custom button click event(varianta 2, prima e cu un rand mai sus)
// https://codepen.io/anon/pen/MQPqOz?editors=0010     sa apesi in selectbox tab si sa iti dea continuarea
// https://www.devexpress.com/Support/Center/Question/Details/T451908/dxtextbox-how-to-get-a-value

// arrayOfValuesToBeFilteredFromHeaderCheckboxes este un vector in care fiecare element reprezinta o valoare de filtru. Eu iau toate aceste valori si din ele creez arrayOfFilters
var arrayOfValuesToBeFilteredFromHeaderCheckboxes = [];

$(function() {
    get_table_data();

    // setam checkboxul in functie de cum era setat inainte
    // variabila continuewhereileft este primita din sesiune
    // var dataGrid = $("#dataGrid").dxDataGrid('instance');
    // if (continueWhereILeft == 1) {
    //     $("#save-workspace-checkbox").prop('checked', true);
    //     dataGrid.option("stateStoring.enabled", true);
    // } else {
    //     $("#save-workspace-checkbox").prop('checked', false);
    //     dataGrid.option("stateStoring.enabled", false);
    // }
    // vedem daca el vrea sau nu sa i se salveze workspace ul

    $("button #reset-workspace").click(function () {
        sessionStorage.clear();
        var dataGrid = $("#dataGrid").dxDataGrid('instance');
        dataGrid.option("stateStoring.enabled", false);
    });
    $("#save-workspace-checkbox").click(function () {
        var dataGrid = $("#dataGrid").dxDataGrid('instance');
        // Acum s-a apasat butonul de checked
        if ($(this).is(':checked')) {
            dataGrid.option("stateStoring.enabled", true);
            changeSessionVar('saveWorkspaceOnExit', 1);
        } else { 
            // acum s-a debifat
            dataGrid.option("stateStoring.enabled", false);
            changeSessionVar('saveWorkspaceOnExit', 0);
        }

    });

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
var statusTable, organizationTable, clientsTable, contractTypeTable;

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
            },{
                caption:'Contract ID',
                dataField:'ContractID',
                alignment: 'left',
                allowGrouping: true
            },{
            //     caption:'Organization',
            //     dataField:'OrganizationName',
            //     allowGrouping: true,
            //     editCellTemplate: function (cellElement, cellInfo) {
            //         console.log("cellelem:",cellElement,"cellinfo", cellInfo);
            //         var div = document.createElement("div");
            //         cellElement.get(0).appendChild(div);
            //         $selectbox = $(div).dxSelectBox({
            //             acceptCustomValue: true,
            //             showClearButton: true, // nu muta in textbox ca atunci cand dai clear o sa dea valoarea veche din cauyza la onvaluechanged
            //             placeholder: "Type a name and press search",
            //             openOnFieldClick: false, // ca sa facem prevent la dropdown cand apasam pe container
            //             hoverStateEnabled: true,  // sa nu se inegreasca dropdownul cand faci hover
            //             searchEnabled: true, // ca sa poata scrie in search, nu doar sa selecteze din dropdown
            //             onValueChanged: function (e) {
            //                 cellInfo.setValue(e.value);
            //                 console.log("valuechanged");
            //             },
            //             fieldTemplate: function (value) {
            //                 var $container = $("<div>");
            //                 var $input = $("<div>").dxTextBox({
            //                     text: cellInfo.value, // default value sa fie cel din datagrid
            //                     onValueChanged: function (e) {
            //                         // daca dai search cu o valoare neschimbata, functioneaza onclick la buton si apare dropdownul
            //                         // primul search cu o valoare schimbata face un fire event la onvaluechanged, nu si la onclick de la buton
            //                         // e un bug de la ei cred
            //                         // daca dai de 2 ori sau mai mult cu aceeasi valoare, se intampla dropdownu de fiecare data
            //                         // click eventul asta e ca sa se intample si in cazul in care dau primul search si se intampla valuechanged, nu si onclickul de la buton
            //                         console.log("value changed---------------------------", e);
            //                         var x = $("#orgSelectBox").dxSelectBox('instance').option();
            //                         console.log("x=",x);
            //                         if (!$("#orgSelectBox").dxSelectBox('instance').option("opened"))
            //                             $("#orgSearchButton").click();
            //                         else $("#orgSelectBox").dxSelectBox('instance').close();
            //                     },
            //                 }).attr("id", "orgTextBoxFromSelectBox");
            //                 var $customButton = $("<div>").dxButton({
            //                     // text: "Custom",
            //                     icon: "search",
            //                     onClick: function (args) {
            //                         console.log("buton apsat");
            //                         // nu stiu ce face e.prevent si stop
            //                         var e = args.event; 
            //                         e.preventDefault();
            //                         e.stopPropagation();
            //                         var textBoxInstance = $input.dxTextBox('instance');
            //                         var selectBoxInstance = $(div).dxSelectBox('instance');
            //                         // selectBoxInstance.close();
            //                         // console.log("valuee=", textBoxInstance.option('text'));
            //                         getDBDataBasedOnValue(
            //                             textBoxInstance,
            //                             selectBoxInstance,
            //                             "asdf",
            //                             "OrganizationName"
            //                         );
            //                     }
            //                 }).attr("id", "orgSearchButton")
            //                 .css({
            //                     position: "absolute",
            //                     right: "0",
            //                     top: "0"
            //                 }); // end customButton
            //                 $container.append($input).append($customButton);
            //                 return $container;
            //             }, // end fieldTemplate
            //             onItemClick: function(e) {
            //                 console.log("itemclick", e);
            //                 var textBoxInstance = $("#orgTextBoxFromSelectBox").dxTextBox('instance');
            //                 textBoxInstance.option("value", e.itemData);
            //                 var selectBoxInstance = $("#orgSelectBox").dxSelectBox('instance');
            //                 selectBoxInstance.option("value", e.itemData);
            //             },
            //             onSelectionChanged: function (e) {
            //                 // Schimbam valoarea cand apasam pe un item din dropdown
            //                 var textBoxInstance = $("#orgTextBoxFromSelectBox").dxTextBox('instance');
            //                 textBoxInstance.option("value", e.selectedItem);
            //                 var selectBoxInstance = $("#orgSelectBox").dxSelectBox('instance');
            //                 selectBoxInstance.option("value", e.selectedItem);
            //             },
            //             onOptionChanged: function (e) {
            //                 console.log("onOptionChanged", e);
                            
            //                 // if (e.name == "dataSource" && e.fullName == "dataSource" && e.component.NAME == "dxSelectBox" && e.element[0].id == "orgSelectBox") {
            //                 // //     var textBoxInstance = $("#orgTextBoxFromSelectBox").dxTextBox('instance');
            //                 // //     textBoxInstance.option("value", e.value);
            //                 // //     var selectBoxInstance = $("#orgSelectBox").dxSelectBox('instance');
            //                 // // selectBoxInstance.option("value", e.selectedItem);
            //                 // // $("#orgSearchButton").click();
                            
            //                 // }
            //             }
            //         }).attr("id", "orgSelectBox")
            //         .find(".dx-texteditor-buttons-container").css({"display": "none", "pointer-events": "none"}); // ca sa dam hidden la dropdown icon
            //         // end selectbox
            //     } // end editCellTemplate
            // },
            // ,{
                // TEST
                caption:'Organization',
                dataField:'OrganizationName',
                alignment: 'center',
                allowGrouping: true,
                editCellTemplate: function (cellElement, cellInfo) {
                    // Sa nu apese save cu o valoare scrisa care nu este selectata din dropdown
                    // Cand apasa pe un element din lista, acesta devine 0. Cand scrie ceva devine 1;
                    window.organizationValueInvalid = 0; 
                    // console.log("cellelem:",cellElement,"cellinfo", cellInfo);
                    var div = document.createElement("div");
                    cellElement.get(0).appendChild(div);    

                    // Daca da search fara nimic scris o sa caute in BD cu undefined
                    // Daca e '' trebuie sa facem valueInvalid = 1 oricum
                    if (cellInfo.value == undefined || cellInfo.value == '') {
                        cellInfo.setValue('');
                        clientValueInvalid = 1;
                    }                       

                    $(div)
                        .addClass("organization-div pos-relative")
                        // chestia aia cu interogarea este daca cumva apesi pe add contract si cellinfo e undefined. Atunci tu vrei sa apara spatiu, nu undefined
                        .append("<input class='input-organization input-edit-form' value='" + cellInfo.value + "' autocomplete='off' spellcheck='false' type='text'></input>")
                        .append("<button class='search-btt btn'><span class='fa fa-search'></span></button>");

                    // se schimba valoarea inputului in timp ce scriem
                    $(".input-organization").on("change paste keyup", function() {
                        cellInfo.setValue($(this).val());
                        organizationValueInvalid = 1; // nu e valida, trebuie selectat din BD
                    });
                    
                    // butonul de search
                    $(".organization-div button.search-btt")
                        .on("click", () => {
                            getDBDataBasedOnValue(
                                cellInfo.value, // valoarea din input
                                1, // filtrul "contains"
                                cellInfo.column.dataField  // numele coloanei
                            );
                        });

                    // Eventul pentru ceva ce nu exista inca se face cu document
                    // Event pentru cand apsam pe elementele din lista si vrem sa schimbam valoarea
                    $(document).on('click', '.organization-li', function() {
                        var newValue = $(this).text(); // textul de pe linia din lista
                        cellInfo.setValue(newValue);
                        $(".input-organization").val(newValue);
                        organizationValueInvalid = 0;
                    });


                    // Trebuie sa stergem lista daca apasam pe containerul de edit sau selectam ceva din lista
                    $(".dx-overlay-content").click(() => {
                            $("ul.dropdown-input").remove();                    
                    });

                    // $(document).on('click', ".dx-popup-normal div.dx-button[aria-label='Save']", function(e) {
                    //     if (organizationValueInvalid || clientValueInvalid) {
                    //         $(this).css({"pointer-events": "none"});
                    //         // e.stopPropagation();
                    //         console.log("save apasat");
                    //     }     
                    // });

                } // end edit celltemplate
            },
            {
                caption:'Client',
                dataField:'ClientName',
                alignment: 'center',
                allowGrouping: true,
                editCellTemplate: function (cellElement, cellInfo) {
                    // Sa nu apese save cu o valoare scrisa care nu este selectata din dropdown
                    // Cand apasa pe un element din lista, acesta devine 0. Cand scrie ceva devine 1;
                    window.clientValueInvalid = 0; 

                    // console.log("cellelem:",cellElement,"cellinfo", cellInfo);
                    var div = document.createElement("div");
                    cellElement.get(0).appendChild(div);    

                    // Daca da search fara nimic scris o sa caute in BD cu undefined
                    if (cellInfo.value == undefined || cellInfo.value == '') {
                        cellInfo.setValue('');
                        clientValueInvalid = 1;
                        console.log("valueinvalid ", clientValueInvalid);
                    }
                        

                    $(div)
                        .addClass("client-div pos-relative")
                        // chestia aia cu interogarea este daca cumva apesi pe add contract si cellinfo e undefined. Atunci tu vrei sa apara spatiu, nu undefined
                        .append("<input class='input-client input-edit-form' value='" + cellInfo.value + "' autocomplete='off' spellcheck='false' type='text'></input>")
                        .append("<button class='search-btt btn'><span class='fa fa-search'></span></button>");

                    // se schimba valoarea inputului in timp ce scriem
                    $(".input-client").on("change paste keyup", function() {
                        cellInfo.setValue($(this).val());
                        clientValueInvalid = 1; // nu e valida, trebuie selectat din BD
                    });
                    
                    // butonul de search
                    $(".client-div button.search-btt")
                        .on("click", () => {
                            getDBDataBasedOnValue(
                                cellInfo.value, // valoarea din input
                                1, // filtrul "contains"
                                cellInfo.column.dataField  // numele coloanei
                            );
                        });

                    // Eventul pentru ceva ce nu exista inca se face cu document
                    // Event pentru cand apsam pe elementele din lista si vrem sa schimbam valoarea
                    $(document).on('click', '.client-li', function() {
                        var newValue = $(this).text(); // textul de pe linia din lista
                        cellInfo.setValue(newValue);
                        $(".input-client").val(newValue);
                        clientValueInvalid = 0;
                        console.log("valueinvalid ", clientValueInvalid);
                    });

                    // Trebuie sa stergem lista daca apasam pe containerul de edit sau selectam ceva din lista
                    // $(".dx-overlay-content").click(() => {
                    //         $("ul.dropdown-input").remove();                    
                    // });
                } // end edit celltemplate
            },
            {
                
                caption:'Contract Name',
                dataField:'ContractName',
                allowGrouping: true
            },
            {
                caption:'Contract Type',
                dataField:'ContractType',
                alignment: 'center',
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
                alignment: 'center',
                dataType: 'date'
            },
            {
                caption:'Start Date',
                dataField:'ContractBeginDate',
                allowGrouping: true,
                alignment: 'center',
                format: 'dd/MM/yyyy',
                dataType: 'date',
                visible: false
            },
            {
                caption:'Add Date',
                dataField:'ContractAddDate',
                allowGrouping: true,
                dataType: 'datetime',
                alignment: 'center',
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
                        dataField: "OrganizationName",
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
            enabled: false,
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
            console.log(e);
            if (!organizationValueInvalid && !clientValueInvalid) {
                console.log("intra la add",organizationValueInvalid, clientValueInvalid);
                var jsonToSend = {
                    "data": e.data, // informatia despre contract adaugata
                    "userID": userID_fromSession,
                    "action": "addContract"
                };
                // Adaugam in BD
                contracts_action_editAddDelete(jsonToSend);
                // updatam tabelul, ca sa ia si  contractID din BD, pentru ca se creeaza cand ajunge in bd, nu are de unde sa o ia, deci luam toata informatia din nou
                get_table_data();
                // Stergem variabilele
                organizationValueInvalid = undefined;
                clientValueInvalid = undefined;
                delete(organizationValueInvalid);
                delete(clientValueInvalid);
            } else {
                // avem inputuri invalide, nu putem adauga
                if (e.key.OrganizationName == '') // da add si e gol campul
                    $(".organization-div .input-organization").notify(
                        "Don't leave me empty !",
                        { position:"bottom" }
                    );
                else if (organizationValueInvalid)
                    $(".organization-div .input-organization").notify(
                        "'" + e.key.OrganizationName + "' is not selected from the dropdown !", 
                        // "'" + e.key.OrganizationName + "' might not be a valid organization !", 
                        // "Select the organization from the dropdown !", 
                            { position:"bottom" }
                    );

                if (e.key.ClientName == '') // da save si e gol campul
                    $(".client-div .input-client").notify(
                        "Don't leave me empty !",
                        { position:"bottom" }
                    );
                else if (clientValueInvalid)
                    $(".client-div .input-client").notify(
                        "'" + e.key.ClientName + "' is not selected from the dropdown !", 
                        // "'" + e.key.ClientName + "' might not be a valid client !", 
                        // "Select the client from the dropdown !", 
                            { position:"bottom" }
                    );

                // $("div.dx-button[aria-label='Save']").click((event) => {
                //     console.log("se intamplaaaaa");
                //     // event.stopPropagation();
                // });

            } // end if
        },
        onRowUpdating: function(e) {
            console.log(e);
            // e.oldData contine ce era inainte, in console log apar updatate, e bug
            // e.newData contine doar field urile schimbate

            // Nu lasam sa dea save daca nu a selectat o valoare din dropdown
            if (!organizationValueInvalid && !clientValueInvalid) {
                var jsonToSend = {
                    "data": e.oldData, 
                    "userID": userID_fromSession,
                    "action": "editContract"
                };
                // luam toate valorile schimbate din newData 
                // si le punem peste valorile vechi
                for (var key in e.newData) 
                    if (e.newData.hasOwnProperty(key)) {
                        jsonToSend.data[key] = e.newData[key];
                    }
    
                console.log("jsontosend",jsonToSend);
                contracts_action_editAddDelete(jsonToSend);
                // Stergem variabilele
                organizationValueInvalid = undefined;
                clientValueInvalid = undefined;
                delete(organizationValueInvalid);
                delete(clientValueInvalid);
            } else {
                // avem inputuri invalide, nu putem salva
                // Nu dam save si nu inchidem formul
                if (e.newData.OrganizationName == '') // da save si e gol campul
                    $(".organization-div .input-organization").notify(
                        "Don't leave me empty !",
                        { position:"bottom" }
                    );
                else if (organizationValueInvalid)
                    $(".organization-div .input-organization").notify(
                        "'" + e.newData.OrganizationName + "' is not selected from the dropdown !", 
                        // "'" + e.newData.OrganizationName + "' might not be a valid organization !", 
                        // "Select the organization from the dropdown !", 
                            { position:"bottom" }
                    );

                if (e.newData.ClientName == '') // da save si e gol campul
                    $(".client-div .input-client").notify(
                        "Don't leave me empty !",
                        { position:"bottom" }
                    );
                else if (clientValueInvalid)
                    $(".client-div .input-client").notify(
                        "'" + e.newData.ClientName + "' is not selected from the dropdown !", 
                        // "'" + e.newData.ClientName + "' might not be a valid client !", 
                        // "Select the client from the dropdown !", 
                            { position:"bottom" }
                    );
                    e.cancel = true;
                
            } // end if

        },
        onEditingStart: function(e) {
            // settimeout ca sa aiba popup-ul timp sa apara mai intai, ca sa aiba ce sa modifice
            setTimeout(function() {
                // Div-ul in care se afla titlul de la popup-ul de editare
                $(".dx-datagrid-edit-popup .dx-toolbar-label .dx-item-content div").text("Edit contract");
                // $(".dx-toolbar-button:nth-of-type(1) span").text("");
                // $(".dx-toolbar-button:nth-of-type(2) span").text("");
            }); 
        },
        onContentReady: function(e) {

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
            var jsonToSend = {
                "contractID": e.data.ContractID,
                "userID": userID_fromSession,
                "action": "deleteContract"
            };
            contracts_action_editAddDelete(jsonToSend);
        }
    }); // end dxdatagrid
}




// Trimit valoarea, filtrul si coloana din BD. Mi se intorc toate valorile care coincid
function getDBDataBasedOnValue(value, filter, columnName) 
{
    console.log("intra");
    var jsonToSend = {
        "value": value, // stringul inserat de utilizator in textbox
        "filter": filter, // tipul filtrului
        "columnName": columnName
    };
    console.log(jsonToSend);

    var numberOfElements;

    // getting the number of elements
    $.ajax({
        type: "POST",
        url: "phpScripts/getNumberOfElements.php",
        data: {myData: JSON.stringify(jsonToSend)},
        dataType: "json",
        success: function(response) {
            console.log("response", response);
            numberOfElements = response.NumberOfElementsSearchedByValue;
            // Daca a gasit macar un element
            if (numberOfElements && numberOfElements < 100) {
                console.log("Nr de elemente", numberOfElements);
                $.ajax({
                    type: "POST",
                    url: "phpScripts/getDataFromString.php",
                    data: {myData: JSON.stringify(jsonToSend)}, // json_filter e global
                    dataType: "json",
                    success: function(dbResponse) 
                    {
                        console.log(dbResponse);
                        sendDataToDropdown(columnName, dbResponse);
                    },
                    error: function() {
                        console.log("nu merge sa primesti elementele");
                        // console.log("Ori nu merge, ori s-a dat add fara toti parametrii, dar oricum se baga bine in BD deci np");
                    }
                }); // end ajax to get the elements
            } else if (!numberOfElements){ // Niciun element
                switch (columnName) {
                    case 'OrganizationName': 
                        $(".input-organization").notify(
                            "0 elements found !", 
                            { position:"bottom" }
                        );
                        break;
                    case 'ClientName':
                        $(".input-client").notify(
                            "0 elements found !", 
                            { position:"bottom" }
                        );
                        break;
                }
            } else {
                // Prea multe elemente
                switch (columnName) {
                    case 'OrganizationName': 
                        $(".input-organization").notify(
                            numberOfElements + " found. Please be more specific and try again !", 
                            { position:"bottom" }
                        );
                        break;
                    case 'ClientName':
                        $(".input-client").notify(
                            numberOfElements + " found. Please be more specific and try again !", 
                            { position:"bottom" }
                        );
                        break;
                }
            } // end else

            
        }, // end succes
        error: function() {
        }
    }); // end ajax number of elements
}

// Avem informatia din baza de date si creem lista
function sendDataToDropdown(columnName, data) {
    var sourceInput, // clasa inputului
        sourceDiv, // divul parinte al listei
        listElementClass; // numele clasei pe care i-o dam fiecarui li. Folosim la click event
    // Vedem pe ce input ne aflam si care este divul parinte
    switch (columnName) {
        case 'OrganizationName':
            sourceInput = ".input-organization";
            sourceDiv = ".organization-div";
            listElementClass = 'organization-li';
            break;
        case 'ClientName':
            sourceInput = ".input-client";
            sourceDiv = ".client-div";
            listElementClass = 'client-li';
            break;
    }

    $(sourceInput).after(
        "<ul class='dropdown-input'></ul>"
    );
    
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            // Atribuim lista doar inputului de sub divul nostru, avem doua inputuri care se numesc la fel in 2 divuri diferite
            $(sourceDiv + " ul.dropdown-input").append("<li class='" + listElementClass + " dropdown-element-editform align-middle'>" + data[property][columnName] + "</li>");
            console.log(data[property][columnName]);
        }
    }

} // end sendDataToDropdown


// Functie apelata din eventul de add/edit/delete contracts din dxdatagrid 
function contracts_action_editAddDelete(newjson) 
{
    console.log("editareeee",newjson);
    $.ajax({
        type: "POST",
        url: "phpScripts/addEditDelete_contracts_fromDB.php",
        data: {myData: JSON.stringify(newjson)}, // json_filter e global
        dataType: "json",
        success: function(returned_data) 
        {
            console.log("merge");
        },
        error: function() {
            console.log("nu mere");
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
        // data: {myData: JSON.stringify({"nuConteazaCeEAici": null})}, // nu avem data
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
// Este facuta pentru dropdownurile contract type,
// pe care le ia din baza de date cand le afiseaza, 
// ca sa nu le mai definesc eu hardcodat

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

// functia schimba variabilele din sesiune
function changeSessionVar(sessionVarName, value) 
{
    //varName e $_SESSION[varName]
    var jsonToSend = {
        "varName": sessionVarName,
        "value": value
    };
    $.ajax({
        type: "POST",
        url: "phpScripts/changeSessionVar.php",
        data: {myData: JSON.stringify(jsonToSend)},
        success: function(returned_data) {
            console.log(returned_data);
        },
        error: function(xhr, status, text) {
                console.log(xhr.status,"-------",status,"---------",text);
        }
    }); // end ajax
}
