/* 
con babel se puede usar import en lugar de require
este archivo es la entrada del bundle. Aquí se va a
importar todo lo que haga en proyectos.js 
*/
import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avances';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})