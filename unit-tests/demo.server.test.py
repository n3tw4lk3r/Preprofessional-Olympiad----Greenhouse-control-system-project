import unittest
import requests
from server import * 

class TestCalc(unittest.TestCase):
    def test_add(self):
        reqSet = requests.get('http://localhost:5000/save-state?parameter=T&state=256')
        reqGet = requests.get('http://localhost:5000/get-state?parameter=T')
        print(reqGet.text)
        self.assertEqual(reqGet.text, '{"T":256}\n')

# python -m unittest .\test.py
