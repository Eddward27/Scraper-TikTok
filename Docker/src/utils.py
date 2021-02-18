from time import sleep
from datetime import datetime

# Scroll infinito de página
def scroll_page(driver):
    SCROLL_PAUSE_TIME = 0.5
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        sleep(SCROLL_PAUSE_TIME)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

# Cambia una string que representa un número de TikTok (ej. 20.8K) y la pasa a valor numérico (ej. 20800)
def str2num(str):
    if str.isnumeric():
        return int(str)
    mult = 0
    splitted = ''
    if 'K' in str:
        mult = 1000
        splitted = str.split('K')[0]
    if 'M' in str:
        mult = 1000000
        splitted = str.split('M')[0]
    if 'B' in str:
        mult = 1000000000
        splitted = str.split('B')[0]
    if '.' not in splitted:
        return int(splitted)*mult
    numb = splitted.split('.')
    numK = int(numb[0])*mult
    numC = int(numb[1])*mult/10
    num = numK + numC
    return int(num)

# Procesa el id de un video de TikTok para obtener la fecha en la que se publicó (ej. https://www.tiktok.com/@gorillaz/video/6883947464924155137 => 6883947464924155137 = 15/10/2020 23:31:59)
# Se guarda como objeto datetime
def id2date(id):
    number = int(id)
    number = '0' + f'{number:08b}'
    number = int(number[:32], 2)
    fecha = datetime.utcfromtimestamp(number)
    return fecha
