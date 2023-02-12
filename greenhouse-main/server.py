import requests
import json
from flask import *
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/get')
def get_request():
    sensor_type = request.args.get('sensor_type')
    sensor_id = request.args.get('sensor_id')
    result = requests.get("https://dt.miet.ru/ppo_it/api/"+sensor_type+"/"+sensor_id)
    result = json.loads(result.text)
    return jsonify(result)

@app.route('/patch')
def patch_request():
    target = request.args.get('target')
    state = request.args.get('state')
    if target == 'watering':
        Id = request.args.get('id')
        result = requests.patch("https://dt.miet.ru/ppo_it/api/watering",
                   params={"id":Id, "state":state})
    else:
        result = requests.patch("https://dt.miet.ru/ppo_it/api/" + target,
                   params={"state":state})
    result = json.loads(result.text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=False, host='91.240.84.86' port=5000)
