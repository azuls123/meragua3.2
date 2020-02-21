'use strict' // Habilita el uso de cualquiera de librerias de forma forzada y el uso de los nuevos standares de JavaScript 6 //
//=================Declaracion de variables //
// Variable del esquema del modelo //
var moment = require('moment');
var Limits = require('../models/limits');
//=================Declaracion de Funciones //
// Funcion de register de datos //
function save(req, res) {
    // variable para la recoleccion de datos del formulario //
    var params = req.body;
    // variable para la definicion del objeto con respecto al modelo //
    var limits = new Limits;
    // variable de fecha //
    var today = new Date();
    var currDate = today.getFullYear() + ' - ' + (today.getMonth() + 1) + ' - ' + today.getDate();
    // Log de Comprobacion //
    console.log("Dentro de save");
    // Asignacion de los parametros al modelo del Controlador //
    limits.limit_to = params.limit_to;
    limits.limit_from = params.limit_from;
    limits.cost = params.cost;
    limits.percent_cost = params.percent_cost;
    limits.created_by = req.user.sub;
    limits.created_at = moment().unix();
    limits.rate_id = req.params.rate;
    // comprobacion de los valores obligatorios enviados desde el formulario //
    if (limits.rate_id) {
        // Logs de Comprobacion //
        // Instruccion Save de Mongoose para Guardar los Parametros en MongoDB //
        // usando un callback para el 'Catcheo' de Errores //
        limits.save((err, limitsStored) => {
            // Sentencia 'Si' para comprobar la existencia de errores //
            if (err) return res.status(500).send({ Message: 'error al enviar la peticion' });
            // Sentencia 'Si' para comprobar la existencia de valores dentro del Objeto //
            if (!limitsStored) return res.status(404).send({ Message: 'limite vacio' });
            // Sentencia 'Entonces' complementaria al 'Si' para identificar un objeto vacio //
            return res.status(200).send({ Message: 'limite agregado correctamente', limitsStored });
        })

    }
    // en caso de que los datos esten incompletos o dañados se envia un mensaje de error //
    else {
        res.status(200).send({
            Message: 'Datos faltantes o erroneos'
        })
    }
}
function show(req, res){
    var rate = req.params.rate;
    Limits.find({rate_id: rate}, (err, resp) =>{
        if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion al servidor', Error: err})
        if (!resp) return res.status(404).send({Message: 'No se encotraron los limites de la tarifa'})
        return res.status(200).send({Message: 'Peticion correcta...', Limits: resp});
    })
}
function showAll(req, res){
    Limits.find().exec((err, resp) =>{
        if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion al servidor', Error: err})
        if (!resp) return res.status(404).send({Message: 'No se encotraron los limites de la tarifa'})
        return res.status(200).send({Message: 'Peticion correcta...', Limits: resp})
    })
}
// Funcion de Obtencion de Datos //
function shows(req, res) {
    var page = 1;
    var itemsPerPage = 8;
    if (req.params.page) page = req.params.page;
    var params = req.body;

    if (params.items) itemsPerPage = parseInt(params.items);
    Limits.find().paginate(page, itemsPerPage, (err, get, total) => {
        if (err) return res.status(500).send({ Message: 'error al procesar la peticion' });
        if (!get) return res.status(404).send({ Message: 'no se pudo procesar la peticion, vacia' });
        return res.status(200).send({
            Total: total,
            Pages: Math.ceil(total / itemsPerPage),
            Limits: get
        })
    });
}
// Funcion Editar //
function update(req, res) {
    var id = req.params.id;
    var updateLimits = req.body;
    Limits.findByIdAndUpdate(id, updateLimits, { new: true }, (err, limitsUpdated) => {
        if (err) return res.status(500).send({ Message: 'error al ejecutar la peticion... ', Error: err });
        if (!limitsUpdated) return res.status(404).send({ Message: 'Error al editar el Limite' });
        return res.status(200).send({ Message: 'el limite id: ' + id + ' ha sido editado', limitsUpdated });
    });
}
// Funcion Borrar //
function remove(req, res) {
    var id = req.params.id;
    Limits.find({rate_id: id}, (err, resp) =>{
        if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion al servidor', Error: err})
        if (!resp) return res.status(404).send({Message: 'No se encotraron los limites de la tarifa'})
        if (resp) {
            removing(resp, resp.length).then((check)=> {
                if (check==true) return res.status(200).send({Message: 'Exito al borrar los limites...'});
                else return res.status(500).send({Message: 'error en el proceso de borrado de datos' +check , Error: check})
            })
        }
    })
}
function removeLimits(limits, length) {
    console.log('Limites: ',length);
    for (const limite of limits) {
        var id = limite._id;
        Limits.findByIdAndDelete(id, (err, deleted) => {
            if (err) console.log(err);
            if (deleted) console.log(deleted);
        })
    }
    return true;
}
async function removing(limits, length) {
    var check = await removeLimits(limits, length)
    return check
}
module.exports = {
    save,
    show,
    update,
    remove,
    showAll
}