const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto'); //viene definido con nodejs para generar token
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario es autenticado, ejecuta el siguiente middleware,
    //que seria proyectosController.proyectosHome
    if(req.isAuthenticated()){
        return next();
    }
    //si no es autenticado vuelve a iniciar sesiión
    return res.redirect('/iniciar-sesion');

}

//función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesión nos lleva al login
    });
}

//genera un token
exports.enviarToken = async (req, res) => {
    //verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});
    console.log(usuario);
    //si existe el usuario
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.redirect('/reestablecer');
        /*res.render('restablecer',{
            nombrePagina: 'Reestablecer tu password',
            mensajes: req.flash()
        });*/
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //envia email con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'resetear password',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    // terminar
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({ 
        where: 
            { token:  req.params.token }     
        }
    );

    //si no encuentra el susurio
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer')
    }

    res.render('resetPassword',{
        nombrePagina: 'Reestablecer password'
    });
}

exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo password
    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //guardamos el nuevo password
    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}