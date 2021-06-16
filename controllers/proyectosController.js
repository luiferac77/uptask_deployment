const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');

exports.proyectosHome = async (req, res) => {
    //esto lo hago para listar todos los proyectos en la BD
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //paso el resultado de la consulta a la vista
    res.render('index',{
        nombrePagina: 'Proyectos',
        proyectos: proyectos
    });
}
exports.formularioProyectos = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina: 'nuevo proyecto', 
        proyectos
    });
}
exports.nuevoProyecto = async(req,res) => {
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //validar que tengamos algo en el input
    const{ nombre } = req.body;
    let errores = [];
    if (!nombre){
        errores.push({'texto': 'Agregar un nombre al proyecto'});
    }
    if(errores.length > 0){ //renderizo la páguna nuevoProyecto y envío el error a la página
        res.render('nuevoProyecto',{
            nombrePagina: 'nuevo proyecto', 
            errores,
            proyectos
        });
    } else {
        //insertar en la BD
        //const url = slug(nombre).toLocaleLowerCase(); *esto debe ir al modelo
        const usuarioId = res.locals.usuario.id;
        const Proyecto = Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => { 
        //res.send(req.params.url);
        const usuarioId = res.locals.usuario.id
        const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

        const proyectoPromise = Proyectos.findOne({
            where: {
                 url: req.params.url,
                 usuarioId
            }
        });

        const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
        console.log(proyecto);
        
        //consultar tareas del proyecto actual
        const tareas = await Tareas.findAll({
            where: {
                proyectoId: proyecto.id
            }
        });

        if(!proyecto) {
            return next()
        };

        res.render('tareas',{
            nombrePagina: 'Tareas del proyecto',
            proyecto,
            proyectos,
            tareas
        });
}

exports.formularioEditar = async (req, res) => {

    /*
    cuando son bloques de código independientes, no se usa async await
    en las peticiones del modelo. Ya que no se necesita que un bloque
    finalice para que recién se ejecute el oro bloque
    */
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar proyecto',
        proyectos,
        proyecto
    });

}

exports.actualizarProyecto = async(req,res) => {
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //validar que tengamos algo en el input
    const{ nombre } = req.body;
    let errores = [];
    if (!nombre){
        errores.push({'texto': 'Agregar un nombre al proyecto'});
    }
    if(errores.length > 0){ //renderizo la páguna nuevoProyecto y envío el error a la página
        res.render('nuevoProyecto',{
            nombrePagina: 'nuevo proyecto', 
            errores,
            proyectos
        });
    } else {
        //insertar en la BD
        //const url = slug(nombre).toLocaleLowerCase(); *esto debe ir al modelo
        await Proyectos.update(
            {nombre: nombre}, 
            {where: { id: req.params.id }}
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    //se puede usar req.query o req.params para pasar los datos
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url: urlProyecto}})
    if(!resultado){ 
    //en el caso que no haya resultado, es decir que falle la eliminación, pasará al siguiente middleware
    //sin mostrar mostrar el mensaje del resultado
        return next();
    }
    res.status(200).send('proyecto eliminado correctamente');
    console.log(req);
}