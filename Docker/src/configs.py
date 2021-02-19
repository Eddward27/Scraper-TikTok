PATH = "./chromedriver"
url_base = "https://www.tiktok.com/@"
url = "https://www.tiktok.com/"
login_url = "https://www.tiktok.com/login/phone-or-email/email"

#Check pagina captcha
captcha_check = 'verify-wrap'

#Check usuario existe
usuario_check = 'error-page'

#Cambio versión TikTok
xpath_cuad = '//*[@id="main"]/div[2]/div[2]/div/main/div[1]/div[1]/div'

#Datos Cuenta
desc_cuenta = "share-desc"
clase_id_cuenta = "share-title"
clase_nombre_cuenta = "share-sub-title"
clase_metrica_numeros = "number"
clase_link_cuenta = "share-links"
clase_videos = "video-feed-item-wrapper"

#Overlay
xpath_cerrar_overlay = '//*[@id="main"]/div[2]/div[2]/div/main/div[2]/div[2]/div[1]/div/span'

#Video Data
xpath_video_desc = '//*[@id="main"]/div[2]/div[2]/div/div/main/div/div[1]/span[1]/div/div[1]/div[2]/strong'
xpath_video_music = '//*[@id="main"]/div[2]/div[2]/div/div/main/div/div[1]/span[1]/div/div[1]/div[3]/h4/a/div'
xpath_video_mg = '//*[@id="main"]/div[2]/div[2]/div/div/main/div/div[1]/span[1]/div/div[1]/div[4]/div[2]/div[1]/strong'
xpath_video_com = '//*[@id="main"]/div[2]/div[2]/div/div/main/div/div[1]/span[1]/div/div[1]/div[4]/div[2]/div[2]/strong'
xpath_video_link = '//*[@id="main"]/div[2]/div[2]/div/main/div[2]/div[2]/div[2]/div[2]/div[2]/div[1]'
clase_video_count = "video-count"

#Imagen perfil
img_xpath = '//*[@id="main"]/div[2]/div[2]/div/header/div[1]/div[1]/span/img'
