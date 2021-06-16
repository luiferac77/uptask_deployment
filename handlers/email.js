const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailconfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailconfig.host,
    port: emailconfig.port, 
    auth: {
        user: emailconfig.user,
        pass: emailconfig.pass
    }
});

//generar html
const generarHtml = (archivo, opciones = {}) => {
    //console.log('url: ' + opciones.resetUrl);
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    //console.log(opciones.resetUrl);
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail);
}