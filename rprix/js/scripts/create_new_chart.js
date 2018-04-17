
var chart_number = 0; // stocheaza cate charturi avem

function create_new_chart() {
    chart_number ++;
    // Verificam daca il adaugam inainte sau dupa. DE ADAUGAT
    // Cream un nou div in care afisam graficul, avand un id diferit
    var html_code = "<div class='chart-parent row justify-content-center mr-0 ml-0' style=''>" + 
                        "<div id='chart_div" + chart_number + "' class='chart-elem col-12' style='height: 300px;'> </div>" +
                    "</div>";
    $(".all-charts-after-this-div").append(html_code);

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Year', 'Temperatura', 'Umiditate'],
            ['2013',  10,      40],
            ['2014',  15,      46],
            ['2015',  35,      110],
            ['2014',  25,      54],
            ['2015',  26,      50],
            ['2016',  26.9,    24],
            ['2017',  29.3,    40],
            ['2018',  29,      60],
        ]);

        var options = {
            title: 'Grafic numarul' + chart_number ,
            hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
            vAxis: {minValue: 0},
            backgroundColor: {
                fill: 'rgb(173, 216, 230)',
                fillOpacity: 1
            },
            legend: { 
                position: 'top', 
                alignment: 'start' 
            },
            chartArea: {
                left: 30,
                right: 0,
                bottom: 40,
                top: 90, // ca sa aiba loc si titlul cu legenda
                width: '100%',
                height: 350,
            }
        };

        // chart_number contine al catalea chart este creat sa stie unde il afiseaza
        var chart = new google.visualization.AreaChart(document.getElementById('chart_div' + chart_number)); 
        // $(window).resize(function(){
        //     console.log("se intampla");
        // });
        chart.draw(data, options);
    }
} // END create_new_chart ()






