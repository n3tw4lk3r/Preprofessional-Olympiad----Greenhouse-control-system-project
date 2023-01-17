import requests
url = ''
for i in range(1,5):
    url = 'https://dt.miet.ru/ppo_it/api/temp_hum/' + str(i)
    response = requests.get(url)
    response.raise_for_status()
    filetxt = open('temperature_humidity.txt', 'a')
    filetxt.write(response.text + '\n')
    filetxt.close()
    url = ''