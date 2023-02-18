import requests
from getpass import getpass
from mysql.connector import connect, Error

try:
    with connect(
        host="91.240.84.86", 
        user=input("Имя пользователя: "),
        password=getpass("Пароль: "),
        database="sensordata" #Заменить имя Базы Данных при необходимости
    ) as connection:
        for i in range(1,7):
            url = 'https://dt.miet.ru/ppo_it/api/hum/' + str(i)
            response = requests.get(url)
            data_hum = response.json()
            insert_hum = "INSERT INTO hum(id, date, time, type, value) VALUES (" + str(data_hum['id'])+", NOW(), NOW(), 'soil_hum'," +str(data_hum['humidity'])+")"
            if i<5:
                url = 'https://dt.miet.ru/ppo_it/api/temp_hum/' + str(i)
                response = requests.get(url)
                data_temp_hum = response.json()
                insert_air_temp = "INSERT INTO hum(id, date, time, type, value) VALUES (" + str(data_hum['id'])+", NOW(), NOW(), 'air_temp'," +str(data_temp_hum['temperature'])+")"
                insert_air_hum = "INSERT INTO hum(id, date, time, type, value) VALUES (" + str(data_hum['id'])+", NOW(), NOW(), 'air_hum'," +str(data_temp_hum['humidity'])+")"
            with connection.cursor() as cursor:
                cursor.execute(insert_hum)
                if i<5:
                    cursor.execute(insert_air_temp)
                    cursor.execute(insert_air_hum)
                connection.commit()
except Error as e:
    print(e)
