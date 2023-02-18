import requests
from getpass import getpass
from mysql.connector import connect, Error

Create_DataBase = "CREATE DATABASE sensordata"
try:
    with connect(
        host="localhost", #Заменить на 91.240.84.86   
        user=input("Имя пользователя: "),
        password=getpass("Пароль: "),
    ) as connection:
        with connection.cursor() as cursor:
                cursor.execute(Create_DataBase)
                #connection.commit()
except Error as e:
    print(e)
Create_Table = """
  CREATE TABLE hum (
  date date NOT NULL,
  time time NOT NULL,
  id int NOT NULL,
  type varchar(10) NOT NULL,
  value float DEFAULT NULL,
  PRIMARY KEY (date, time, id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
"""
try:
    with connect(
        host="localhost", #Заменить на 91.240.84.86   
        user=input("Имя пользователя: "),
        password=getpass("Пароль: "),
        database="sensordata"
    ) as connection:
        with connection.cursor() as cursor:
                cursor.execute(Create_Table)
                connection.commit()
except Error as e:
    print(e)

 
