const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuenta en Uptask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar sesión en Uptask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    //leer los datos
    const {email, password} = req.body;

    try{
        await Usuarios.create(
            {
                email,
                password
            }
        );
        //Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //Crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar unsuario',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });    
        //redirigir al usuario
        req.flash('correcto','Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
            //email y password se envian nuevamente para que no quede en blanco el formulario
            //en caso que el parametro se llame igual que el campo no se necesita lo siguiente: email:email
        })
    }
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer tu password'
    });
}

exports.confirmarCuenta = async (req, res) => {
    //cambia el estado de una cuenta
    const usuario = await Usuarios.findOne({
        where: {email: req.params.correo}
    });

    if(!usuario){
        req.flash('error', 'no valido');
        res.redirect('7crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'cuanta activada');
    res.redirect('/iniciar-sesion');
}