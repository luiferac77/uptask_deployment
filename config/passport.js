const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//Local Strategy - login con credenciales propias
passport.use(
    new LocalStrategy(
        //por default espera usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        //consulta a la base. Done es como next
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //el usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                //email existe y password es correcto
                return done(null, usuario);
            } catch (error) {
                //el usuario no existe
                return done(null,false,{
                    message: 'Esa cuenta no existe'
                });
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;