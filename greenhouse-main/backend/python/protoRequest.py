'''
Фронтенд должен запускать этот скрипт с помощью AJAX (добавить...)

Важно: организаторы хотят, чтобы в заголовках был указан токен авторизации,
который они должны выдать позже.

Не забыть: 
heads = {"X-Auth-Token": "<token>"}
requests.get(url, headers=heads)
'''


import requests

res = requests.get('https://dt.miet.ru/ppo_it/api/hum/2')
print(res.text)
