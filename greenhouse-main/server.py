import requests
import json
from flask import *
from flask_cors import CORS

# сохраняю значения параметров, чтобы восстановить их при запуске
T = 50
H = 50
Hb = 50
watering = 0
fork_drive = 0
soil_watering = [0, 0, 0, 0, 0, 0]
emergencyMode = False

app = Flask(__name__)
CORS(app)


@app.route("/save-states")
def saveOnServer():
    """Сохраняет передаваемый параметр на сервере, возвращает его по запросу."""
    global T
    global H
    global Hb
    global watering
    global fork_drive
    global soil_watering
    global emergencyMode
    parameter = request.args.get("parameter")
    state = request.args.get("state")
    if parameter == "T":
        if state == "getData":
            return jsonify({"T": T})
        T = state
    elif parameter == "H":
        if state == "getData":
            return jsonify({"H": H})
        H = state
    elif parameter == "Hb":
        if state == "getData":
            return jsonify({"Hb": Hb})
        H = state
    elif parameter == "watering":
        if state == "getData":
            return jsonify({"watering": watering})
        watering = state
    elif parameter == "fork_drive":
        if state == "getData":
            return jsonify({"fork_drive": fork_drive})
        fork_drive = state
    elif parameter == "soil_watering":
        if state == "getData":
            return jsonify({"soil_watering": soil_watering})
        soil_watering = state
    elif parameter == "emergencyMode":
        if state == "getData":
            return jsonify({"emergencyMode": emergencyMode})
        emergencyMode = state
    return jsonify({"msg": "state saved"})


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


if __name__ == "__main__":
    app.run(debug=False, host="91.240.84.86", port=5000)
