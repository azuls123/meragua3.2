'use strict'

var Detalle = require('../models/detalleFactura');

var moment = require('moment')

function saveAll(req, res) {
    var params = req.body;
    var user = req.user.sub;
    var detalle = new Detalle;
    detalle.index       = params.index;
    detalle.detalle     = params.detalle;
    detalle.factura     = params.factura;
    detalle.importe     = params.importe;
    detalle.costo       = params.costo    ;
    detalle.descuento   = params.descuento;
    detalle.nombre      = params.nombre   ;
    detalle.percent     = params.percent  ;
    detalle.subtotal    = params.subtotal ;
    detalle.total       = params.total    ;

    // detalle.updated_by = user;
    // detalle.updated_at = moment().unix();
    detalle.created_by = user;
    detalle.created_at = moment().unix();
    var detalleMessage = 'ingresando detalle';
    detalle.save((err, response)=> {
        if (err) {
            detalleMessage = {Message: 'Error al ejecutar la peticion', Error: err};
            return console.error('Error al ejecutar la peticion', err);
        } 
        if (!response || response.length <=0) {
            detalleMessage = {Message: 'No se pudo ingresar'};
            return console.info('No existe');
        }
        if (response.length >= 1){
            detalleMessage = { Message: 'Datos Guardados'};
            return console.log('Datos Guardados');
        }
        
    });
    return res.status(201).send({Message: detalleMessage})
}

function getDetalle(req, res) {
    var factura = req.params.id;
    console.log(factura);
    
    Detalle.find({factura:factura}).populate('importe factura').exec((error, response) => {
        if (error) return res.status(500).send({Message: 'Error ejecutando la peticion...', Error: error});
        if (!response) return res.status(404).send({Message: 'El servidor no ha respondido', response});
        if (response && response.length<=0) return res.status(200).send({Message: 'No existen detalles de esta factura...', response});
        return res.status(200).send({Message: 'Detalles Cargados.', Detalles: response});
    });
}
function getDetalles(req, res) {
    Detalle.find().populate('importe factura').exec((error, response) => {
        if (error) return res.status(500).send({Message: 'Error ejecutando la peticion...', Error: error});
        if (!response) return res.status(404).send({Message: 'El servidor no ha respondido', response});
        if (response && response.length<=0) return res.status(200).send({Message: 'No existen detalles de esta factura...', response});
        return res.status(200).send({Message: 'Detalles Cargados.', Detalles: response});
    });
}

module.exports = {
    saveAll,
    getDetalle,
    getDetalles
}