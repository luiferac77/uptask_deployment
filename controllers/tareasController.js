//const { noExtendLeft } = require('sequelize/types/lib/operators');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');

exports.agregarTarea = async (req, res, next) => {
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: { url: req.params.url }
    });

    //leer el valor del input
    const {tarea} = req.body;

    //estado 0 incompleto
    const estado = 0;
    //id del proyecto
    const proyectoId = proyecto.id;

    //insertar y redireccionar
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {id: id}
    });
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    } 
    tarea.estado = estado;

    const resultado = await tarea.save();
    if(!resultado) return next();
    res.status(200).send('actualizado');
}

exports.eliminarTarea = async (req, res,next) => {
    const {id} = req.params;

    const resultado = await Tareas.destroy({where: {id : id}});
    if(!resultado){
        return next();
    }

    res.status(200).send('eliminado...')
}