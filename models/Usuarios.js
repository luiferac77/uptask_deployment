const Sequelize = require('sequelize');
const { validate } = require('webpack');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type:Sequelize.STRING(60),
        allowNull: false, //no permite valores nulos
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            }, 
            notEmpty:{
                msg: 'El e-mail no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//método personalizado con herencia de prototipos
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}


Usuarios.hasMany(Proyectos); //un usuario puede crear muchos proyectos
module.exports = Usuarios;