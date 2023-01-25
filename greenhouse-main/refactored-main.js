// Не забыть добавить токен в заголовок всех запросов
// axios.defaults.headers.common["X-Auth-Token"] = "<token>"

// данные с датчиков
let air_temp = [];
let air_hum = [];
let soil_hum = [];

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

for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
    setInterval(updateChart_soil('chart_soil_' + (soil_sensor_id + 1).toString(),
            soil_hum[soil_sensor_id]),
        200);
}
for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
    setInterval(updateChart_air('chart_air_1' + (air_sensor_id + 1).toString(),
            air_hum[air_sensor_id], air_temp[air_sensor_id]),
        200);
}
