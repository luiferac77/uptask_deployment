//creando el servidor node con express
const express = require('express');

//crear una app de express
const app = express();

/* 
Voy a especificar ahora la ruta para el home, que es lo que node va a
mostrar al inicio
*/
//use se usa de forma general para cualquier petición de http
//Se puede usar app.post o app.get por ejemplo. Con use no importa
//que tipo de petición sea

const productos = [
    {
        producto: 'libro', 
        precio:20 
    },
    {
        producto: 'computadora', 
        precio: 10000
    }
];
app.use('/', (request, response) => {
//request es la petición al servidor, response es la respuesta
response.send(productos); //envio una respuesta
//response.json(productos); //puedo enviar el arreglo en formato json pára que otra aplicación los consuma
});


app.listen(3000); //puerto por el que escucha
/*
para arrancar el servidor, hay que indicar como va a hacerlo en
en scripts del archivo package.json
Donde se colocará el punto de arranque, que será el archivo index.js
"start" será la instrucción para arrancar el servidor
*/
