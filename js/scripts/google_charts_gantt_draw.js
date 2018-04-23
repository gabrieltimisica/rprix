function gantt_chart_draw(chart_data)
{
    google.charts.load('current', {'packages':['gantt']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Task ID');
        data.addColumn('string', 'Task Name');
        data.addColumn('string', 'Resource');
        data.addColumn('date', 'Start Date');
        data.addColumn('date', 'End Date');
        data.addColumn('number', 'Duration');
        data.addColumn('number', 'Percent Complete');
        data.addColumn('string', 'Dependencies');

        for(var i = 0; i < chart_data.length; i ++)
        {
            chart_data[i][0] = chart_data[i][0].toString(); // contract id to string
            chart_data[i][3] = new Date(chart_data[i][3]); //startdate; in BD data e string, chartul are nevoie de un date corect, facut cu new date
            chart_data[i][4] = new Date(chart_data[i][4]); //end date
        }

        data.addRows(chart_data);

        var options = {
            height: 400,
            gantt: {
                trackHeight: 30
            },
            backgroundColor: {
                'fill': '#9DD1F1'
            },
        };

        var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
        
        chart.draw(data, options);
    } // end function drawChart()
} // end gantt_chart_draw
  