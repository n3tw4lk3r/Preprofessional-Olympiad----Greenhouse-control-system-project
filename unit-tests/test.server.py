import unittest
import requests
from server import * 

class Test(unittest.TestCase):
    def test_isTSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=T&state=45')
        req = requests.get('http://localhost:5000/get-state?parameter=T')
        print(req.text)
        self.assertEqual(req.text, '{"T":45}\n')
    def test_isTSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=T&state=36')
        req = requests.get('http://localhost:5000/get-state?parameter=T')
        print(req.text)
        self.assertEqual(req.text, '{"T":36}\n')

    def test_isHSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=H&state=21')
        req = requests.get('http://localhost:5000/get-state?parameter=H')
        print(req.text)
        self.assertEqual(req.text, '{"H":21}\n')
    def test_isHSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=H&state=12')
        req = requests.get('http://localhost:5000/get-state?parameter=H')
        print(req.text)
        self.assertEqual(req.text, '{"H":12}\n')

    def test_isHbSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=Hb&state=0')
        req = requests.get('http://localhost:5000/get-state?parameter=Hb')
        print(req.text)
        self.assertEqual(req.text, '{"Hb":0}\n')
    def test_isHbSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=Hb&state=2')
        req = requests.get('http://localhost:5000/get-state?parameter=Hb')
        print(req.text)
        self.assertEqual(req.text, '{"Hb":2}\n')
    
    def test_isWateringSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=watering&state=1')
        req = requests.get('http://localhost:5000/get-state?parameter=watering')
        print(req.text)
        self.assertEqual(req.text, '{"watering":1}\n')
    def test_isWateringSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=watering&state=0')
        req = requests.get('http://localhost:5000/get-state?parameter=watering')
        print(req.text)
        self.assertEqual(req.text, '{"watering":0}\n')
    
    def test_isForkDriveSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=fork_drive&state=1')
        req = requests.get('http://localhost:5000/get-state?parameter=fork_drive')
        print(req.text)
        self.assertEqual(req.text, '{"fork_drive":1}\n')
    def test_isForkDriveSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=fork_drive&state=0')
        req = requests.get('http://localhost:5000/get-state?parameter=fork_drive')
        print(req.text)
        self.assertEqual(req.text, '{"fork_drive":0}\n')

    def test_isSoilWateringSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=soil_watering&state=111111')
        req = requests.get('http://localhost:5000/get-state?parameter=soil_watering')
        print(req.text)
        self.assertEqual(req.text, '{"soil_watering":111111}\n')
    def test_isSoilWateringSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=soil_watering&state=101010')
        req = requests.get('http://localhost:5000/get-state?parameter=soil_watering')
        print(req.text)
        self.assertEqual(req.text, '{"soil_watering":101010}\n')
    
    def test_isEmergencyModeSet_1(self):
        requests.get('http://localhost:5000/save-state?parameter=emergencyMode&state=1')
        req = requests.get('http://localhost:5000/get-state?parameter=emergencyMode')
        print(req.text)
        self.assertEqual(req.text, '{"emergencyMode":1}\n')
    def test_isEmergencyModeSet_2(self):
        requests.get('http://localhost:5000/save-state?parameter=emergencyMode&state=0')
        req = requests.get('http://localhost:5000/get-state?parameter=emergencyMode')
        print(req.text)
        self.assertEqual(req.text, '{"emergencyMode":0}\n')
    
    def test_isWrongParamSet(self):
        requests.get('http://localhost:5000/save-state?parameter=asdf&state=0')
        req = requests.get('http://localhost:5000/get-state?parameter=asdfasdf')
        print("Запрос с намеренной ошибкой: ", req.text)
        self.assertEqual(req.text, '{"msg":"error"}\n')
    
    def test_API_getReq(self):
        req1 = requests.get("http://localhost:5000/get?sensor_type=hum&sensor_id=1")
        req2 = requests.get("https://dt.miet.ru/ppo_it/api/hum/1")
        print(req1.text, req2.text, "Ответы неодинаковы из-за разницы во времени, проверяем совпадение id и ключевых слов")

        # проверяем, одинаковые ли ответы. Странный способ, я знаю.
        req1_new = ''
        req2_new = ''

        # избавляемся от разных показаний
        req1 = req1.text[:req1.text.find(':')]+req1.text[req1.text.find(','):]
        print(req1)
        req2 = list(sorted(req2.text.split()))
        print(req2)
        req2.pop(2)
        for i in req1:
            for j in i:
                if j.isalpha() or j.isdigit():
                    req1_new += j
        for i in req2:
            for j in i:
                if j.isalpha() or j.isdigit():
                    req2_new += j

        self.assertEqual(sorted(req1_new), sorted(req2_new))

    def test_API_patchReq(self):
        req1 = requests.get("http://localhost:5000/patch?target=watering&state=0&id=2")
        req2 = requests.patch(
            "https://dt.miet.ru/ppo_it/api/watering", params={"id": 2, "state": 0}
        )
        print(req1.text, req2.text)
        # проверяем, одинаковые ли ответы. Странный способ, я знаю.
        req1_new = ''
        req2_new = ''
        for i in req1.text:
            if i.isalpha() or i.isdigit():
                req1_new += i
        for i in req2.text:
            if i.isalpha() or i.isdigit():
                req2_new += i
        self.assertEqual(sorted(req1_new), sorted(req2_new))
