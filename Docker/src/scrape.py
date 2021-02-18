from selenium import webdriver
from selenium.webdriver.common.by import By

from configs import *
from datetime import datetime
from datetime import date
from utils import scroll_page, str2num, id2date

from time import sleep

def scrap_tiktok(mydb, mycursor, options, query):
    print('Scrapping: ' + query)
    driver = webdriver.Chrome('./chromedriver', options=options)

    #Acceder a perfil de TikTok
    driver.get(url_base + query)
    sleep(0.5)

    #Captcha check
    try:
        #El captcha es mover una pieza de rompecabezas a cierta posición, no pude completarlo desde selenium
        captcha = driver.find_element(By.CLASS_NAME, 'verify-wrap')
        print('ERROR: Captcha encontrado!!')
        return
    except Exception as e:
        print('No hay captcha ✓✓')

    #Check version de TikTok [Feed o Cuadrícula]
    try:
        #Si está en cuadrícula, se puede leer el numero de vistas de los videos
        flagTiktokView = driver.find_element(By.CLASS_NAME, clase_video_count)
        print('Se encuentra en modo cuadrícula')
    except:
        #Si esta en feed, se pone en modo cuadrícula
        driver.find_element(By.XPATH, xpath_cuad).click()
        print('Cambiado a modo cuadrícula')
        sleep(1)

    #Se obtiene el momento en el que se obtuvieron los datos
    fechahoy = datetime.today()
    diahoy = date.today()

    #Atributos del perfil
    img_url = driver.find_element(By.XPATH, img_xpath).get_attribute('src')
    descripcion = driver.find_element(By.CLASS_NAME, desc_cuenta)
    id_cuenta = driver.find_element(By.CLASS_NAME, clase_id_cuenta)
    nombre_cuenta = driver.find_element(By.CLASS_NAME, clase_nombre_cuenta)
    numeros = driver.find_elements(By.CLASS_NAME, clase_metrica_numeros)
    links = driver.find_element(By.CLASS_NAME, clase_link_cuenta)
    #Si la cuenta no comparte links, se deja una cadena vacía
    links_cuenta = ""
    if (links.text):
        links_cuenta = links.text
    #Cantidad de: Siguiendo, Seguidores y Me Gusta
    metricas = []
    for numero in numeros:
        datos = numero.text.split("\n")
        metricas.append(str2num(datos[0]))

    #Quitar mensaje en esquina inferior derecha que tapa videos
    try:
        driver.find_element(By.XPATH, xpath_cerrar_overlay).click()
        #print("Overlay de 'Obtener TikTok' cerrado ✓✓")
    except:
        print("No hay overlay de 'Obtener TikTok' sobre la página ✓✓")

    #Verificar si el perfil ya existe en la base de datos
    queryIF = "SELECT idPerfil FROM perfiles WHERE username='" + query + "';"
    mycursor.execute(queryIF)
    perfilExistente = mycursor.fetchall()

    #Si no se encuentra, se inserta
    if not perfilExistente:
        sqlPerfil = ("INSERT INTO perfiles "
                  "(username, url, nombre_cuenta, descripcion, links) "
                  "VALUES (%(username)s, %(url)s, %(nombre_cuenta)s, %(descripcion)s, %(links)s)")
        perfil_dict = {
            'username': query,
            'url': url_base + id_cuenta.text,
            'nombre_cuenta': nombre_cuenta.text,
            'descripcion': descripcion.text,
            'links': links_cuenta
        }
        mycursor.execute(sqlPerfil, perfil_dict)
        mydb.commit()
        id_perfil = mycursor.lastrowid
    #Si existe, se obtiene el idPerfil para ser usado mas adelante
    else:
        id_perfil = perfilExistente[0][0]

    #Se insertan los datos que cambian del perfil
    sqlPerfilD = ("INSERT INTO data_perfil "
              "(idPerfil, date, dia, siguiendo, seguidores, me_gusta, videos, img_url, ready, loopVideo) "
              "VALUES (%(idPerfil)s, %(date)s, %(dia)s, %(siguiendo)s, %(seguidores)s, %(me_gusta)s, %(videos)s, %(img_url)s, %(ready)s, %(loopVideo)s)")
    perfilD_dict = {
        'idPerfil': id_perfil,
        'date': fechahoy,
        'dia': diahoy,
        'siguiendo': metricas[0],
        'seguidores': metricas[1],
        'me_gusta': metricas[2],
        'videos': 0,#len(videos),
        'img_url': img_url,
        'ready': 1,
        'loopVideo': 0
    }
    mycursor.execute(sqlPerfilD, perfilD_dict)
    mydb.commit()

    #Scroll infinito para obtener todos los videos de la cuenta
    loops = 50  #Puede cambiar la cantidad de loops realizados aqui
    for i in range(loops):
        scroll_page(driver)
        print('Scroll N°: ' + str(i+1) + '/' + str(loops))
        sleep(1)

    #Obtener todos los elementos de video que existen en el perfil de TikTok
    videos = driver.find_elements(By.CLASS_NAME, clase_videos)
    print('N° Videos: ' + str(len(videos)))

    #Update status a Preparandose
    mycursor.execute('UPDATE data_perfil SET ready=2, videos=' + str(len(videos)) + ' WHERE idPerfil=' + str(id_perfil) + ' ORDER BY idData DESC LIMIT 1')
    mydb.commit()

    #Se obtienen los links y la cantidad de vistas para todos los videos en la cuenta
    videosPerf = []
    for video in videos:
        driver.execute_script("arguments[0].scrollIntoView();", video)
        urlVideo = video.get_attribute('href')
        video_count = video.find_element(By.CLASS_NAME, clase_video_count).text
        objVideo = {
            'url': urlVideo,
            'vistas': video_count
        }
        videosPerf.append(objVideo)

    #Se prepara el loop para obtener los datos de cada video en la cuenta
    count = 1

    #Scrapping a los videos
    try:
        for video in videosPerf:
            print(str(count) + ' - get: ' + video['url'])
            driver.get(video['url'])
            try:
                video_musica = driver.find_element(By.XPATH, xpath_video_music).text
            except:
                video_musica = "None"
            try:
                video_desc_meta = driver.find_element(By.XPATH, xpath_video_desc).text
                video_mg = str2num(driver.find_element(By.XPATH, xpath_video_mg).text)
                video_com = str2num(driver.find_element(By.XPATH, xpath_video_com).text)
            except:
                print('^ LINK ERROR ^')
                video_musica = 'LINK ERROR'
                video_desc_meta = 'LINK ERROR'
                video_mg = 0
                video_com = 0
            video_link = video['url']
            video_count = str2num(video['vistas'])

            #Con el id de la url del video, se puede obtener la fecha en la que se publicó el video
            video_fecha = id2date(video_link.split('/')[-1])

            #Engagement
            if metricas[1] == 0 or isinstance(video_mg, str):
                engagement = 0
            else:
                engagement = ((video_mg + video_com)/metricas[1])*100
            if engagement > 100:
                engagement = 100

            sqlVideo = ("INSERT INTO videos "
                      "(date, dia, username, idPerfil, video_n, url, vistas, descripcion, fecha, musica, me_gusta, comentarios, engagement) "
                      "VALUES (%(date)s, %(dia)s, %(username)s, %(idPerfil)s, %(video_n)s, %(url)s, %(vistas)s, %(descripcion)s, %(fecha)s, %(musica)s, %(me_gusta)s, %(comentarios)s, %(engagement)s)")
            video_dict = {
                'date': fechahoy,
                'dia': diahoy,
                'username': query,
                'idPerfil': id_perfil,
                'video_n': count,
                'url': video_link,
                'vistas': video_count,
                'descripcion': video_desc_meta,
                'fecha': video_fecha,
                'musica': video_musica,
                'me_gusta': video_mg,
                'comentarios': video_com,
                'engagement': engagement
            }
            mycursor.execute(sqlVideo, video_dict)    #Update status a Preparandose
            mycursor.execute('UPDATE data_perfil SET loopVideo=' + str(count) + ' WHERE idPerfil=' + str(id_perfil) + ' ORDER BY idData DESC LIMIT 1')
            mydb.commit()
            count += 1
    except Exception as e:
        ########################
        # UPDATE READY A ERROR #
        ########################
        mycursor.execute('UPDATE data_perfil SET ready=3 WHERE idPerfil=' + str(id_perfil) + ' ORDER BY idData DESC LIMIT 1')
        mydb.commit()
        print(e)
        print('Error: ' + query)
        return
    ########################
    # UPDATE READY A LISTO #
    ########################
    mycursor.execute('UPDATE data_perfil SET ready=0 WHERE idPerfil=' + str(id_perfil) + ' ORDER BY idData DESC LIMIT 1')
    mydb.commit()
    driver.quit()
    print('Listo: ' + query)
