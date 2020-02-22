'use strict'
var DatoFactura = require('../models/datoFactura');
var moment = require('moment');
function save(req,res) {
    var datoFactura = new DatoFactura;
    var params = req.body;
    datoFactura.tipoComp   = params.tipoComp ;
    datoFactura.ruc        = params.ruc      ;
    datoFactura.tipoAmb    = params.tipoAmb  ;
    datoFactura.serie      = params.serie    ;
    datoFactura.tipEmi     = params.tipEmi   ;
    datoFactura.codNum     = params.codNum   ;
    datoFactura.nombres    = params.nombres  ;
    datoFactura.apellidos  = params.apellidos;
    datoFactura.created_at = moment().unix();
    datoFactura.created_by = req.user.sub;
    datoFactura.save((error, response) => {
        if (error) return res.status(500).send({Message: 'Error al contactar con la base de datos', Error: error});
        if (!response) return resstatus(404).send({Message: 'No se ha podido guardar el dato de facturación'});
        return res.status(201).send({Message: 'Exito al guardar los datos de facturación', datoFactura: response});
    });
}
function show(req, res) {
    DatoFactura.find().populate('created_by').exec((error, response) => {
        if (error) return res.status(500).send({Message: 'Error al contactar con la base de datos', Error: error});
        if (!response) return resstatus(404).send({Message: 'No se ha podido Obtener el dato de facturación'});
        return res.status(200).send({Message: 'Exito al Obtener los datos de facturación', datoFactura: response});
    });
}

module.exports = {
    save,
    show
}