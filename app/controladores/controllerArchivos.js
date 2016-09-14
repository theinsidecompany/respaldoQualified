var Solicitud = require('../modelo/solicitud');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var xlsxj = require("xlsx-to-json");
var node_xj = require("xls-to-json");
var jsonfile = require('jsonfile')


function obtenerExtension(nombre) {
    return (/[.]/.exec(nombre)) ? /[^.]+$/.exec(nombre)[0] : undefined;
}

function excel(nombre){

  var extension = obtenerExtension(nombre);
  var json;

  tmp = {input: "/tmp/" + nombre, output: "/tmp/" + nombre + ".json"};

  if (extension === 'xls') {



    node_xj(tmp , function(err, result) {
      if(err) {
        node_xj({
          input: "/tmp/" + nombre,  // input xls
          output: "/tmp/" + nombre + ".json" // output json
        }, function(err, result) {
          if(err) {
            console.error(err);
          } else {
            console.log('ok');
            json = result;
          }
        });
      } else {
        console.log('ok');
        json = result;
      }
    });
  }else if(extension === 'xlsx'){

    xlsxj(tmp , function(err, result) {
      if(err) {
        xlsxj(tmp , function(err, result) {
          if(err) {
            console.log(err);
          }else {
            console.log('ok');
            json = result;
          }
        });
      }else {
        console.log('ok');
        json = result;
      }
    });

  }else{

    console.log('archivo no permitido');

  }

}

exports.AgregarLotesUpload = function(req, resp){

  var fileAux;
  var jsonLotes;
  // create an incoming form object
  var form = new formidable.IncomingForm();
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  form.uploadDir = path.join('/tmp');
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {

    fileAux = file;

    fs.rename(file.path, path.join(form.uploadDir, file.name));

  });
  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    console.log('success');
    excel(fileAux.name);

  });
  // parse the incoming request containing the form data
  form.parse(req);

}

exports.traerLotesExcel = function(req, resp){

  // var json = "/tmp/" + fileAux.name + ".json"
  var json = "/tmp/" + req.params.nombre_archivo +".json";
  jsonfile.readFile(json, function(err, obj) {
    if (err) {
      jsonfile.readFile(json, function(err, obj) {
        resp.send(obj)
      });
    }else{
      resp.send(obj)
    }
  })

}
