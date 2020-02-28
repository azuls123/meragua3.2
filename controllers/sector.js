'use strict'

var Sector = require('../models/sector');
var moment = require('moment');

function save(req, res) {
    var params = req.body;
    var sector = new Sector;
    if (params.nombre) {
        sector.nombre = params.nombre;
        sector.codigo = params.codigo;
        sector.activa = params.activa;
        sector.referencia = params.referencia;
        sector.created_at = moment().unix();
        sector.created_by = req.user.sub;
        Sector.find({
            $or: [{
                    "nombre": sector.nombre
                },
                {
                    "codigo": sector.codigo
                },
                {
                    "referencia": sector.referencia
                }
            ]
        }).exec((err, response) => {
            if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion en el servidor!.', Error: err});
            if (response && response.length >=1) return res.status(400).send({Message: 'Datos Duplicados!!!...', sectores: response});
            else {
                sector.save((errSave, responseSave) => {
                    if (errSave) return res.status(500).send({Message: 'Error al ejecutar la peticion en el servidor!.', Error: err});
                    if (!responseSave) return res.status(404).send({Message: 'No se pudo guardar el sector...'});
                    sector = new Sector;
                    return res.status(201).send({Message: 'El sector se ha guardado Correctamente!...', sector: responseSave});
                })
            }
            return
        })
    }
}

function updates(req, res) {
    var id = req.params.id;
    var params = req.body;
    params.updated_at = moment().unix();
    params.updated_by = req.user.sub;
    Sector.findByIdAndUpdate(id, params, (err, response) => {
        if (err) return res.status(500).send({Message: 'error al ejecutar la peticion. . .', Error: err});
        if (!response) return res.status(404).send({Message: 'error al actualizar el sector'});
        else return res.status(200).send({Message: 'Exito al Actualizar el Sector!!...', sector: params});
    })
}

function gets(req, res) {
    Sector.find().populate('created_by updated_by').exec((err, response) => {
        if (err) return res.status(500).send({Message: 'error al ejecutar la peticion. . .', Error: err});
        if (!response) return res.status(404).send({Message: 'error al Devolver la lista de Sectores'});
        else return res.status(200).send({Message: 'Exito al Devolver la Lista de Sectores!!...', sectores: response});
    })
}

function get(req, res) {
    var id = req.params.id;
    Sector.findById(id, (err, resp)=> {
        if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion en el servidor!...', Error :err});
        if (!resp) return res.status(404).send({Message: 'no se encuentra el sector!!'});
        return res.status(200).send({Message: 'Sector Encontrado!...', Sector: resp})
    })
}
module.exports = {
    save,
    updates,
    gets,
    get
}