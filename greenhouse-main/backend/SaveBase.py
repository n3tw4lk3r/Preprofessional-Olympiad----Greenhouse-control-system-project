import requests
from getpass import getpass
from mysql.connector import connect, Error

try:
  with connect(
        host="91.240.84.86", 
        user=input("Имя пользователя: "),
        password=getpass("Пароль: "),
        database="sensordata" #имя Базы Данных
  ) as connection:
        #hum
        for i in range(1,7):
            url = 'https://dt.miet.ru/ppo_it/api/hum/' + str(i)
            response = requests.get(url)
            data_hum = response.json()
            insert_hum = "INSERT INTO hum(id, humidity, DateTime) VALUES ("+str(data_hum['id'])+"," +str(data_hum['humidity'])+ ", NOW())"
            connection.cursor().execute(insert_hum)
            connection.commit()
        #temp_hum
        for k in range(1,5):
            url = 'https://dt.miet.ru/ppo_it/api/temp_hum/' + str(k)
            response = requests.get(url)
            data_temp_hum = response.json()
            insert_temp_hum = "INSERT INTO temp_hum(id, temperature, humidity, DateTime) VALUES (" + str(data_temp_hum['id']) + "," + str(data_temp_hum['temperature']) + "," +str(data_temp_hum['humidity']) + ", NOW())"
            connection.cursor().execute(insert_temp_hum)
            connection.commit()
except Error as e:
    print(e)
