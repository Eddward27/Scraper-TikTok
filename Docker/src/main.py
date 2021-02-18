from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

import mysql.connector
from db import getQueries, nuevoPerfil

from time import sleep
import sys
from scrape import scrap_tiktok

#Opciones para Chrome
options = Options()
#Para que sea posible ejecutar en Docker
options.headless = True
options.add_argument('--no-sandbox')

# ChromeDriver se cae frecuentemente, intente habilitando alguno de los siguientes argumentos
options.add_argument("start-maximized"); # https://stackoverflow.com/a/26283818/1689770
options.add_argument("enable-automation"); # https://stackoverflow.com/a/43840128/1689770
options.add_argument("--disable-infobars"); #https://stackoverflow.com/a/43840128/1689770
options.add_argument("--disable-browser-side-navigation"); #https://stackoverflow.com/a/49123152/1689770
options.add_argument("--disable-gpu"); #https://stackoverflow.com/questions/51959986/how-to-solve-selenium-chromedriver-timed-out-receiving-message-from-renderer-exc

#Usa memoria en el disco en vez de en la RAM
#options.add_argument('--disable-dev-shm-usage')

#Conexión a la base de datos MySQL
mydb = mysql.connector.connect(
    host="localhost",
    user="tiktok",
    password="scraptiktok",
    database="TikTok"
)
mycursor = mydb.cursor()

#Obtener perfiles para hacer scrapping
#Si no se pasan como argumentos al ejecutar script, se obtienen desde la base de datos [1 vez al día]
if len(sys.argv) == 1:
    QUERIES = getQueries(mycursor)
#Si hay argumentos (REQUEST) se ejecuta el scrapping y se agrega el perfil para hacerle scrapping cada día
#python main.py usuario1,usuario2,usuario3,...,...
#       SIN ESPACIOS    ^        ^        ^   ^
else:
    input = sys.argv[1].split(',')
    QUERIES = []
    nuevoPerfil(mydb, mycursor, input)
    for perfil in input:
    	QUERIES.append(perfil.strip())

#Ahora que se tienen los perfiles a realizar el scrapping, se inicia el proceso
#print(QUERIES)
for query in QUERIES:
    scrap_tiktok(mydb, mycursor, options, query)
    sleep(1)
