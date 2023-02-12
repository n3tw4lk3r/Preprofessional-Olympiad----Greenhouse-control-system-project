// Не забыть добавить токен в заголовок всех запросов
// axios.defaults.headers.common["X-Auth-Token"] = "<token>"

let T = null;
let H = null;
let Hb = null;

// данные с датчиков
let air_temp = [null, null, null, null];
let air_hum = [null, null, null, null];
let soil_hum = [null, null, null, null, null, null];

// состояния систем
let watering = null;
let fork_drive = null;
let soil_watering = [null, null, null, null, null, null];

// средние значения

// т.к. по ТЗ хотят видеть динамику изменения средней температуры и влажности,
// считаю средние данные "в моменте", как среднее от данных всех датчиков
// влажности или температуры в момент запроса 

let temp_average = null;
let hum_average = null;

// для каждой бороздки почвы средняя влажность - сумма всех значений влажности,
// разделённая на общее кол-во запросов

// сумма всех значений влажности почвы
let soil_hum_total = [null, null, null, null, null, null];

// средняя влажность
let soil_hum_average = [null, null, null, null, null, null];

// сколько раз запрашивались данные (кол-во вызовов функции getSensorData)
let count = 0; 

let url_air = "http://91.240.84.86:5000/get?sensor_type=temp_hum&sensor_id=";
let url_soil = "http://91.240.84.86:5000/get?sensor_type=hum&sensor_id=";
let url_forkDrive = "http://91.240.84.86:5000/patch?target=fork_drive&state=";
let url_watering_open = "http://91.240.84.86:5000/patch?target=watering&state=1&id=";
let url_watering_close = "http://91.240.84.86:5000/patch?target=watering&state=0&id=";
let url_totalHum = "http://91.240.84.86:5000/patch?target=total_hum&state=";

function patchRequest(url, target, state, id) {
    if (target == watering) {
        axios.get(url+id.toString())
        .then(response => {
            alert(JSON.stringify(response.data));
        })
    }
    else {
        axios.get(url+state.toString())
        .then(response => {
            alert(JSON.stringify(response.data));
        })
    }
}

function setParam(name, param, data) {
    param = data;
    alert(name + " теперь " + param);
}

function getSensorData() {
    // функция была вызвана ещё раз
    count++;
    // получаем данные с каждого датчика, сохраняем в массивы air_temp и air_hum
    for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
        axios.get(url_air + (air_sensor_id + 1).toString())
            .then(response => {
                air_temp[air_sensor_id] = response.data.temperature;
                air_hum[air_sensor_id] = response.data.humidity;
            })
    }

    temp_average = (air_temp[0] + air_temp[1] + air_temp[2] + air_temp[3]) / 4;
    hum_average = (air_hum[0] + air_hum[1] + air_hum[2] + air_hum[3]) / 4;

    for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
        axios.get(url_soil + (soil_sensor_id + 1).toString())
            .then(response => {
                soil_hum[soil_sensor_id] = response.data.humidity;
                soil_hum_total[soil_sensor_id] += response.data.humidity;
                soil_hum_average[soil_sensor_id] = soil_hum_total[soil_sensor_id] / count;
            })
    }

}

function createChart_soil(divId, data_hum) {
    Plotly.plot(divId, [{
        y: [data_hum],
        type: 'line'
    }]);
}

function createChart_air(divId, data_hum, data_temp) {
    Plotly.plot(divId,
        [{
                y: [data_hum],
                type: 'line',
                name: "Влажность",
            },
            {
                y: [data_temp],
                type: 'line',
                name: "Температура"
            }
        ],
    );
}

function updateChart_soil(divId, data_hum) {
    Plotly.extendTraces(divId, {
        y: [
            [data_hum]
        ]
    }, [0]);
}

function updateChart_air(divId, data_hum, data_temp) {
    Plotly.extendTraces(divId, {
        y: [
            [data_hum],
            [data_temp]
        ]
    }, [0, 1]);
}

// получаем первые данные с датчиков
getSensorData();

// регулярно запрашиваем новые
setInterval(async () => {
    getSensorData()
}, 200);

// создаём графики
for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
    createChart_soil('chart_soil_' + (soil_sensor_id + 1).toString(),
        soil_hum[soil_sensor_id]
);
}
for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
    createChart_air('chart_air_' + (air_sensor_id + 1).toString(),
        air_hum[air_sensor_id], air_temp[air_sensor_id]
    );
}

// обновляем графики с учётом новых данных каждые N секунд

// ------------------------------------------------------------------------------
// код ниже "красивый", но он не работает... Придётся использовать "грязный"
/*
for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
    setInterval(updateChart_soil('chart_soil_' + (soil_sensor_id + 1).toString(),
            soil_hum[soil_sensor_id]), 200);
}
for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
    setInterval(updateChart_air('chart_air_' + (air_sensor_id + 1).toString(),
            air_hum[air_sensor_id], air_temp[air_sensor_id]), 200);
}
*/
// ------------------------------------------------------------------------------

setInterval(function() {
    Plotly.extendTraces('chart_soil_1', {
        y: [
            [soil_hum[0]]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_soil_2', {
        y: [
            [soil_hum[1]]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_soil_3', {
        y: [
            [soil_hum[2]]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_soil_4', {
        y: [
            [soil_hum[3]]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_soil_5', {
        y: [
            [soil_hum[4]]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_soil_6', {
        y: [
            [soil_hum[5]]
        ]
    }, [0]);
}, 200);

setInterval(function() {
    Plotly.extendTraces('chart_air_1', {
        y: [[air_hum[0]], [air_temp[0]]]
    }, [0, 1]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_air_2', {
        y: [[air_hum[1]], [air_temp[1]]]
    }, [0, 1]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_air_3', {
        y: [[air_hum[2]], [air_temp[2]]]
    }, [0, 1]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('chart_air_4', {
        y: [[air_hum[3]], [air_temp[3]]]
    }, [0, 1]);
}, 200);
