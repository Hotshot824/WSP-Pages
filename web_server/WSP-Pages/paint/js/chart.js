import * as login from '../../js/login.js';

var chartData;
var index;

async function startChart() {
    let data = {
        "stay_in": login.getStayIn()
    }
    await fetch("../php/get_history.php", {
        method: "POST",
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            chartData = response['data'];
            if (response['id']) {
                drawingChart(response['data'], response['id']);
            }
        })
}

function drawingChart(array, id) {
    let areaChart = document.querySelector('#areaChart');
    let date = [];
    let area = [];
    for (let i = 0; i < array.length; i++) {
        date.push(array[i]['date'])
        area.push(array[i]['area'])
    }
    let data = [{
        x: date,
        y: area,
        mode: 'lines+markers',
        line: {
            shape: 'linear',
            color: '#ff7f0e',
            width: 1.5,
        },
        name: 'Scatter'
    }];
    let layout = {
        autosize: true,
        plot_bgcolor: "#FFF",
        title: {
            text: "Woundarea Daily for " + id,
            font: {
                family: 'Merriweather Sans',
                size: '5rem'
            },
            xref: 'paper',
            x: 0.50,
        },
        yaxis: { fixedrange: true },
        xaxis: { fixedrange: true }
    };
    let config = {
        'displayModeBar': false,
    }
    Plotly.newPlot(areaChart, data, layout, config);

    areaChart.on('plotly_click', function(data){
        let pts = '';
        for(let i=0; i < data.points.length; i++){
            index = data.points[i].pointIndex;
        }
        showHistoryPredict(index);
    });
}

async function showHistoryPredict(index) {
    document.querySelector('#modalHistoryResLabel').innerHTML = 'History for ' + chartData[index]['date'];
    let data = {
        "orignal": chartData[index]['original_img'],
        "predict": chartData[index]['predict_img'],
    }
    await fetch("../php/get_history_image.php", {
        method: "POST",
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            document.querySelector('#historyOriginal').src = response['original_img'];
            document.querySelector('#historyPredict').src = response['predict_img'];
            $('#modalHistoryRes').modal('show');
        })
}

export { drawingChart, startChart };