const Sequelize = require('sequelize');

const db = require('../config/db');

const slug = require('slug');

const shortid = require('shortid');

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    }, 
    nombre: {
        type: Sequelize.STRING
    }, 
    url:{
        type: Sequelize.STRING
    }
},{
    hooks: {
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});
/*para no agregar demasiado código en el controlador para preparar los datos que
van a ser enviados a la BD, se agregan los hooks al modelo, que se ejecutarán en un momento especificado
*/
module.exports = Proyectos;