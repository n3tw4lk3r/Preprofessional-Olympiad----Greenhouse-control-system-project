// Не забыть: токен в заголовок всех запросов
// axios.defaults.headers.common["X-Auth-Token"] = "<token>"

// данные с датчиков
let air_1_temp = null;
let air_1_hum = null;
let air_2_temp = null;
let air_2_hum = null;
let air_3_temp = null;
let air_3_hum = null;
let air_4_temp = null;
let air_4_hum = null;
let soil_1_hum = null;
let soil_2_hum = null;
let soil_3_hum = null;
let soil_4_hum = null;
let soil_5_hum = null;
let soil_6_hum = null;

// URL API датчиков и т.п.
// (используется proxy для обхода CORS)
const air_1 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/temp_hum/1";
const air_2 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/temp_hum/2";
const air_3 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/temp_hum/3";
const air_4 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/temp_hum/4";
const soil_1 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/1";
const soil_2 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/2";
const soil_3 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/3";
const soil_4 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/4";
const soil_5 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/5";
const soil_6 = "https://api.codetabs.com/v1/proxy/?quest=https://dt.miet.ru/ppo_it/api/hum/6";

function getSensorData() {
    axios.get(air_1)
    .then(response => {
        air_1_temp = response.data.temperature;
        air_1_hum = response.data.humidity;
    })
    axios.get(air_2)
    .then(response => {
        air_2_temp = response.data.temperature;
        air_2_hum = response.data.humidity;
    })
    axios.get(air_3)
    .then(response => {
        air_3_temp = response.data.temperature;
        air_3_hum = response.data.humidity;
    })
    axios.get(air_4)
    .then(response => {
        air_4_temp = response.data.temperature;
        air_4_hum = response.data.humidity;
    })
    axios.get(soil_1)
    .then(response => {
        soil_1_hum = response.data.humidity;
    })
    axios.get(soil_2)
    .then(response => {
        soil_2_hum = response.data.humidity;
    })
    axios.get(soil_3)
    .then(response => {
        soil_3_hum = response.data.humidity;
    })
    axios.get(soil_4)
    .then(response => {
        soil_4_hum = response.data.humidity;
    })
    axios.get(soil_5)
    .then(response => {
        soil_5_hum = response.data.humidity;
    })
    axios.get(soil_6)
    .then(response => {
        soil_6_hum = response.data.humidity;
    })
}

getSensorData();
setInterval(async () => {
    await getSensorData()
}, 200);

Plotly.plot('soil_1_chart', [{
    y: [soil_1_hum],
    type: 'line'
}]);
Plotly.plot('soil_2_chart', [{
    y: [soil_2_hum],
    type: 'line'
}]);
Plotly.plot('soil_3_chart', [{
    y: [soil_3_hum],
    type: 'line'
}]);
Plotly.plot('soil_4_chart', [{
    y: [soil_4_hum],
    type: 'line'
}]);
Plotly.plot('soil_5_chart', [{
    y: [soil_5_hum],
    type: 'line'
}]);
Plotly.plot('soil_6_chart', [{
    y: [soil_6_hum],
    type: 'line'
}]);

Plotly.plot('air_1_chart', 
    [{
        y: [air_1_hum],
        type: 'line',
        name: "Влажность",
    }, 
    {
        y: [air_1_temp],
        type: 'line',
        name: "Температура"
    }],
);
Plotly.plot('air_2_chart', 
    [{
        y: [air_2_hum],
        type: 'line',
        name: "Влажность",
    }, 
    {
        y: [air_2_temp],
        type: 'line',
        name: "Температура"
    }],
);
Plotly.plot('air_3_chart', 
    [{
        y: [air_3_hum],
        type: 'line',
        name: "Влажность",
    }, 
    {
        y: [air_3_temp],
        type: 'line',
        name: "Температура"
    }],
);
Plotly.plot('air_4_chart', 
    [{
        y: [air_4_hum],
        type: 'line',
        name: "Влажность",
    }, 
    {
        y: [air_4_temp],
        type: 'line',
        name: "Температура"
    }],
);

setInterval(function() {
    Plotly.extendTraces('soil_1_chart', {
        y: [
            [soil_1_hum]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('soil_2_chart', {
        y: [
            [soil_2_hum]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('soil_3_chart', {
        y: [
            [soil_3_hum]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('soil_4_chart', {
        y: [
            [soil_4_hum]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('soil_5_chart', {
        y: [
            [soil_5_hum]
        ]
    }, [0]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('soil_6_chart', {
        y: [
            [soil_6_hum]
        ]
    }, [0]);
}, 200);

setInterval(function() {
    Plotly.extendTraces('air_1_chart', {
        y: [[air_1_hum], [air_1_temp]]
    }, [0, 1]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('air_2_chart', {
        y: [[air_2_hum], [air_2_temp]]
    }, [0, 1]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('air_3_chart', {
        y: [[air_3_hum], [air_3_temp]]
    }, [0, 1]);
}, 200);
setInterval(function() {
    Plotly.extendTraces('air_4_chart', {
        y: [[air_4_hum], [air_4_temp]]
    }, [0, 1]);
}, 200);