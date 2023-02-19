import unittest
import requests
from server import * 

class TestCalc(unittest.TestCase):
    def test_add(self):
        req = requests.get('http://localhost:5000/save-state?parameter=T&state=244')
        self.assertEqual(req.text, '{"new T":244}\n')

# python -m unittest .\test.py
