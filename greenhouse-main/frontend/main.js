// Не забыть добавить токен в заголовок всех запросов
axios.defaults.headers.common["X-Auth-Token"] = "hBE8lk"

// данные с датчиков
let air_temp = [null, null, null, null];
let air_hum = [null, null, null, null];
let soil_hum = [null, null, null, null, null, null];

// состояния систем
let watering = null;
let fork_drive = null;
let soil_watering = [null, null, null, null, null, null];
let emergencyMode = null;

// параметры
let T = null;
let H = null;
let Hb = null;

// последние показания датчиков (используется очередь)
let queue_lastAirHum = [
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]
];
let queue_lastAirTemp = [
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]
];
let queue_lastSoilHum = [
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]
];
let queue_lastAverageAirHum = ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"];
let queue_lastAverageAirTemp = ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"];
let queue_lastAverageSoilHum = [
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"],
    ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]
];

// средние значения
let average_air_temp = null;
let average_air_hum = null;

// считаю средние показатели влажности бороздок как среднее арифметическое
let soil_hum_total = [null, null, null, null, null, null]; // сумма значений
let count = 0; // кол-во сохранённых значений (кол-во вызовов функции getSensorData)
let soil_hum_average = [null, null, null, null, null, null]; // итоговое среднее

let url_air = "http://91.240.84.86:5000/get?sensor_type=temp_hum&sensor_id=";
let url_soil = "http://91.240.84.86:5000/get?sensor_type=hum&sensor_id=";
let url_forkDrive = "http://91.240.84.86:5000/patch?target=fork_drive&state=";
let url_watering_open = "http://91.240.84.86:5000/patch?target=watering&state=1&id=";
let url_watering_close = "http://91.240.84.86:5000/patch?target=watering&state=0&id=";
let url_totalHum = "http://91.240.84.86:5000/patch?target=total_hum&state=";


function setInitialSystemStates() {
    // получаем состояние систем и параметров с бэкенд-сервера
    axios.get("http://91.240.84.86:5000/get-state?parameter=T")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        T = Number(state);
        document.getElementById("currentT").innerHTML = "Параметр T = " + T.toString();
    })
    axios.get("http://91.240.84.86:5000/get-state?parameter=H")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        H = Number(state);
        document.getElementById("currentH").innerHTML = "Параметр H = " + H.toString();
    })
    axios.get("http://91.240.84.86:5000/get-state?parameter=Hb")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        Hb = Number(state);
        document.getElementById("currentHb").innerHTML = "Параметр Hb = " + Hb.toString();
    })
    axios.get("http://91.240.84.86:5000/get-state?parameter=watering")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        watering = Number(state);
        if (watering == 1) {
            document.getElementById("currentWatering").innerHTML = "Общее увлажнение включено";
        }
        else if (watering == 0) {
            document.getElementById("currentWatering").innerHTML = "Общее увлажнение отключено";
        }
    })
    axios.get("http://91.240.84.86:5000/get-state?parameter=fork_drive")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        fork_drive = Number(state);
        if (fork_drive == 1) {
            document.getElementById("currentForkDrive").innerHTML = "Форточки открыты";
        }
        else if (watering == 0) {
            document.getElementById("currentForkDrive").innerHTML = "Форточки закрыты";
        }
    })
    axios.get("http://91.240.84.86:5000/get-state?parameter=soil_watering")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        for (let i=0; i<6; i++) {
            soil_watering[i] = Number(state[i]);
            divId = "soilWateringSwitch" + (i+1).toString();
            if (state[i] == 1) {
                document.getElementById(divId).checked = true;
            }
            else if (state[i] == 0) {
                document.getElementById(divId).checked = false;
            }
        }
    })
    axios.get("http://91.240.84.86:5000/get-state?parameter=emergencyMode")
    .then(response => {
        state = (JSON.stringify(response.data).split(":")[1]).split("}")[0]
        emergencyMode = Number(state);
        if (emergencyMode == 1) {
            document.getElementById("emergencyModeOnOff").checked = true;
        }
        else if (emergencyMode == 0) {
            document.getElementById("emergencyModeOnOff").checked = false;
        }
    })
}
setInitialSystemStates();
function patchRequest(url, target, state, id) {
    // path-запрос к API организаторов
    // на самом деле делает get-запрос к бэкенду, а бэкенд уже делает patch
    if (target == "watering") {
        axios.get(url+id.toString())
        
    }
    else if (target == "fork_drive") {
        axios.get("http://91.240.84.86:5000/save-state?parameter=fork_drive&state="+state.toString())
        axios.get(url+state.toString())
        .then(response => {
            if (JSON.stringify(response.data).split(' ')[5] == 'open"}') {
                document.getElementById("currentForkDrive").innerHTML = "Форточки открыты";
            }
            else {
                document.getElementById("currentForkDrive").innerHTML = "Форточки закрыты";
            }
        })
    }
    else if (target == "total_hum") {
        axios.get("http://91.240.84.86:5000/save-state?parameter=watering&state="+state.toString())
        axios.get(url+state.toString())
        .then(response => {
            if (JSON.stringify(response.data).split(' ')[5] == 'start"}') {
                document.getElementById("currentWatering").innerHTML = "Общее увлажнение включено";
            }
            else {
                document.getElementById("currentWatering").innerHTML = "Общее увлажнение отключено";
            }
        })
    }
}


function getSensorData() {
    // функция была вызвана ещё раз (учитываем при подсчёте средней влажности)
    count++;
    // получаем и сохраняем данные с каждого датчика
    for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
        axios.get(url_air + (air_sensor_id + 1).toString())
            .then(response => {
                air_temp[air_sensor_id] = response.data.temperature;
                queue_lastAirTemp[air_sensor_id].push(response.data.temperature);
                queue_lastAirTemp[air_sensor_id].shift();
                air_hum[air_sensor_id] = response.data.humidity;
                queue_lastAirHum[air_sensor_id].push(response.data.humidity);
                queue_lastAirHum[air_sensor_id].shift();
                
            })
    }

    average_air_temp = ((air_temp[0] + air_temp[1] + air_temp[2] + air_temp[3]) / 4).toFixed(2);
    if (average_air_temp > T || emergencyMode == 1) {
        document.getElementById("forkDriveOn").disabled = false;
    }
    else if (average_air_temp < T) {
        document.getElementById("forkDriveOn").disabled = true;
    }

    queue_lastAverageAirTemp.push(average_air_temp);
    queue_lastAverageAirTemp.shift();

    average_air_hum = ((air_hum[0] + air_hum[1] + air_hum[2] + air_hum[3]) / 4).toFixed(2);
    if (average_air_hum < H || emergencyMode == 1) {
        document.getElementById("wateringOn").disabled = false;
    }
    else if (average_air_hum > H) {
        document.getElementById("wateringOn").disabled = true;
    }
    
    queue_lastAverageAirHum.push(average_air_hum);
    queue_lastAverageAirHum.shift();

    for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
        axios.get(url_soil + (soil_sensor_id + 1).toString())
            .then(response => {
                soil_hum[soil_sensor_id] = response.data.humidity;
                queue_lastSoilHum[soil_sensor_id].push(response.data.humidity);
                queue_lastSoilHum[soil_sensor_id].shift();
                soil_hum_total[soil_sensor_id] += response.data.humidity;

                soil_hum_average[soil_sensor_id] = (soil_hum_total[soil_sensor_id] / count).toFixed(2);
                if (soil_hum_average[soil_sensor_id] < Hb || emergencyMode == 1) {
                    document.getElementById("soilWateringSwitch" + (soil_sensor_id+1).toString()).disabled = false;
                }
                else if (soil_hum_average[soil_sensor_id] > Hb && emergencyMode == 0) {
                    document.getElementById("soilWateringSwitch" + (soil_sensor_id+1).toString()).disabled = true;
                }

                queue_lastAverageSoilHum[soil_sensor_id].push(soil_hum_average[soil_sensor_id]);
                queue_lastAverageSoilHum[soil_sensor_id].shift();
            })
    }

}

function createChart_soil(divId, data_hum) {
    Plotly.plot(divId, [{
        y: [data_hum],
        type: 'line'
    }]);
}
function setParameter(parameter, data) {
    if (parameter == "T") {
        T = data;
        document.getElementById("currentT").innerHTML = "Параметр T = " + T.toString();
        axios.get("http://91.240.84.86:5000/save-state?parameter=T&state="+T)
    }
    else if (parameter == "H") {
        H = data;
        document.getElementById("currentH").innerHTML = "Параметр H = " + H.toString();
        axios.get("http://91.240.84.86:5000/save-state?parameter=H&state="+H);
        
    }
    else {
        Hb = data;
        document.getElementById("currentHb").innerHTML = "Параметр Hb = " + Hb.toString();
        axios.get("http://91.240.84.86:5000/save-state?parameter=Hb&state="+Hb);

    }
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

function serveCSV() {
    axios({
        url: 'http://91.240.84.86:5000/exportDB',
        method: 'GET',
        responseType: 'blob',
    }).then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'sensordata.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    });
}

setInterval(async () => {
    getSensorData()
}, 1000);

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
Plotly.plot('chart_average_soil',
    [{
        y: [queue_lastAverageSoilHum[0][-1]],
        type: 'line',
        name: "Бороздка 1",
    },
    {
        y: [queue_lastAverageSoilHum[1][-1]],
        type: 'line',
        name: "Бороздка 2",
    },
    {
        y: [queue_lastAverageSoilHum[2][-1]],
        type: 'line',
        name: "Бороздка 3",
    },
    {
        y: [queue_lastAverageSoilHum[3][-1]],
        type: 'line',
        name: "Бороздка 4",
    },
    {
        y: [queue_lastAverageSoilHum[4][-1]],
        type: 'line',
        name: "Бороздка 5",
    },
    {
        y: [queue_lastAverageSoilHum[5][-1]],
        type: 'line',
        name: "Бороздка 6",
    }
    ],
);
createChart_air('chart_average_air',
        queue_lastAverageAirHum[-1], queue_lastAverageAirTemp[-1]
    );

// обновляем графики и таблицу с учётом новых данных каждые N секунд
for (let soil_sensor_id = 0; soil_sensor_id < 6; soil_sensor_id++) {
    let idChart = 'chart_soil_' + (soil_sensor_id + 1).toString();
    let idTable = 'lastSoilHum' + (soil_sensor_id + 1).toString();
    setInterval(function() {
        Plotly.extendTraces(idChart, {
            y: [
                [soil_hum[soil_sensor_id]]
            ]
        }, [0]);
        document.getElementById(idTable).innerHTML = queue_lastSoilHum[soil_sensor_id].join(' ');
    }, 1000);
}
for (let air_sensor_id = 0; air_sensor_id < 4; air_sensor_id++) {
    let idChart= 'chart_air_' + (air_sensor_id + 1).toString();
    let idTableTemp = 'lastAirTemp' + (air_sensor_id + 1).toString();
    let idTableHum = 'lastAirHum' + (air_sensor_id + 1).toString();
    setInterval(function() {
        Plotly.extendTraces(idChart, {
            y: [[air_hum[air_sensor_id]], [air_temp[air_sensor_id]]]
        }, [0, 1]);
        document.getElementById(idTableTemp).innerHTML = queue_lastAirTemp[air_sensor_id].join(' ');
        document.getElementById(idTableHum).innerHTML = queue_lastAirHum[air_sensor_id].join(' ');
        document.getElementById('lastAverageAirTemp').innerHTML = queue_lastAverageAirTemp.join(' ');
        document.getElementById('lastAverageAirHum').innerHTML = queue_lastAverageAirHum.join(' ');
    }, 1000);
}

setInterval(function() {
    let data = '';
    for (let i=0; i<6; i++) {
        data = data + queue_lastAverageSoilHum[i].join(' ') + "<br>";
    }
    document.getElementById('lastAverageSoilHum').innerHTML = data;
}, 1000);


setInterval(function() {
    Plotly.extendTraces('chart_average_air', {
        y: [
            [queue_lastAverageAirHum[9]],
            [queue_lastAverageAirTemp[9]]
        ]
    }, [0, 1]);
}, 1000);


setInterval(function() {
    Plotly.extendTraces('chart_average_soil', {
        y: [
            [queue_lastAverageSoilHum[0][9]],
            [queue_lastAverageSoilHum[1][9]],
            [queue_lastAverageSoilHum[2][9]],
            [queue_lastAverageSoilHum[3][9]],
            [queue_lastAverageSoilHum[4][9]],
            [queue_lastAverageSoilHum[5][9]],
        ]
    }, [0, 1, 2, 3, 4, 5]);
}, 1000);

document.querySelector(".emergencyModeSwitch").addEventListener("change", function(){
    emergencyMode = emergencyMode ? 0 : 1;
    axios.get("http://91.240.84.86:5000/save-state?parameter=emergencyMode&state="+emergencyMode.toString())
})

for (let i=0; i<6; i++) {
    divId = "soilWateringSwitch" + (i+1).toString();
    document.getElementById(divId).addEventListener("change", function(){
        soil_watering[i] = soil_watering[i] ? false : true;
        if (soil_watering[i] == 1) {
            patchRequest(url_watering_open, 'watering', 1, i+1);
            axios.get("http://91.240.84.86:5000/save-state?parameter=soil_watering&state="+soil_watering)
        }
        else if (soil_watering[i] == 0) {
            patchRequest(url_watering_close, 'watering', 1, i+1);
            axios.get("http://91.240.84.86:5000/save-state?parameter=soil_watering&state="+soil_watering)
        }
    })
}


