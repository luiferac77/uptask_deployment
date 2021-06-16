const express = require('express');
const routes = require('./routes'); //hago el llamado a las rutas. No epceficio el index.js porque por defecto busca ese archivo
const path = require('path'); //librerira de node para leer el path de directorios
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({path: 'variables.env'});
//const expressValidator = require('express-validator');

//helpers
const helpers = require('./helpers');

//Crear la conexión a la bd
const db = require('./config/db');
const { appendFile } = require('fs');
const { RSA_NO_PADDING } = require('constants');

//importo el mmodelo
require('./models/Proyectos');
require('./models/tareas');
require('./models/Usuarios');

db.sync() //db.authenticate conecta a la base de datos, db.sync crea las tablas según el modelo
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error))


//creo la app express
const app = express();

//app.use(expressValidator());
//donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar pug 
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
//import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({extended: true}));

//añadir la carpeta de las vistas
app.set('views', path.join(__dirname,'./views'));

app.use(flash());
app.use(cookieParse());
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la app
app.use((req,res, next) => {
    //al almacenar en locals paso los datos para que sean usados en los controladores
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; //en caso de que req.user no tenga nada asigna el valor null
    next(); //garantiza que pase a la siguient middelware
});


app.use( '/',routes() ); //asi defino el acceso a todas las rutas definidas en route. 

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('el servidor está funcionando');
}); //ecucha por el puerto 3000

require('./handlers/email');