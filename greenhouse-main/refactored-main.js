// Не забыть добавить токен в заголовок всех запросов
// axios.defaults.headers.common["X-Auth-Token"] = "<token>"

// данные с датчиков
let air_temp = [null, null, null, null];
let air_hum = [null, null, null, null];
let soil_hum = [null, null, null, null, null, null];

// URL API (используется proxy для обхода CORS)
let url_air = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/temp_hum/";
let url_soil = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/";
let url_forkDrive = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/fork_drive";
let url_watering = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/watering";
let url_totalHum = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/total_hum";

function getSensorData() {
    // получаем данные с каждого датчика, сохраняем в массивы air_temp и air_hum
    for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
        axios.get(url_air + (air_sensor_id + 1).toString())
            .then(response => {
                air_temp[air_sensor_id] = response.data.temperature;
                air_hum[air_sensor_id] = response.data.humidity;
            })
    }
    for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
        axios.get(url_soil + (soil_sensor_id + 1).toString())
            .then(response => {
                soil_hum[soil_sensor_id] = response.data.humidity;
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
    console.log('test1');
}

function updateChart_air(divId, data_hum, data_temp) {
    Plotly.extendTraces(divId, {
        y: [
            [data_hum],
            [data_temp]
        ]
    }, [0, 1]);
    console.log('test2');
}

// получаем первые данные с датчиков
getSensorData();

// регулярно запрашиваем новые
setInterval(async () => {
    await getSensorData()
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
    console.log(soil_sensor_id);
    setInterval(updateChart_soil('chart_soil_' + (soil_sensor_id + 1).toString(),
            soil_hum[soil_sensor_id]), 200);
}
for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
    console.log(air_sensor_id);
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
