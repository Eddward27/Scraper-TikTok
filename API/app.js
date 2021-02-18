// Paquetes requeridos y seteo de puerto
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const pool = require('./config');
const { spawn } = require('child_process');

//import { Parser } from 'json2csv';
const { Parser } = require('json2csv');

function formatFecha(date) {
    var m = new Date(date)
    var dateString =
        m.getUTCDate() + "/" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCFullYear()).slice(-4) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

    return dateString;
}

function formatDia(date){
    var m = new Date(date)
    var dayString =
        m.getUTCDate() + "/" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCFullYear()).slice(-4);

    return dayString;
}

function getDockerID(callback) {
    var command = spawn('docker', ['ps']);
    var dockerID = '';
    var dockerPS = '';
    command.stdout.on('data', function(data) {
         dockerPS = data.toString().split('\n');
         for (var i = 0; i < dockerPS.length; i++) {
             if (dockerPS[i].includes('reg.analitic.cl/tiktok_scrap')) {
                 dockerID = dockerPS[i].split(' ')[0];
                 break;
             }
         }
    });
    command.on('close', function(code) {
        return callback(dockerID);
    });
}

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

//https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Rutas
app.get('/', (request, response) => {
    return response.send({
        message: 'c:'
    });
});

// Mostrar todos los perfiles
app.get('/perfiles', (request, response) => {
    pool.query('SELECT * FROM perfiles', (error, result) => {
        if (error) throw error;
        //console.log('GET: Lista Perfiles');
        return response.send(result);
    });
});

// Mostrar perfil en específico + ultima info
app.get('/perfiles/:perfilId', (request, response) => {
    let id = null
    if (request.params.perfilId) {
        id = request.params.perfilId;
    }
    pool.query('SELECT * FROM perfiles WHERE idPerfil = ?', id, (error, result) => {
        if (error) throw error;
        invObj = {
                idPerfil: '+',
                date: 'INVALID QUERY',
                username: 'INVALID QUERY',
                url: '',
                nombre_cuenta: 'INVALID QUERY',
                siguiendo: 'INVALID QUERY',
                seguidores: 'INVALID QUERY',
                me_gusta: 'INVALID QUERY',
                videos: 'INVALID QUERY',
                descripcion: 'INVALID QUERY',
                links: 'INVALID QUERY',
                status: 'INVALID QUERY',
                img_url: ''
            }
        // Si no se encuentra el idPerfil buscado, se retorna un objeto indicando query inválida
        if (result.length == 0) {
            //console.log('GET: Perfil - Query inválida: ' + id);
            return response.send(invObj);
        }
        pool.query(`SELECT * FROM data_perfil WHERE idPerfil = ${result[0].idPerfil} ORDER BY idData DESC LIMIT 1`, (error, result2) => {
            if (result2.length == 0) {
                //console.log('GET: Perfil - Query inválida: ' + id);
                return response.send(invObj);
            }
            let status = 'Listo'
            let busy = false
            let percent = ((100*(result2[0].loopVideo))/(result2[0].videos)).toFixed(2);
            if (result2[0].ready == 1) {
                status = 'Scroll Videos'
                busy = true
            } else if (result2[0].ready == 2) {
                status = `Preparando: ${result2[0].loopVideo}/${result2[0].videos} - ${percent}% Completado`
                busy = true
            } else if (result2[0].ready == 3) {
                status = `Error en video: ${result2[0].loopVideo} - ${percent}% Completado`
            }
            fecha = formatFecha(result2[0].date).replace(`/`,'-').replace(`/`,'-').replace(`:`,'-').replace(`:`,'-')
            fileName = `${result[0].username} ${fecha}.csv`
            obj = {
                idPerfil: result[0].idPerfil,
                date: result2[0].date,
                username: result[0].username,
                url: result[0].url,
                nombre_cuenta: result[0].nombre_cuenta,
                siguiendo: result2[0].siguiendo,
                seguidores: result2[0].seguidores,
                me_gusta: result2[0].me_gusta,
                videos: result2[0].videos,
                descripcion: result[0].descripcion,
                links: result[0].links,
                status: status,
                img_url: result2[0].img_url,
                fileName: fileName
            }
            if (status == 'Scroll Videos') {
                obj.videos = 'Contando'
            }
            //console.log('GET: Perfil - ID Perfil: ' + id);
            obj.date = formatFecha(obj.date)
            obj.busy = busy
            return response.send(obj)
        })
    });
});

// Mostrar todos los videos de usuario (TODAS las recopilaciones)
app.get('/perfiles/:perfilId/videosALL', (request, response) => {
    const id = request.params.perfilId;
    pool.query('SELECT * FROM videos WHERE idPerfil = ?', id, (error, result) => {
        if (result.length == 0) {
            return response.send(result)
        }
        if (error) throw error;
        //console.log('GET: VideosALL - ID Perfil: ' + id);
        for (var i = 0; i < result.length; i++) {
            result[i].fecha = formatFecha(result[i].fecha)
            result[i].date = formatFecha(result[i].date)
        }
        return response.send(result);
    });
});

// Mostrar todos los videos de usuario (de la ultima recolepción)
app.get('/perfiles/:perfilId/videos', (request, response) => {
    const id = request.params.perfilId;
    const obj = [{
            idVideo: 'INVALID QUERY',
            date: 'INVALID QUERY',
            dia: 'INVALID QUERY',
            username: 'INVALID QUERY',
            idPerfil: 'INVALID QUERY',
            video_n: 'INVALID QUERY',
            url: '',
            vistas: 'INVALID QUERY',
            descripcion: 'INVALID QUERY',
            fecha: 'INVALID QUERY',
            musica: 'INVALID QUERY',
            me_gusta: 'INVALID QUERY',
            comentarios: 'INVALID QUERY',
            engagement: 'INVALID QUERY' } ]
    pool.query('SELECT date FROM videos WHERE idPerfil = ? ORDER BY date DESC LIMIT 1', id, (error, result) => {
        if (error) throw error;
        // Si no se encuentra el idPerfil buscado, se retorna un objeto indicando query inválida
        if (result.length == 0) {
            //console.log('GET: Videos - Query inválida: ' + id);
            return response.send(obj)
        }
        pool.query('SELECT * FROM videos WHERE date = ?', result[0].date, (error, result2) => {
            if (result.length == 0) {
                //console.log('GET: Videos - No hay videos en id: ' + id);
                return response.send(obj)
            }
            if (error) throw error;
            //console.log('GET: Videos - ID Perfil: ' + id);
            for (var i = 0; i < result2.length; i++) {
                result2[i].fecha = formatFecha(result2[i].fecha)
                result2[i].date = formatFecha(result2[i].date)
                result2[i].dia = formatDia(result2[i].dia)
            }
            return response.send(result2);
        });
    });
});
// Mostrar video en específico por ID
app.get('/perfiles/:perfilId/videos/:videoId', (request, response) => {
    const idP = request.params.perfilId;
    const idV = request.params.videoId;
    pool.query('SELECT * FROM videos WHERE idPerfil = ? AND idVideo = ?', [idP, idV], (error, result) => {
        if (error) throw error;
        if (result.length == 0) {
            return response.send(result);
            //console.log('GET: ID Video - Query inválida: ' + idV + ' - ID Perfil: ' + idP);
        } else {
            pool.query('SELECT * FROM videos WHERE idPerfil = ? AND url = ? ORDER BY date DESC', [idP, result[0].url], (error, resultVid) => {
                if (resultVid.length == 0) {
                    return response.send(resultVid)
                }
                //console.log('GET: ID Video: ' + idV + ' - ID Perfil: ' + idP);
                var lastV = 0
                var lastMG = 0
                var lastC = 0
                var lastE = 0

                // Remover duplicados de día
                var lastD = ''
                var no_dup = []
                for (var i = 0; i < resultVid.length; i++) {
                    if (new Date(resultVid[i].dia).getTime() !== new Date(lastD).getTime()) {
                        no_dup.push(resultVid[i])
                    }
                    lastD = resultVid[i].dia
                }

                // Calcular crecimiento de video
                for (var i = no_dup.length-1; i > -1; i--) {
                    no_dup[i].fecha = formatFecha(no_dup[i].fecha)
                    no_dup[i].date = formatFecha(no_dup[i].date)
                    no_dup[i].dia = formatDia(no_dup[i].dia)
                    if (i == no_dup.length-1) {
                        no_dup[i].crecimientoV = 'Original'
                        no_dup[i].crecimientoMG = 'Original'
                        no_dup[i].crecimientoC = 'Original'
                        no_dup[i].crecimientoE = 'Original'
                        lastV = no_dup[i].vistas
                        lastMG = no_dup[i].me_gusta
                        lastC = no_dup[i].comentarios
                        lastE = no_dup[i].engagement
                    } else {
                        no_dup[i].crecimientoV = no_dup[i].vistas - lastV
                        no_dup[i].crecimientoMG = no_dup[i].me_gusta - lastMG
                        no_dup[i].crecimientoC = no_dup[i].comentarios - lastC
                        no_dup[i].crecimientoE = no_dup[i].engagement - lastE
                        lastV = no_dup[i].vistas
                        lastMG = no_dup[i].me_gusta
                        lastC = no_dup[i].comentarios
                        lastE = no_dup[i].engagement
                    }
                }
                return response.send(no_dup);
            });
        }
    });
});

//Scrap
// ---------- CAMBIAR ACA PARA USAR OTRA FORMA DE EJECUTAR CONTENEDOR DOCKER ----------
app.post('/scrap', (req, res) => {
    var dataToSend;
    let input = req.body.input;
    if (input == '') {
        return
    }
    let sep = input.split(',')
    let str = ''
    for (var i = 0; i < sep.length; i++) {
        str = str + 'Obteniendo datos de: ' + sep[i].trim()
        if (i+1 < sep.length) {
            str = str + '\n'
        }
    }
    res.send(str)
    console.log('-------------------\n' + str + '\n-------------------')

    getDockerID(function(idResult) {
        const scraperDocker = spawn('docker', ['exec', idResult, 'python', 'main.py', input]);
        console.log(`ID Docker Image: ${idResult}`);
        scraperDocker.stdout.on('data', function (data) {
            console.log('------------------');
            console.log('Data pipe desde scrip python ...');
            dataToSend = data.toString();
            console.log(dataToSend);
        });
        scraperDocker.stderr.on('data', (data) => {
            console.error(`GET Scraper: child stderr:\n${data}`);
        });
        scraperDocker.on('error', (err) => {
            console.error(`GET Scraper: ERROR: ${err}`);
        });
        scraperDocker.on('close', (code, signal) => {
            console.log(`GET Scraper: Proceso hijo se cerró con código: ${code}`);
            console.log(`GET Scraper: Señal que terminó el proceso: ${signal}`);
        });
    });
})

//Descargar CSV
app.get('/datavideos/:perfilId', (req, res) => {
    const idPerfil = req.params.perfilId;
    pool.query('SELECT date, username FROM videos WHERE idPerfil = ? ORDER BY date DESC LIMIT 1', idPerfil, (error, result) => {
        if (error) throw error;
        if (result.length == 0) {
            return res.send()
        }
        pool.query('SELECT * FROM videos WHERE date = ?', result[0].date, (error, result2) => {
            if (result2.length == 0){
                return res.send()
            }
            if (error) throw error;
            arrVid = []
            for (var i = 0; i < result2.length; i++) {
                obj = {}
                obj.idVideo = result2[i].idVideo
                obj.video_n = result2[i].video_n
                obj.fecha_vid = formatFecha(result2[i].fecha)
                obj.url = result2[i].url
                obj.descripcion = result2[i].descripcion
                obj.musica = result2[i].musica
                obj.vistas = result2[i].vistas
                obj.comentarios = result2[i].comentarios
                obj.engagement = result2[i].engagement
                arrVid.push(obj)
            }

            fields = ["idVideo", "video_n","fecha_vid","url", "descripcion","musica","vistas","comentarios","engagement"]
            fecha = formatFecha(result2[0].date).replace(`/`,'-').replace(`/`,'-').replace(`:`,'-').replace(`:`,'-')

            fileName = `${result2[0].username} ${fecha}.csv`
            const json2csv = new Parser({ fields });
            const csv = json2csv.parse(arrVid);
            res.header('Content-Type', 'text/csv');
            res.attachment(fileName);
            console.log(`Descarga CSV: ${fileName}`);
            return res.send(csv);
        });
    });
})

//404
app.get('*', function(req, res){
  res.status(404).send({
      message: 'No se reconoce la ruta: 404 :('
  });
});

//Iniciar el servidor
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Servidor escuchando en puerto: ${server.address().port}`);
});
