import requests
import json
import csv
import mysql.connector
from flask import *
from flask_cors import CORS

HOST = '91.240.84.86'
PORT = 5000

# значения параметров и состояния систем теплицы

# при открытии веб-интерфейса фронтенд делает запрос к /get-state,
# чтобы восстановить состояние систем

# при изменении состояния фронтенд отсылает новое в /save-state

T = 30
H = 30
Hb = 30
watering = 0
fork_drive = 0
soil_watering = "000000"
emergencyMode = 0

app = Flask(__name__)
CORS(app)


@app.route("/save-state")
def saveOnServer():
    """Сохраняет передаваемый параметр на сервере"""
    """Пример URL: http://91.240.84.86:5000/save-state?parameter=T&state=244"""

    global T, H, Hb, watering, fork_drive, soil_watering, emergencyMode

    parameter = request.args.get("parameter")
    state = request.args.get("state")
    if parameter == "T":
        T = int(state)
        return jsonify({"new T" : T})
    elif parameter == "H":
        H = int(state)
        return jsonify({"new H" : H})
    elif parameter == "Hb":
        Hb = int(state)
        return jsonify({"new Hb" : Hb})
    elif parameter == "watering":
        watering = int(state)
        return jsonify({"new watering" : watering})
    elif parameter == "fork_drive":
        fork_drive = int(state)
        return jsonify({"new fork_drive" : fork_drive})
    elif parameter == "soil_watering":
        soil_watering = state
        return jsonify({"new soil_watering" : soil_watering})
    elif parameter == "emergencyMode":
        emergencyMode = int(state)
        return jsonify({"new emergencyMode" : emergencyMode})
    return jsonify({"msg": "error"})


@app.route("/get-state")
def getFromServer():
    """Передает состояние систем и параметров по запросу."""
    """Пример URL: http://91.240.84.86:5000/get-state?parameter=fork_drive"""

    global T, H, Hb, watering, fork_drive, soil_watering, emergencyMode

    parameter = request.args.get("parameter")
    if parameter == "T":
        return jsonify({"T" : T})
    elif parameter == "H":
        return jsonify({"H" : H})
    elif parameter == "Hb":
        return jsonify({"Hb" : Hb})
    elif parameter == "watering":
        return jsonify({"watering" : watering})
    elif parameter == "fork_drive":
        return jsonify({"fork_drive" : fork_drive})
    elif parameter == "soil_watering":
        return jsonify({"soil_watering" : soil_watering})
    elif parameter == "emergencyMode":
        return jsonify({"emergencyMode" : emergencyMode})
    return jsonify({"msg" : "error"})


@app.route("/get")
def get_request():
    """Обрабатывает get-запрос, делает get-запрос к API организаторов. Возвращает ответ в формате JSON."""
    """Пример URL: http://91.240.84.86:5000/get?sensor_type=hum&sensor_id=1"""

    sensor_type = request.args.get("sensor_type")
    sensor_id = request.args.get("sensor_id")
    result = requests.get(
        "https://dt.miet.ru/ppo_it/api/" + sensor_type + "/" + sensor_id
    )
    result = json.loads(result.text)

    return jsonify(result)


@app.route("/patch")
def patch_request():
    """Обрабатывает get-запрос, делает patch-запрос к API организаторов. Возвращает ответ в формате JSON."""
    """Пример URL: http://91.240.84.86:5000/patch?target=watering&state=0&id=5"""

    target = request.args.get("target")
    state = request.args.get("state")
    if target == "watering":
        Id = request.args.get("id")
        result = requests.patch(
            "https://dt.miet.ru/ppo_it/api/watering", params={"id": Id, "state": state}
        )
    else:
        result = requests.patch(
            "https://dt.miet.ru/ppo_it/api/" + target, params={"state": state}
        )
    result = json.loads(result.text)
    
    return jsonify(result)


@app.route("/exportDB")
def exportDB():
    """Экспорт БД в csv файл."""

    cnx = mysql.connector.connect(user="olyacodzel", password="r2W89t",
                                database="sensordata", host="91.240.84.86")
    cursor = cnx.cursor()
    file = open("sensordata.csv", "w")
    csv_writer = csv.writer(file)

    csv_writer.writerow(['Soil sensors'])
    csv_writer.writerow(['id', 'humidity', 'time'])

    cursor.execute("SELECT * FROM hum;")
    for element in cursor:
        csv_writer.writerow(element)

    csv_writer.writerow(['Air sensors'])
    csv_writer.writerow(['id', 'temperature', 'humidity', 'time'])
    cursor.execute("SELECT * FROM temp_hum;")
    for element in cursor:
        csv_writer.writerow(element)

    cursor.close()
    cnx.close()
    file.close()
    
    return send_file("sensordata.csv", as_attachment=True)


@app.route("/db-insert")
def dbInsert():
    """Запись пользовательских показаний датчиков в БД."""
    """Пример url: http://91.240.84.86:5000/db-insert?sensor_type=hum&sensor_id=2&humidity=99.99&temperature=None"""
    sensor_type = request.args.get("sensor_type")
    sensor_id = request.args.get("sensor_id")
    humidity = request.args.get("humidity")
    temperature = request.args.get("temperature")
    if sensor_type == "hum":
        query = "INSERT INTO hum(id, humidity, DateTime) VALUES (" + sensor_id + "," + humidity + ", NOW())"
    elif sensor_type == "temp_hum":
        query = "INSERT INTO temp_hum(id, temperature, humidity, DateTime) VALUES (" + sensor_id + "," + temperature + "," + humidity + ", NOW())"

    try:
        cnx = mysql.connector.connect(user="olyacodzel", password="r2W89t",
                                    database="sensordata", host="91.240.84.86")
        cursor = cnx.cursor()
        cursor.execute(query)
        cnx.commit()

        cursor.close()
        cnx.close()

        return jsonify({"msg" : "done"})
    
    except Error as e:
      return jsonify({"msg" : str(e)})


if __name__ == "__main__":
    app.run(debug=False, host=HOST, port=PORT)
