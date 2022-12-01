import * as login from '../../js/login.js';

async function start_chart() {
    let data = {
        "stay_in": login.getStayIn()
    }
    await fetch("../php/get_area.php", {
        method: "POST",
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            if (response['id']) {
                drawing_chart(response['data'], response['id']);
            }
        })
}

function drawing_chart(array, id) {
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
        name: 'Area',
        line: {
            shape: 'linear',
            color: '#ff7f0e',
            width: 1.5,
        },
        type: 'scatter'
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
        // 'displayModeBar': false,
        displaylogo: false,
    }
    Plotly.newPlot(areaChart, data, layout, config);
}

export { drawing_chart, start_chart };