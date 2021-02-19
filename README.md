# TikTok Scrapping

Proyecto de práctica, un servicio de scraping de datos desde TikTok para AnaliTIC

Se explica brevemente las partes del proyecto, para más detalle en específico de alguna parte del proyecto el código está comentado.

## Base de datos MySQL

Para crear la base de datos MySQL solo tiene que ejecutar el código en el archivo `query_tables.sql` que se encargará de crear la base de datos `TikTok` y sus respectivas tablas para poder hacer uso de ellas con la `API`

## API

En la carpeta `API`se encuentra `app.js` que es el archivo principal de la API y `config.js` que define las credenciales para conectarle a la base de datos MySQL, esta API hace uso de `express` para levantar el servidor, `body-parser` para facilitar la creación de objetos JSON, `child_process` para crear hilos que ejecuten el script de scraping en python desde la imagen de Docker y `json2csv` para generar los archivos descargables de información de videos de algún usuario.
Para instalar las dependencias se debe ejecutar `npm i` en el directorio de la `API`.

## Docker

En la carpeta `Docker` se encuentran los archivos para la creación de imagen de Docker y también el código fuente del script de scraping en Python.

Para ejecutar la imagen ya construida ejecute el siguiente comando:
>`docker run --shm-size 2g --network=host reg.analitic.cl/tiktok_scrap`

## Frontend Angular

En la carpeta `Frontend` se encuentra el proyecto de Angular correspondiente a la página de Frontend.
Para instalar las dependencias se debe ejecutar `npm i` en el directorio del `Frontend`.
En `Frontend/src/app` se encuentran los componentes del proyecto
- `video.service.ts`: Contiene las rutas a las funciones que realizan las distintas peticiones a la `API` para solicitar datos necesarios.
- `web-request.service.ts`: Contiene los métodos necesarios para realizar los request a la `API` y también se define la ruta de acceso a la API, si se quiere cambiar, puede hacerlo desde este archivo

En las carpetas que se encuentran en `Frontend/src/app/pages` se encuentran las distintas vistas que contiene el proyecto y en cada una de ellas están los archivos `component.html` que contiene la estructura de la página y `component.ts` que contiene las funciones usadas en las distintas vistas que llaman a los servicios para obtener la información desde la base de datos

## Python Scraping
Para ejecutar el script de python existen 2 opciones:
- Obtener queries desde base de datos: De esta forma se realiza el scraping de todos los perfiles que existen en la tabla `queries` de la base de datos `TikTok`, para esto hay que ejecutar el comando `python main.py` sin argumentos, esto es lo que hace el contenedor Docker a medianoche (Zona horaria de Docker: GMT).
- Query on demand: Realiza el scraping de una cuenta en específico y de paso la agrega a la tabla `queries` de la base de datos `TikTok` para que en posteriores scrap desde la base de datos se haga scrap de esta cuenta también, para esto hay que ejecutar el comando `python main.py [Usuario TikTok]` cambiando `[Usuario TikTok]` por el nombre de usuario de alguna cuenta de TikTok, esto es lo que hace el botón de `+ Nuevo Perfil` y también los botones de `Actualizar Scrap` en cada página de perfil en Angular,

#
Autor: Matías Eduardo Allende Pino
#
matias.allende.p@mail.pucv.cl
