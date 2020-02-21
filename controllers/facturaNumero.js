'use strict'

var FacturaNumero = require('../models/facturaNumero');

var moment = require('moment');

function save(req, res) {
    var params = req.body;
    var facturaNumero = new FacturaNumero
    facturaNumero.num_min   = params.num_min;
    facturaNumero.num_max   = params.num_max;    
    facturaNumero.caduca    = params.caduca;   
    facturaNumero.codigoTalonario    = params.codigoTalonario;       
    facturaNumero.estado    = params.estado;       
    facturaNumero.created_at= moment().unix();
    facturaNumero.created_by= req.user.sub;
    facturaNumero.save((err, response) => {
        if (err) return res.status(500).send({Message: 'error al contactar con la base de datos', Error: err});
        if (!response) return res.status(404).send({Message: 'no se ha podido guardar el rango de facturas'});
        return res.status(201).send({Message: 'exito al guardar el rango de facturas'});
    });
}

function update(req, res) {
    var id = req.params.id;
    var params = req.body;
      
    params.updated_at= moment().unix();
    params.updated_by= req.user.sub;
    FacturaNumero.findByIdAndUpdate(id, params, {new: true}, (err, updated) => {
        if (err) return res.status(500).send({Message: 'Error al contactar con la base de datos'});
        if (!updated) return res.status(404).send({Message: 'No se pudo editar el rango de la tarifa'});
        return res.status(200).send({Message: 'Edicion exitosa!', updated});
    })
}
function gets(req, res) {
    FacturaNumero.find().populate('created_by updated_by').exec((error, response) => {
        if (error) return res.status(500).send({Message: 'Error al conectar con la Base de Datos'});
        if (!response) return res.status(404).send({Message: 'No se pudop obtener los registros del rango de facturas'});
        if (response.length <=0) return res.status(200).send({Message: 'no existen rangos de facturas ingresados'});
        return res.status(200).send({Message: 'Rangos de facturas obtenidos correctamente...', Numeros: response})
    })
}
module.exports = {
    save,
    update,
    gets
}