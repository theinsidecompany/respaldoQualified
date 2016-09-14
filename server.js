// Inicialización
var express = require('express');
var app = express(); // Utilizamos express
var mongoose = require('mongoose'); // mongoose para mongodb
var port = process.env.PORT || 8085; // Cogemos el puerto 8085
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var Grid = require('gridfs-stream');
var Highcharts = require('highcharts');
var HighchartsAnnotations = require('annotations');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
// Configuracion localhost
mongoose.connect('mongodb://192.168.1.53:27017/Tracefeed'); // Hacemos la conexión a la base de datos de Mongo con nombre "'mongodb://192.168.1.53:27017/Jony'"

app.use(express.static(__dirname + '/angular'));
app.use(logger('dev')); // activamos el log en modo 'dev'
app.use(bodyParser.json());
app.use(methodOverride());


conn.once('open', function() {
    var gfs = Grid(conn.db);

    //Metodos subida archivos
    app.post('/evidencias', function(req, res) {
        // create an incoming form object
        var form = new formidable.IncomingForm();
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
        // store all uploads in the /uploads directory
        form.uploadDir = path.join('/tmp');
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
            // streaming to gridfs
            //filename to store in mongodb
            var writestream = gfs.createWriteStream({
                filename: file.name
            });
            fs.createReadStream('/tmp/' + file.name).pipe(writestream);
            writestream.on('close', function(upload) {
                // do something with `file`
                console.log(upload.filename + ' Written To DB');
            });
        });
        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            res.end('success');
        });
        // parse the incoming request containing the form data
        form.parse(req);
    });

});

conn.once('open', function() {
    var gfs = Grid(conn.db);

    app.post('/certificado', function(req, res) {
        // create an incoming form object
        var form = new formidable.IncomingForm();
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;
        // store all uploads in the /uploads directory
        form.uploadDir = path.join('/tmp');
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
            // streaming to gridfs
            //filename to store in mongodb
            var writestream = gfs.createWriteStream({
                filename: file.name
            });
            fs.createReadStream('/tmp/' + file.name).pipe(writestream);
            writestream.on('close', function(upload) {
                // do something with `file`
                console.log(upload.filename + ' Written To DB');
            });
        });
        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            res.end('success');
        });
        // parse the incoming request containing the form data
        form.parse(req);
    });

});

conn.once('open', function() {

    var gfs = Grid(conn.db);

    app.get('/traerCertificado/:nombreCertificado', function(req, res) {

        var options = {
            filename: req.params.nombreCertificado
        };

        var rstream = gfs.createReadStream(options);

        var bufs = [];

        rstream.on('data', function(chunk) {

            bufs.push(chunk);

        }).on('end', function() { // done

            var fbuf = Buffer.concat(bufs);

            var base64 = (fbuf.toString('base64'));

            res.send(base64);
            res.end();
        });

    });

});

conn.once('open', function() {

    var gfs = Grid(conn.db);

    app.delete('/eliminarImg/:nombre', function(req, res) {

        var nombre = req.params.nombre;

        console.log(nombre);
        gfs.remove({
            filename: req.params.nombre
        }, function(err) {
            if (err) return handleError(err);
            console.log('success');
            res.send(null);
        });

    });

    app.delete('/eliminarPdf/:nombre', function(req, res) {

        gfs.remove({
            filename: req.params.nombre
        }, function(err) {
            if (err) return handleError(err);
            console.log('success');
            res.send(null);
        });

    });

});



// Cargamos los endpoints
require('./app/routes.js')(app);

// Cogemos el puerto para escuchar
app.listen(port);
console.log("APP por el puerto " + port);
