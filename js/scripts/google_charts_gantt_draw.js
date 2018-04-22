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
                trackHeight: 30,
                palette:[
                    //https://github.com/google/google-visualization-issues/issues/2199
                    { // pentru active
                      "color": "green",
                      "dark": "#006400",
                      "light": "lightgreen"
                    },
                    { // pentru expired
                      "color": "#fc3d32",
                      "dark": "#a12830",
                      "light": "lightred"
                    },
                    { // pentru deleted
                      "color": "#000000",
                      "dark": "#000000",
                      "light": "#000000"
                    },
                    {
                      "color": "#0f9d58",
                      "dark": "#0b8043",
                      "light": "#b7e1cd"
                    },
                    {
                      "color": "#ab47bc",
                      "dark": "#6a1b9a",
                      "light": "#e1bee7"
                    },
                    {
                      "color": "#00acc1",
                      "dark": "#00838f",
                      "light": "#b2ebf2"
                    },
                    {
                      "color": "#ff7043",
                      "dark": "#e64a19",
                      "light": "#ffccbc"
                    },
                    {
                      "color": "#9e9d24",
                      "dark": "#827717",
                      "light": "#f0f4c3"
                    },
                    {
                      "color": "#5c6bc0",
                      "dark": "#3949ab",
                      "light": "#c5cae9"
                    },
                    {
                      "color": "#f06292",
                      "dark": "#e91e63",
                      "light": "#f8bbd0"
                    },
                    {
                      "color": "#00796b",
                      "dark": "#004d40",
                      "light": "#b2dfdb"
                    },
                    {
                      "color": "#c2185b",
                      "dark": "#880e4f",
                      "light": "#f48fb1"
                    }
                  ]
            },
            backgroundColor: {
                'fill': '#9DD1F1'
            },
        };

        var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
        
        chart.draw(data, options);
    } // end function drawChart()
} // end gantt_chart_draw
  