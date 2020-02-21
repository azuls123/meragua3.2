'use strict' // Habilita el uso de cualquiera de librerias de forma forzada y el uso de los nuevos standares de JavaScript 6 //
//=================Declaracion de variables //
// Variable del esquema del modelo //
var Bill = require('../models/bill');
// Variable de Registros //
var Register = require('../models/register');
// Variable TimeStamp //
var moment = require('moment');
//=================Declaracion de Funciones //
// Funcion de register de datos //
function save(req, res) {
    var bill = new Bill;
    var params = req.body;
    bill.updated_by = req.user.sub;
    bill.updated_at = moment().unix();
    bill.created_by = req.user.sub;
    bill.created_at = moment().unix();

    bill.fecha = params.fecha;
    bill.total = params.total;
    bill.pago = params.pago;
    bill.tarifa = params.tarifa;
    bill.base = params.base;
    bill.exceso = params.exceso;
    bill.subtotal = params.subtotal;
    bill.importes = params.importes;
    bill.descuentos = params.descuentos;
    bill.claveAccesso = params.claveAccesso;
    bill.medidor = params.medidor;
    bill.usuario = params.usuario;
    bill.cliente = params.cliente;
    bill.registro = params.registro;
    Bill.find({
        registro: bill.registro
    }).exec((error, response) => {
        if (error) return res.status(500).send({
            Message: 'Error al ejecutar la peticion para comprobar Factura Unica'
        });
        if (response.length >= 1) return res.status(304).send({
            Message: 'La factura de este registro de consumo ya ha sido ingresada..'
        });
        if (!response || response.length <= 0) {
            bill.save((errorSave, responseSave) => {
                if (errorSave) return res.status(500).send({
                    Message: 'Error al ejectuar la peticion',
                    Error: errorSave
                });
                if (!responseSave || responseSave.length <= 0) return res.status(404).send({
                    Message: 'El servidor no ha arrojado ninguna respuesta....'
                });
            // return res.status(201).send({
            //     Message: 'Factura Guardada Correctamente!',
            //     Factura: responseSave
            // });
             Register.findByIdAndUpdate(responseSave.registro, {facturado: true}, (errorRegister,responseRegister)=>{
                if (errorRegister) return res.status(500).send({Message: 'se ha guardado la factura pero no se ha podido editar el registro de consumo, por favor contacte con el administrador', Error: errorRegister});
                if (!responseRegister) return res.status(404).send({Message: 'Se ha guardado la factura, pero el registro esta intacto...'});
                
                return res.status(201).send({
                    Message: 'Factura Guardada Correctamente!',
                    Factura: responseSave,
                    Registro: responseRegister
                });
             })   
            })
        }
    })
}

function pagoFactura(req, res) {
    var update = req.body
    console.log('pagando factura');
    var user = req.user.sub;
    var id = req.params.id;
    update.updated_at = moment().unix();
    update.updated_by = user;
    Bill.findByIdAndUpdate(id, update, {
        new: true
    }, (err, response) => {
        if (err) return res.status(500).send({
            Message: 'Ha ocurrido un error al ejecutar la peticion al servidor',
            Error: err
        });
        if (!response || response.length <= 0) return res.status(404).send({
            Message: 'El servidor no ha devuelto respuesta...'
        });
        if (response) {
            Register.findByIdAndUpdate(response.registro, {cancelado: true, facturado: true, updated_at: moment().unix(), updated_by: user}, (error, resp) => {
                if (error) return res.status(500).send({Message: 'Error al contactar con la base de datos'});
                if (!resp) return res.status(404).send({Message: 'Error editando el registro'});
                return res.status(200).send({Message: 'Exito al cobrar la factura!', registro: resp, factura: response});
            })
            // Register.findById(response.registro, (errr, resp) => {
            //     // if (errr) return res.status(500).send({
            //     //     Message: 'No se pudo obtener la informacion del registro a facturar...'
            //     // })
            //     // if (!resp || resp.length <= 0) return res.status(500).send({
            //     //     Message: 'No se encontro el registro a facturar'
            //     // });
            //     // if (resp) {
            //     //     let payRegister = resp;
            //     //     payRegister.cancelado = true;
            //     //     payRegister.bill = id;
            //     //     Register.findByIdAndUpdate(payRegister._id, payRegister, {
            //     //         new: true
            //     //     }, (erru, respu) => {
            //     //         if (erru) return res.status(500).send({
            //     //             Message: 'Error al editar la informacion del registro'
            //     //         });
            //     //         if (!respu || respu.length <= 0) return res.status(404).send({
            //     //             Message: 'el servidor no devolvio respuesta...'
            //     //         });
            //     //         return res.status(200).send({
            //     //             Message: 'Factura pagada'
            //     //         });
            //     //     })
            //     // }
            // })
        }
    });
}

function getConteo(req, res) {
    getBillNumber().then((count) => {
        return res.status(200).send({
            Message: 'Correcto',
            count
        })
    })
}
async function getBillNumber() {
    var total = await Bill.countDocuments({
        pago: {
            $nin: ['debe']
        }
    }).exec().then((count) => {
        console.log('Count');

        if (count == 0) {
            return count = 1;
        } else {
            return count;
        }
        return count;
    })
    return total;
}

function show(req, res) {
    Bill.find().populate(' registro tarifa created_by updated_by').exec((error, response) => {
        if (error) return res.status(500).send({
            Message: 'error al ejecutar la peticion al servidor...',
            Error: error
        });
        if (!response) return res.status(404).send({
            Message: 'el servidor no ha devuelto ninguna respuesta'
        })
        return res.status(200).send({
            Message: 'Obteniendo lista de Facturas',
            Bill: response
        });
    })
}

function getFactura(req, res) {
    Bill.findById(req.params.id).populate(' registro tarifa created_by updated_by').exec((error, response) => {
        if (error) return res.status(500).send({
            Message: 'error al ejecutar la peticion',
            Error: error
        });
        if (!response) return res.status(404).send({
            Message: 'No existe esta factura'
        });
        return res.status(200).send({
            Message: 'Factura Encontrada!...',
            factura: response
        });
    })
}

function getFacturaByRegister(req, res) {
    Bill.findOne({
        registro: req.params.id
    }).populate(' registro datoFacturado').exec((error, response) => {
        if (error) return res.status(500).send({
            Message: 'error al ejecutar la peticion',
            Error: error
        });
        if (!response) return res.status(404).send({
            Message: 'No existe esta factura'
        });
        return res.status(200).send({
            Message: 'Factura Encontrada!...',
            factura: response
        });
    });
}

function getFacturaByUser(req, res) {
    var id = req.params.id;
    Bill.find({
        usuario: id
    }).populate('usuario registro created_by updated_by').exec((err, response) => {
        if (err) return res.status(500).send({
            Message: 'error al ejecutar la peticion en el servidor',
            Error: err
        });
        if (!response) return res.status(404).send({
            Message: 'error al consultar las facturas del usuario'
        });
        if (response && response.length <= 0) return res.status(200).send({
            Message: 'el usuario no tiene facturas!...'
        });
        if (response && response.length >= 1) return res.status(200).send({
            Message: 'Facturas del usuario cargadas correctamente!',
            bills: response
        });
    })
}
module.exports = {
    save,
    show,
    getConteo,
    pagoFactura,
    getFactura,
    getFacturaByRegister,
    getFacturaByUser
}