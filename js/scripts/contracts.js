// LINKURI UTILE
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Lookup/Templates/jQuery/Light/       a definit fiecare linie din lookup
// http://jsfiddle.net/o1qu92v2/     custom button in header 
// https://www.devexpress.com/Support/Center/Question/Details/T477153/dxselectbox-how-to-determine-if-the-user-click-on-clear-button          custom button click event(varianta 2, prima e cu un rand mai sus)
// https://codepen.io/anon/pen/MQPqOz?editors=0010     sa apesi in selectbox tab si sa iti dea continuarea
// https://www.devexpress.com/Support/Center/Question/Details/T451908/dxtextbox-how-to-get-a-value

// arrayOfValuesToBeFilteredFromHeaderCheckboxes este un vector in care fiecare element reprezinta o valoare de filtru. Eu iau toate aceste valori si din ele creez arrayOfFilters
var arrayOfValuesToBeFilteredFromHeaderCheckboxes = [];

$(function() {
    // luam privilegiile utilizatorului
    console.log(userID_fromSession);
    get_user_privileges(userID_fromSession);
    // Luam informatia pentru lookup-uri: contract type, status, responsables din edit/add
    getDataForDropdowns();
    setTimeout(() => {
        get_table_data();
    }, 100);

    $("#reset-workspace").click(function () {
        sessionStorage.clear();
        var dataGrid = $("#dataGrid").dxDataGrid('instance');
        dataGrid.state({});
        dataGrid.refresh();
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
    // i = 5 deleted
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
    $("#filter-by-status-deleted").click(function () {
        // Acum s-a apasat butonul de checked
        if ($("#filter-by-status-deleted").is(':checked'))
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[5] = 1;
                $(".checkbox-deleted").css("font-weight","Bold");
            }
        else 
            // acum s-a debifat
            // Pozitia reprezinta statusul iar valoarea 1 / 0 daca e activ filtrul sau nu
            {
                arrayOfValuesToBeFilteredFromHeaderCheckboxes[5] = 0;
                $(".checkbox-deleted").css("font-weight","Normal");
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
var statusTable, organizationTable, clientsTable, contractTypeTable, agentTable;
// editContractID e id ul contractului la care dau cancel, e global ca nu il am din e.data.id in eventul de close popup
var weCanEdit = 0, editContractID;
// id-urile contractelor si organizatiilor pe care le trimit in BD la add edit
var orgID = '', clientID = '';

// Aici este apelat devextreme si creeaza tabelul
function draw_table(table_data) 
{
    $("#dataGrid").dxDataGrid({
        dataSource: table_data,
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        columns: [
            {
                caption:'Row Number',
                cellTemplate: function(cellElement, cellInfo) {
                    cellElement.text(cellInfo.row.rowIndex + 1) // + 1 ca sa inceapa de la 1 ordinea
                },
                alignment: 'center',
            },{
                caption:'Contract ID',
                dataField:'ContractID',
                alignment: 'left',
                allowGrouping: true,
                alignment: 'center',
                visible: false
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
                caption:'Organization',
                dataField:'OrganizationName',
                alignment: 'center',
                allowGrouping: true,
                editCellTemplate: function (cellElement, cellInfo) {
                    // vedem valoarea initiala la isInvalid in functie de edit sau add
                    var notOnEditForm;
                    // verificam daca suntem pe edit sau nu
                    if ($(".input-organization").val() != '')
                        notOnEditForm = 0;
                    else notOnEditForm = 1;

                    window.organizationName = {
                        isInvalid: notOnEditForm,
                        aListener: function(val) {},
                        get a() {
                            return this.isInvalid;
                        },
                        set a(x) {
                            this.isInvalid = x;
                            this.aListener(x);
                        },
                        registerListener: function(listener) {
                            this.aListener = listener;
                        }
                    };

                    // console.log("cellelem:",cellElement,"cellinfo", cellInfo);
                    var div = document.createElement("div");
                    cellElement.get(0).appendChild(div);    

                    // Daca da search fara nimic scris o sa caute in BD cu undefined
                    // Daca e '' trebuie sa facem valueInvalid = 1 oricum
                    if (cellInfo.value == undefined || cellInfo.value == '') {
                        // Asta e varianta generalizata, dar ca sa avem flexibilitate, 
                        // punem direct organizatia romprix ca default pt ca o sa fie mereu folosita
                        // cellInfo.setValue('');      NU STERGE
                        // organizationName.a = 1;      NU STERGE
                        cellInfo.setValue('ROMPRIX EXIM SRL');
                        organizationName.a = 0;
                        orgID = 1; // id-ul organizatiei romprix
                    }

                    $(div)
                        .addClass("organization-div pos-relative")
                        // chestia aia cu interogarea este daca cumva apesi pe add contract si cellinfo e undefined. Atunci tu vrei sa apara spatiu, nu undefined
                        .append("<input class='input-organization input-edit-form' value='" + cellInfo.value + "' autocomplete='off' spellcheck='false' type='text'></input>")
                        .append("<button class='search-btt btn'><span class='fa fa-search'></span></button>")
                        .append("<i class='clear-text-icon fas fa-times-circle'></i>");

                    // se schimba valoarea inputului in timp ce scriem
                    $(".input-organization").on("change paste keyup", function() {
                        cellInfo.setValue($(this).val());
                        organizationName.a = 1; // nu e valida, trebuie selectat din BD
                        orgID = '';
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

                    $(".organization-div .clear-text-icon").click(() => {
                        cellInfo.setValue('');
                        $(".input-organization").val("");
                        organizationName.a = 1;
                        orgID = '';
                    });

                    // Eventul pentru ceva ce nu exista inca se face cu document
                    // Event pentru cand apsam pe elementele din lista si vrem sa schimbam valoarea
                    $(document).on('click', '.organization-li', function() {
                        var newValue = $(this).children(".value").text(); // textul de pe linia din lista
                        cellInfo.setValue(newValue);
                        $(".input-organization").val(newValue);
                        organizationName.a = 0;
                        orgID = $(this).children(".id").text();
                    });

                    // Trebuie sa stergem lista daca apasam pe containerul de edit sau selectam ceva din lista
                    // Functioneaza si pentr dropdownul de clienti
                    $(".dx-overlay-content").click(() => {
                        $("table.dropdown-input").remove();   
                        $("div.table-header").remove();
                    });
                } // end edit celltemplate
            },
            {
                caption:'Client',
                dataField:'ClientName',
                alignment: 'left',
                allowGrouping: true,
                editCellTemplate: function (cellElement, cellInfo) {
                    // vedem valoarea initiala la isInvalid in functie de edit sau add
                    var notOnEditForm;
                    // verificam daca suntem pe edit sau nu
                    if ($(".input-client").val() != '')
                        notOnEditForm = 0;
                    else notOnEditForm = 1;

                    window.clientName = {
                        isInvalid: notOnEditForm,
                        aListener: function(val) {},
                        get a() {
                            return this.isInvalid;
                        },
                        set a(x) {
                            this.isInvalid = x;
                            this.aListener(x);
                        },
                        registerListener: function(listener) {
                            this.aListener = listener;
                        }
                    };

                    // console.log("cellelem:",cellElement,"cellinfo", cellInfo);
                    var div = document.createElement("div");
                    cellElement.get(0).appendChild(div);    

                    // Daca da search fara nimic scris o sa caute in BD cu undefined
                    if (cellInfo.value == undefined || cellInfo.value == '') {
                        cellInfo.setValue('');
                        clientName.a = 1;
                        clientID = '';
                    }

                    $(div)
                        .addClass("client-div pos-relative")
                        .append("<input class='input-client input-edit-form' value='" + cellInfo.value + "' autocomplete='off' spellcheck='false' type='text'></input>")
                        .append("<button class='search-btt btn'><span class='fa fa-search'></span></button>")
                        .append("<i class='clear-text-icon fas fa-times-circle'></i>");

                    // se schimba valoarea inputului in timp ce scriem
                    $(".input-client").on("change paste keyup", function() {
                        cellInfo.setValue($(this).val());
                        clientName.a = 1; // nu e valida, trebuie selectat din BD
                        clientID = '';
                    });

                    $(".client-div .clear-text-icon").click(function() {
                        $(".input-client").val("");
                        cellInfo.setValue('');
                        clientName.a = 1;
                        clientID = '';
                    });
                    
                    $(".client-div button.search-btt")
                        .on("click", () => {
                            getDBDataBasedOnValue(
                                cellInfo.value, // valoarea din input
                                1, // filtrul "contains"
                                cellInfo.column.dataField  // numele coloanei
                            );
                        });

                    // Event pentru cand apsam pe elementele din lista si vrem sa schimbam valoarea
                    $(document).on('click', '.client-li', function() {
                        var newValue = $(this).children(".value").text(); // textul de pe linia din lista
                        cellInfo.setValue(newValue);
                        $(".input-client").val(newValue);
                        clientName.a = 0;
                        clientID = $(this).children(".id").text();
                    });
                } // end edit celltemplate
            },
            {
                caption:'Contract Name',
                dataField:'ContractName',
                allowGrouping: true,
                alignment: 'left',
            },
            {
                caption:'Contract Type',
                dataField:'ContractTypeID',
                alignment: 'center',
                allowGrouping: true,
                lookup: {
                    dataSource: contractTypeTable,
                    displayExpr: "Value",
                    valueExpr: "RowID"
                },
            },
            {
                caption:'Status',
                dataField:'ContractStatusID',
                alignment: 'center',
                allowFiltering: false,
                allowHeaderFiltering: true,
                allowGrouping: true,
                lookup: {
                    dataSource: statusTable,
                    displayExpr: "Value",
                    valueExpr: "RowID"
                },
            },
            {
                caption:'Responsable',
                dataField:'ResponsableID',
                alignment: 'center',
                allowFiltering: false,
                allowHeaderFiltering: true,
                allowGrouping: true,
                lookup: {
                    dataSource: agentTable,
                    displayExpr: "Value",
                    valueExpr: "RowID"
                },
                visible: false
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
                        dataField: "ContractTypeID" 
                    }]
                },
                {
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
                    itemType: "group",
                    colSpan: 1,
                    items: [{ 
                        dataField: "ResponsableID",
                        editorOptions: {
                            width: 197
                        },
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
                    // checkboxul de multiadd
                    itemType: "group",
                    colSpan: 2,
                    template: function(data, itemElement) {
                        setTimeout(() => {
                            // vedem valoarea initiala la isInvalid in functie de edit sau add
                            var notOnEditForm2;
                            // verificam daca suntem pe edit sau nu
                            if ($("input[id$='ContractName']").val() != '')
                                notOnEditForm2 = 0;
                            else notOnEditForm2 = 1;

                            window.contractName = {
                                isInvalid: notOnEditForm2,
                                aListener: function(val) {},
                                get a() {
                                    return this.isInvalid;
                                },
                                set a(x) {
                                    this.isInvalid = x;
                                    this.aListener(x);
                                },
                                registerListener: function(listener) {
                                    this.aListener = listener;
                                }
                            };

                            $(document).on("change paste keyup", "input[id$='ContractName']", function() {
                                if ($(this).val() != '') {
                                    // e bun
                                    contractName.a = 0; 
                                } else {
                                    contractName.a = 1;
                                }
                            });

                            // vedem valoarea initiala la isInvalid in functie de edit sau add
                            var notOnEditForm1;
                            // verificam daca suntem pe edit sau nu
                            if ($("input[id$='ContractNumberIn']").val() != '' && $("input[id$='ContractNumberIn']").val() != undefined) {
                                notOnEditForm1 = 0;
                            } else {
                                notOnEditForm1 = 1;
                            }

                            window.contractNumberIn = {
                                isInvalid: notOnEditForm1,
                                aListener: function(val) {},
                                get a() {
                                    return this.isInvalid;
                                },
                                set a(x) {
                                    this.isInvalid = x;
                                    this.aListener(x);
                                },
                                registerListener: function(listener) {
                                    this.aListener = listener;
                                }
                            };
                        
                            $(document).on("change paste keyup", "input[id$='ContractNumberIn']", function() {
                                if ($(this).val() != '' && $(this).val() != undefined) {
                                    // e bun
                                    contractNumberIn.a = 0; 
                                } else {
                                    contractNumberIn.a = 1;
                                } 
                            });
                        
                            // Bagam wrap la inputul contractName ca sa punem afisa notify, altfel nu merge
                            $("input[id$='ContractName'] + div").wrapAll("<div class='contract-name-notifier'> </div>");

                            function verifyInputs(val) {
                                // console.log("se verifica inputurile");
                                // Daca totul e ok il lasam sa apese
                                if (contractName.a == 0 && 
                                    clientName.a == 0 &&
                                    contractNumberIn.a == 0 &&
                                    organizationName.a == 0 && 
                                    $("input[id$='ContractBeginDate']").parent().siblings("input[type='hidden']").val() != ''
                                ) {
                                    $("div.add-contract-container").removeClass("add-contract-btn-notifier");
                                    $("div.add-contract-container > div").removeClass("pointer-e-none");
                                    $("div.edit-contract-container").removeClass("edit-contract-btn-notifier");
                                    $("div.edit-contract-container > div").removeClass("pointer-e-none");
                                } else {
                                    // blocam butonul de add contract
                                    $("div.edit-contract-container").addClass("edit-contract-btn-notifier");
                                    $("div.edit-contract-container > div").addClass("pointer-e-none"); 
                                    $("div.add-contract-container").addClass("add-contract-btn-notifier");
                                    $("div.add-contract-container > div").addClass("pointer-e-none"); 
                                }
                            }

                            // pentru ca nu am putut face event pentru valoarea din inputul de date
                            // jeg de bug sau ce o fi, e imposibil
                            // verificam la fiecare 2 sec in ce stare se afla inputul.... asta e
                            // functia asta e facuta doar pentru begindate, restul functioneaza sif ara ea
                            // stopdatetime e ca sa opresc rularea functiei daca termin cu popupul
                            // chestia asta cu stopdatetime merge
                            // ideea e ca degeaba ii dau valoarea 1 ca ajunge iar aici si recontinua
                            // deci ii dau valoarea 1 daca fac addRow, mai ajunge odata FARA SA VREAU
                            // si cand ajunge devine 2, aici se opreste pentru ca asa trebuie
                            // si dacaapas din nou pe addrow, din 2 devine 0 si incepe de la capat
                            // cu alte cuvinte imi intra odata fara sa vreau si asa scap de posibilitatea aia
                            // console.log("datetimeout =", stopDateTimeTimeout);
                            if (typeof stopDateTimeTimeout == 'undefined')
                                window.stopDateTimeTimeout = 0;
                            else if (stopDateTimeTimeout == 1)
                                stopDateTimeTimeout = 2; 
                            else if (stopDateTimeTimeout == 2)
                                stopDateTimeTimeout = 0;
                                // am folosit timeout ca cica e mai bine decat settimer
                            function repeatTheExecution(){
                                // console.log(stopDateTimeTimeout);
                                if (stopDateTimeTimeout == 0) {
                                    // console.log("contractNumberIn",contractNumberIn.a, "contractName", contractName.a, "clientName", clientName.a, "organizationName", organizationName.a, "begindate",      $("input[id$='ContractBeginDate']").parent().siblings("input[type='hidden']").val());

                                    verifyInputs();
                                    setTimeout(repeatTheExecution, 500);
                                }
                            }
                            repeatTheExecution();

                            // Daca valoarea din input se schimba din invalid in valid
                            // sau invers, verificam daca punem debloca 'add contract'
                            contractNumberIn.registerListener(function (val) {
                                verifyInputs(val);
                            });
                            organizationName.registerListener(function (val) {
                                verifyInputs(val);
                            });
                            clientName.registerListener(function (val) {
                                verifyInputs(val);
                            });
                            contractName.registerListener(function (val) {
                                verifyInputs(val);
                            });

                            // 2 eventuri pentru butoanele de close si X
                            // merg pe edit si pe add
                            $(document).on("click", "div[aria-label='Cancel'] span:contains('Cancel'), div[aria-label='close'] i.dx-icon-close", function() {
                                stopDateTimeTimeout = 2;
                                organizationName = undefined;
                                contractNumberIn = undefined;
                                clientName = undefined;
                                contractName = undefined;
                                delete(contractName);
                                delete(contractNumberIn);
                                delete(organizationName);
                                delete(clientName);
                                // wecanedit la contracte ... cazul in care dam close la popup, trebuie pusa valoarea pe 0
                                window.weCanEdit = 0;
                                verifyEditStatus(userID_fromSession, editContractID, 3, null);
                                clientID = '';
                                orgID = '';
                                
                                // Vladimir
                             
                                $.ajax({
                                    type: 'POST',
                                    data: { Token: rndString },
                                    url: "phpScripts/DeleteFileFromServerIfClosePopup.php",
                                    dataType:"json"
                                });
                                
                                window.rndString = undefined;
                                delete window.rndString;   
                            
                            });//$(document).on("click", "div[aria-label='Cancel'] span:contains('Cancel'), div[aria-label='close'] i.dx-icon-close", function()
                        }); // end settimeout
                    } // end template: function(data, itemElement)
                } , {
                    itemType: "group",
                    colSpan: 1,
                    template: function(data, itemElement) {
                        if (typeof rndString === 'undefined' || rndString == '') {
                            var stringLength = 15;
                            var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','!','?'];
                            window.rndString = "";
                            console.log(rndString);
                            for (var i = 1; i < stringLength; i++) { 
                                var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
                                rndString = rndString + stringArray[rndNum];
                            }
                            console.log(rndString)
                        }
                        
                        var div = document.createElement("div");
                        itemElement.get(0).appendChild(div);
                        $(div).append("<button id = \"upload-button\" class = \"button\">Add contract file<img src=\"../img/contract-icon.png\" class=\"img-fluid contract-image\"></button>");
                        $( "#upload-button" ).click(function() {
                          alertify.confirm().set({
                                              'maximizable': true,
                                            //   'basic':true,
                                              'title':'Upload contract',
                                              'closableByDimmer': false,
                                              'defaultFocus':false,
                                              'labels':{'cancel':'','ok':''},
                                              'resizable': true,
                                              'autoReset': true ,   
                                              'transition':'none',
                                            //   'defaultFocus': 'ok',
                                            'message':'<form enctype="multipart/form-data"><input id = "ChooseFileButton" name="file" class="mb-5" type="file" multiple="true" /><br/><label for=\"ContractDescription\">Contract file description:</label><textarea class=\"form-control mb-5\" id=\"ContractDescription\" name=\"description\" rows=\"3\"></textarea><div class=\"d-flex justify-content-center\"><input type="button" id = "UploadButton" value="Upload Contract"/></div></form>',
                                              'onshow':function()
                                              {  
                                                // console.log(rndString);
                                                $(".ajs-ok").css({'display':'none'});
                                                $(".ajs-cancel").css({'display':'none'});
                                                $(".ajs-dialog").css({'height':'500px'});
                                              },
                                            }).show();
                                        $("#UploadButton").click(function(){
                                            /* Now send the gathered files data to our backend server */
                                            var form = $('#form')[0]; // You need to use standard javascript object here
                                            
                                            var formData = new FormData(form);
                                            $.each($("input[type='file']")[0].files, function(i, file) {
                                                formData.append('file' + i, $('input[type=file]')[0].files[i]);
                                            });//end of $.each($("input[type='file']")[0].files, function(i, file)
                                            formData.append('fileDescription',$("textarea#ContractDescription").val());
                                            formData.append('UserIDUpload',userID_fromSession);
                                            formData.append('fileToken',rndString);
                                            $.ajax({
                                                type: 'POST',
                                                cache: false,
                                                data: formData,
                                                url: 'upload-contracts.php',
                                                dataType:"json",
                                                processData: false,
                                                contentType: false,
                                                
                                            }).done((rezultat) => {
                                                switch (rezultat.WasUploaded) {
                                                case 0 :
                                                    $("[class^='alertify']").remove();
                                                    alertify.error('An error has been occurred.');
                                                    console.log('cazul 0');
                                                    break;
                                                case 1:
                                                    $("[class^='alertify']").remove();
                                                    alertify.success('Contract was uploaded with succes.'); 
                                                    console.log('cazul 1');
                                                    break;
                                                case 2:
                                                    $("[class^='alertify']").remove();
                                                    alertify.error('No files selected. Plese retry uploading.');
                                                    console.log('cazul 2');
                                                    break;
                                                }
                                            });// end of done
                                            alertify.confirm().close();
                                            this.form.reset();
                                    });//$(":button").click(function()
                      });//$( "#upload-button" ).click(function()
                    }// end of template: function(data, itemElement) 
                }, {
                    itemType: "group",
                    colSpan: 1,
                    template: function(data, itemElement) {
                      var div = document.createElement("div");
                      itemElement.get(0).appendChild(div);
                      $(div).append("<button id = \"upload-other-files-button\" class = \"button\">Add other files<img src=\"../img/contract-icon.png\" class=\"img-fluid contract-image\"></button>");
                      $( "#upload-other-files-button" ).click(function() {
                        // console.log(rndString);  
                          alertify.confirm().set({
                                              'maximizable': true,
                                              'title':'Upload other files',
                                              'closableByDimmer': false,
                                              'labels':{'cancel':''},
                                              'resizable': true,    
                                              'transition':'none',
                                              'message':'<form enctype="multipart/form-data"><input id = "ChooseFileButton" name="file" class="mb-5" type="file" multiple="true" /><br/><label for=\"ContractDescription\">File description:</label><textarea class=\"form-control mb-5\" id=\"ContractDescription\" name=\"description\" rows=\"3\"></textarea><div class=\"d-flex justify-content-center\"><input type="button" id = "UploadButton2" value="Upload Files"/></div></form>',
                                              'onshow':function()
                                              {  
                                                $(".ajs-ok").css({'display':'none'});
                                                $(".ajs-cancel").css({'display':'none'});
                                                $(".ajs-dialog").css({'height':'500px'}); 
                                              },
                                              'oncancel':function(){
                                                $('.ajs-hidden').each(function () {
                                                    $(this).remove();
                                                });       
                                              }
                                            }).show();
                                        // $("form").submit(function(){ event.preventDefault();});// sa nu se mai inchida popupul
                                        $("#UploadButton2").click(function(){
                                            // /* Now send the gathered files data to our backend server */
                                            var form = $('#form')[0]; // You need to use standard javascript object here
                                            var formData = new FormData(form);
                                            $.each($("input[type='file']")[0].files, function(i, file) {
                                                formData.append('otherfile' + i, $('input[type=file]')[0].files[i]);
                                            });//end of $.each($("input[type='file']")[0].files, function(i, file)
                                            formData.append('fileDescription',$("textarea#ContractDescription").val());
                                            formData.append('UserIDUpload',userID_fromSession);
                                            formData.append('fileToken',rndString);
                                            $.ajax({
                                                type: 'POST',
                                                cache: false,
                                                data: formData,
                                                url: 'upload-other-files.php',
                                                dataType:"json",
                                                processData: false,
                                                contentType: false
                                            }).done((rezultat) => {
                                                switch (rezultat.WasUploaded) {
                                                case 0 :
                                                    $("[class^='alertify']").remove();
                                                    alertify.error('An error has been occurred.');
                                                    break;
                                                case 1:
                                                    $("[class^='alertify']").remove();
                                                    alertify.success('File was uploaded with succes.'); 
                                                    break;
                                                case 2:
                                                    $("[class^='alertify']").remove();
                                                    alertify.error('No files selected. Plese retry uploading.');
                                                    break;
                                                }//end switch
                                            });// end of done
                                            alertify.confirm().close();
                                            this.form.reset();
                                    });//$("#UploadButton2").click(function()
                      });//$( "#upload-other-files-button" ).click(function()
                    }// end of template: function(data, itemElement) 
                },
            ]}, // end form si ] se inchide items
            popup: {
                // animation: false,
                title: "Add contract",
                showTitle: true,
                width: 800,
                height: 800,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }               
            },
            texts: {
                deleteRow: 'Cancel', 
                addRow: "Add contract",
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
        columnHidingEnabled: true,
        filterRow: {
            visible: true
        },
        headerFilter: {
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
            if (info.rowType == 'data' )
            for (var key in info.cells)
            {
                if (info.cells[key].column['dataField'] == 'ContractStatusID')
                // coloram liniile in functie de status
                // switch (info.data.ContractStatusID) {
                //     case 1: 
                //         // canceled
                //         info.rowElement.css("background-color", "#AF7B98"); 
                //         break;
                //     case 2:
                //         // active
                //         info.rowElement.css("background-color", "#B1EDE8"); 
                //         break;
                //     case 3:
                //         // closed
                //         info.rowElement.css("background-color", "#FF99A3"); 
                //         break;
                //     case 4:
                //         // preliminary
                //         info.rowElement.css("background-color", "#EFCFAE"); 
                //         break; 
                //     case 5:
                //         // deleted
                //         info.rowElement.css("background-color", "#8B7696"); 
                //         break; 
                // } 
                switch (info.data.ContractStatusID) {
                    case 1: 
                        // canceled
                        info.cells[key].cellElement[0].bgColor = "#AF7B98"; 
                        break;
                    case 2:
                        // active
                        info.cells[key].cellElement[0].bgColor = "#B1EDE8"; 
                        break;
                    case 3:
                        // closed
                        info.cells[key].cellElement[0].bgColor = "#FF99A3"; 
                        break;
                    case 4:
                        // preliminary
                        info.cells[key].cellElement[0].bgColor = "#EFCFAE"; 
                        break; 
                    case 5:
                        // deleted
                        info.cells[key].cellElement[0].bgColor = "#8B7696"; 
                        break; 
                } 
            }
        },
        onContentReady: function (e) {
            // verificam privilegiile si scoatem optiunea de add
            if (!contractAddPrivilege) {
                $("span.dx-button-text:contains('Add contract')")
                    .closest("div[aria-label='Add contract']")
                    .css({"background-color": "#ccc9c9", "cursor": "context-menu", "pointer-events": "none"});
                $("i.dx-icon.dx-icon-edit-button-addrow").css("color", "#aaa9a9");
            }                                        
        },
        onRowRemoving: function(e) {
        },
        onRowInserted: function(e) { 
            // opresc timerul pentru timeoutul de la begindate doamne fereste
            stopDateTimeTimeout = 1;        
            console.log("al doilea",rndString);
            var jsonToSend = {
                "data": e.data, // informatia despre contract adaugata
                "userID": userID_fromSession,
                'FileToken':rndString,
                "action": "addContract"
            };

            // daca variabila globala orgid sau clientid e setat
            // atunci am selectat un id nou din dropdownuri, altfel il folosim pe cel vechi
            if (orgID != '') {
                jsonToSend.data.OrganizationID = orgID;
            }
            if (clientID != '') {
                jsonToSend.data.ContractClientID = clientID;
            }

            contracts_action_editAddDelete(jsonToSend);
            
            // update la tabel ca sa se genereze in BD contract ID
            setTimeout(() => {
                get_table_data();
            },100); 
        },
        onRowUpdating: function(e) {
            stopDateTimeTimeout = 1;
            // console.log("onrowupdating", e);

            var jsonToSend = {
                "data": e.oldData, 
                "userID": userID_fromSession,
                'FileToken':rndString,
                "action": "editContract"
            };

            // daca variabila globala orgid sau clientid e setat
            // atunci am selectat un id nou din dropdownuri, altfel il folosim pe cel vechi
            if (orgID != '') {
                jsonToSend.data.OrganizationID = orgID;
            }
            if (clientID != '') {
                jsonToSend.data.ContractClientID = clientID;
            }
            console.log("rowupdating json", jsonToSend);

            // luam toate valorile schimbate din newData 
            // si le punem peste valorile vechi
            for (var key in e.newData) 
                if (e.newData.hasOwnProperty(key)) {
                    jsonToSend.data[key] = e.newData[key];
                }

            contracts_action_editAddDelete(jsonToSend);
            setTimeout(() => {
                get_table_data();
            }, 100); 
        },
        onEditingStart: function(e) {
            // Pentru verificarea de edit pentru conflicte
            // Luam toate butoanele de edit si le dam o clasa + k
            // Luam clasele butonului pe carte suntem cu hover si luam a patra clasa, cea care ne intereseaza
            var k = 1, editBtnClass;
            $("a.dx-link.dx-link-edit.dx-icon-edit[title='Edit']").each(function() {
                $(this).addClass("current-edited-contract-" + k++);
                if ($(this).is(":hover")) {
                    editBtnClass ="." + $(this).attr("class").split(" ")[3];
                }
            });
            // Verificam statusul, cazul in care nu putem edita ca e cineva
            if (window.weCanEdit != 1) {
                editContractID = e.data.ContractID;
                verifyEditStatus(userID_fromSession, e.data.ContractID, 1, editBtnClass); 
            }
            
            // putem edita doar daca weCanEdit e 1
            if (window.weCanEdit == 0)
                e.cancel = true;
            //aici formez tokenul


            // settimeout ca sa aiba popup-ul timp sa apara mai intai, ca sa aiba ce sa modifice
            setTimeout(function() {
                // Div-ul in care se afla titlul de la popup-ul de editare
                $(".dx-datagrid-edit-popup .dx-toolbar-label .dx-item-content div").text("Edit contract");
            }); 
        },
        onEditorPreparing: function(e) {
            // console.log("editorpreparing");
            // event pentru textarea la contract short description
            if (e.parentType == "dataRow" && e.dataField == "ContractShortDescription") {
                e.editorName = "dxTextArea";
                e.colSpan = 2;
            }
        },
        onRowRemoved: function(e) {
            var jsonToSend = {
                "contractID": e.data.ContractID,
                "userID": userID_fromSession,
                "action": "deleteContract"
            };
            contracts_action_editAddDelete(jsonToSend);
            setTimeout(() => {
                get_table_data();
            },100); 
        },
        onCellPrepared: function(e) {
            // Privilegii de edit si delete
          	if (!contractEditPrivilege)
                e.cellElement
                    .find(".dx-link-edit")
                    .css({"color": "grey", "cursor": "context-menu", "pointer-events": "none"})
                    .attr({"title": "No priviledges"});
            if (!contractDeletePrivilege) 
                e.cellElement
                    .find(".dx-link-delete")
                    .css({"color": "grey", "cursor": "context-menu", "pointer-events": "none"})
                    .attr({"title": "No priviledges"});
        },
        onEditorPrepared: function(options) {
            // setam default value pentru contract type si status id pentru addRow, nu se seteaza daca sunt pe edit
            // cu typeof ne dam seama daca e definita nsau nu value
            if (options.parentType == 'dataRow' && options.dataField == 'ContractStatusID' && typeof options.value == 'undefined') {
                options.editorElement.dxSelectBox('instance').option('value', 4);
            }
            if (options.parentType == 'dataRow' && options.dataField == 'ContractTypeID' && typeof options.value == 'undefined') {
                options.editorElement.dxSelectBox('instance').option('value', 1);
            }

            if (options.parentType == 'dataRow' && options.dataField == 'ContractShortDescription' && typeof options.value == 'undefined') {
                setTimeout(() => {
                    // Schibam numele din Save in add contract 
                    $("div.dx-button-has-text[aria-label='Save'] span.dx-button-text").text("Add contract");
                });
            }
            if (options.parentType == 'dataRow' && options.dataField == 'ContractShortDescription') {
                setTimeout(() => {
                    // De asemenea facem add contract sa nu poata fi apasat
                    $("div.dx-button-has-text[aria-label='Save'] span.dx-button-text").closest("div.dx-item.dx-toolbar-item.dx-toolbar-button").wrapAll("<div class='add-contract-container add-contract-btn-notifier'><div class='pointer-e-none'></div></div>");
                    $("div.dx-button-has-text[aria-label='Save'] span.dx-button-text").closest("div.dx-item.dx-toolbar-item.dx-toolbar-button").addClass("BLABLA").wrapAll("<div class='edit-contract-container edit-contract-btn-notifier'><div class='pointer-e-none'></div></div>");

                    // click pe butonul de add contract, notifier exista doar daca nu se poate adauga
                    $("div.add-contract-btn-notifier, div.edit-contract-btn-notifier").click(function() {
                        // verificam contractBeginDate daca are sau nu ca sa afisam eroare
                        if ($("input[id$='ContractBeginDate']").parent().siblings("input[type='hidden']").val() == '') {
                            $("input[id$='ContractBeginDate']").parent().notify(
                                "Start Date is invalid !", 
                                { position:"bottom",
                                autoHideDelay: 1500, }
                            );
                            $("input[id$='ContractBeginDate']").focus();
                        }
                        // number in
                        if (contractNumberIn.a == 1) {
                            $("input[id$='ContractNumberIn']").parent().notify(
                                "Invalid contract number in !",
                                { position:"bottom",
                                autoHideDelay: 1500, }
                            );
                            $("input[id$='ContractNumberIn']").focus();
                        }
                        // client name
                        if (clientName.a == 1) {
                            $("input.input-client").notify(
                                "Use the search button !",
                                { position:"bottom",
                                autoHideDelay: 1500, }
                            );
                            $("input.input-client").focus();
                        }
                        // contract name 
                        if (contractName.a == 1) {
                            $("input[id$='ContractName']").parent().notify(
                                "Invalid contract name !",
                                { position:"bottom",
                                autoHideDelay: 1500, }
                            );
                            $("input[id$='ContractName']").focus();
                        }
                        // organization name
                        if (organizationName.a == 1) {
                            $("input.input-organization").notify(
                                "Use the search button !",
                                { position:"bottom",
                                autoHideDelay: 1500, }
                            );
                            $("input.input-organization").focus();
                        }

                        // afisare pe butonul de add sau edit
                        $(this).notify(
                            "Check for errors !", 
                            { position:"top",
                            autoHideDelay: 1500, }
                        );
                    });
                }); // end setTimeout
            }
        }
    }); // end dxdatagrid
}

// luam privilegiile utilizatorului
function get_user_privileges(userID) 
{
    jsonToSend = {
        "userID": userID
    };

    $.ajax({
        type: "POST",
        url: "phpScripts/getUserPrivileges.php",
        data: {myData: JSON.stringify(jsonToSend)}, // json_filter e global
        dataType: "json",
        success: function(response) 
        {
            // console.log("response", response);
            for (var i = 0; i < Object.keys(response).length; i++) {
                // Creem variabile globale pe baza privilegiilor
                if (response.hasOwnProperty(i))
                    // console.log(response[i]);
                    switch(response[i].PrivilegeName) {
                        case "ContractAdd":
                            window.contractAddPrivilege = response[i].PrivilegeValue;
                            break;
                        case "ContractEdit":
                            window.contractEditPrivilege = response[i].PrivilegeValue;
                            break;
                        case "ContractDelete":
                            window.contractDeletePrivilege = response[i].PrivilegeValue;
                            break;
                        case "ContractEditOverwrite":
                            window.contractEditOverwritePrivilege = response[i].PrivilegeValue;
                            break;
                    }
            }
            // console.log(contractAddPrivilege, contractEditPrivilege, contractDeletePrivilege, contractEditOverwritePrivilege);
        },
        error: function(xhr, status, text) {
            console.log(xhr.status,"-------",status,"---------",text);
        }
    });
}


// Trimit valoarea, filtrul si coloana din BD. Mi se intorc toate valorile care coincid
function getDBDataBasedOnValue(value, filter, columnName) 
{
    var jsonToSend = {
        "value": value, // stringul inserat de utilizator in textbox
        "filter": filter, // tipul filtrului
        "columnName": columnName
    };
    // console.log(jsonToSend);

    var numberOfElements;

    // getting the number of elements
    $.ajax({
        type: "POST",
        url: "phpScripts/getNumberOfElements.php",
        data: {myData: JSON.stringify(jsonToSend)},
        dataType: "json",
        success: function(response) {
            // console.log("response", response);
            numberOfElements = response.NumberOfElementsSearchedByValue;
            // Daca a gasit macar un element
            if (numberOfElements && numberOfElements < 100) {
                // console.log("Nr de elemente", numberOfElements);
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
                        // console.log("nu merge sa primesti elementele");
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

    // Punem headerul tabelului si creem tabelul
    $(sourceInput).after(
        "<div class='table-header'><span class='width-290px d-inline-block'>" + columnName + "</span><span class='width-290px d-inline-block'>Address</span></div><table class='dropdown-input'></table>"
    );
    
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            // Atribuim lista doar inputului de sub divul nostru, avem doua inputuri care se numesc la fel in 2 divuri diferite
            $(sourceDiv + " table.dropdown-input").append("<tr class='" + listElementClass + " dropdown-element-editform'> <td class='value'>" + data[property][columnName] + "</td><td>" + data[property]['Address'] + "</td><td class='d-none id'>" + data[property]['RowID'] + "</td></tr>");
        }
    }

} // end sendDataToDropdown

// Functie apelata din eventul de add/edit/delete contracts din dxdatagrid 
function contracts_action_editAddDelete(newjson) 
{
    console.log("addedit", newjson);
    console.log(rndString);
    $.ajax({
        type: "POST",
        url: "phpScripts/addEditDelete_contracts_fromDB.php",
        data: {myData: JSON.stringify(newjson)}, // json_filter e global
        dataType: "json",
        success: function(returned_data) 
        {
            console.log(returned_data);
            // nu merge editul ca mi-a dat cineva overwrite deci nu pot duce editul la capat
            if (newjson.action == 'editContract' && returned_data[0] == 0)
                    alertify.alert().set({
                        'basic': true,
                        'closableByDimmer': true,
                        'transition': 'none',
                        'closable' : true,
                        'message': "Edit failed ! Someone overwrote your attempt to edit the contract !",
                    }).show();
            else if (newjson.action == 'addContract') {
                // Stergem tokenul pentru ca am terminat cu el
                window.rndString = undefined;
                delete window.rndString;
            }
                
        },
        error: function() {
            // console.log("contracts_action_editAddDelete  ajax a dat eroare. daca e incompleta informatia s-a adaugat oricum");
            // console.log("Ori nu merge, ori s-a dat add fara toti parametrii, dar oricum se baga bine in BD deci np");
        }
    }); // end ajax
}

// Functie care verifica statusul editului
// actionID = in functie de valoare se face verificare, se scoate booleanul sau se incepe editarea
// editbtnclass e clasa butonului de edit pe care am apasat, e diferita la toate
function verifyEditStatus(userID, contractID, actionID, editBtnClass) 
{
    let jsonToSend = {
        'userID': userID,
        'contractID': contractID,
        'actionID': actionID
    };
    $.ajax({
        type: "POST",
        url: "phpScripts/verifyEditStatus.php",
        data: {myData: JSON.stringify(jsonToSend)}, 
        dataType: "json",
        success: function(returned_data) 
        {
            // console.log("data from DB", returned_data);

            // returned data[0] pt ca e o linie returnata din BD
            switch (actionID) {
                case 1: // Verificam daca cineva editeaza
                    if (returned_data[0].IsEditing) {
                        // cineva editeaza !
                        if (contractEditOverwritePrivilege) {
                            // avem privilegiu de overwrite, intrebam daca vrea sa continue
                            alertify.confirm().set({
                                'message': 'Start editing time:    <b>' + returned_data[0].EditBeginDate + '</b> <br />Are you sure you want to overwrite ?',
                                'closableByDimmer': false,
                                'title': "<i><ins>" + returned_data[0].FirstName + " " + returned_data[0].LastName +  "</ins></i> is already editing this contract !",
                                'transition': 'none',
                                'closable' : false,
                                'labels': {
                                    'ok': 'Yes', 
                                    'cancel': 'No'
                                },   
                                'onshow': function() {    
                                    $(".ajs-ok").css({'display':'initial'});
                                    $(".ajs-cancel").css({'display':'initial'}); 
                                    $(".ajs-dialog").css({'height':'225px'});
                                    // $(".ajs-dialog").css({'display':'initial'}); 
                                    // $(".ajs-content").css({'display':'initial'}); 
                                   },
                                'onok': function() {
                                    verifyEditStatus(userID, contractID, 2, editBtnClass); 
                                },
                                'oncancel': function() {
                                }
                            }).show();
                        } else {
                            // Nu are voie sa editeze, e ocupat contractul
                            alertify.alert().set({
                                'basic': true,
                                'closableByDimmer': true,
                                'transition': 'none',
                                'closable' : true,
                                'message': "<i><ins>" + returned_data[0].FirstName + " " + returned_data[0].LastName +  "</ins></i> is already editing this contract !" + '<br /> Start editing time:    <b>' + returned_data[0].EditBeginDate + '</b>',
                                'onshow': function() {    
                                    $(".ajs-ok").css({'display':'initial'});
                                    $(".ajs-cancel").css({'display':'initial'}); 
                                    $(".ajs-dialog").css({'height':'200px'}); 
                                    $(".ajs-content").css({'overflow':'hidden'});
                                    // $(".ajs-content").css({'display':'initial'}); 
                                   },
                            }).show();
                            window.weCanEdit = 0;
                        }
                    } else {
                        // nimeni nu editeaza
                        window.weCanEdit = 1;
                        $(editBtnClass).click();                        
                    }
                    break;
                case 2: // a apasat ok si intram cu overwrite pe editare
                    window.weCanEdit = 1;
                    $(editBtnClass).click();
                    break;
            }
        },
        error: function() {
            console.log("nu merge");
        }
    }); // end ajax
}

// luam toata tabela de contracte din BD
function get_table_data()
{
    var jsonToSend = {
        'userID': userID_fromSession
    };
    $.ajax({
        type: "POST",
        url: "phpScripts/get_table_data.php",
        data: {myData: JSON.stringify(jsonToSend)},
        dataType: "json",
        success: function(returned_data) 
        {
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

// Luam valorile din BD pentru contract type si status din edit popup si add
function getDataForDropdowns()
{
    $.ajax({
        type: "POST",
        url: "phpScripts/getDataForLookups.php",
        success: function(returned_data) {
            var object_returned = JSON.parse(returned_data);
            statusTable = [];
            contractTypeTable = [];
            agentTable = [];
            i = j = k = 0;
            for (var key in object_returned) {
                if (!object_returned.hasOwnProperty(key)) 
                    continue;
                if (object_returned[key]['ColumnName'] == 'StatusName') {
                    statusTable[i++] = object_returned[key];
                } else if (object_returned[key]['ColumnName'] == 'ContractType') {
                    contractTypeTable[j++] = object_returned[key];
                } else if (object_returned[key]['ColumnName'] == 'AgentName') {
                    agentTable[k++] = object_returned[key];
                }
            } 
        },
        error: function(xhr, status, text) {
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
            // console.log(returned_data);
        },
        error: function(xhr, status, text) {
                console.log(xhr.status,"-------",status,"---------",text);
        }
    }); // end ajax
}




