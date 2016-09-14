var nodemailer = require("nodemailer");

exports.enviarMail = function(req, resp){
  var nombre = req.body.nombre;
  var para = req.body.para;
  var asunto = req.body.asunto;
  var contenido = req.body.contenido;

 var smtpTransport = nodemailer.createTransport("SMTP",{
  service: 'Gmail',  // sets automatically host, port and connection security settings
  auth: {
          user: 'PruebaTicJon@gmail.com',
          pass: 'jonathan8129413'
         }
 });
 smtpTransport.sendMail({  //email options
    from: nombre, // sender address.  Must be the same as authenticated user if using GMail.
    to: para, // receiver
    subject: asunto, // subject
    text: contenido // body
 }, function(error, response){
    smtpTransport.close();
    if(error) {
    resp.send(500);
    } else {
    resp.send(200);
}
 });
}
