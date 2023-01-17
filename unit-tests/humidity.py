import requests
url = ''
i = 0
for i in range(1,7):
    url = 'https://dt.miet.ru/ppo_it/api/hum/' + str(i)
    response = requests.get(url)
    response.raise_for_status()
    filetxt = open('humidity.txt', 'a')
    filetxt.write(response.text + '\n')
    filetxt.close()
    url = ''