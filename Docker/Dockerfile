FROM python:3
ENV DEBIAN_FRONTEND="noninteractive"

# NO FUNCIONA :c
# Usar zona horaria de Chile
# ENV TZ=America/Santiago
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Preparación para instalar dependencias
RUN apt-get update
RUN apt-get install -y sudo wget

# Instalar cron
RUN apt-get install -y cron vim

# Instalar las dependencias de Chrome
RUN apt-get install -y libgbm1 gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# Instalar Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

# Copiar archivos scrip python
RUN mkdir /scraper
COPY ./src /scraper
RUN chmod -R 777 /scraper

# Copiar archivos para cron
COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN /usr/bin/crontab /etc/cron.d/crontab

# Directorio de trabajo
WORKDIR /scraper

# Instalar requerimientos de scrip python
RUN pip3 install -r requirements.txt

# Variable de entorno Headless
ENV START_XVFB=false

# Ejecutar cron como proceso principal del contenedor
CMD ["cron", "-f"]
