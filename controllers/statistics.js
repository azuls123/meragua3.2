'use strict'

var User = require('../models/user');
var Bill = require('../models/bill');
var Meter = require('../models/meter');
var Extra = require('../models/extra');
var Importe = require('../models/importe');
var Rate = require('../models/rate');
var Register = require('../models/register');
var Sector = require('../models/sector');
var Detalle = require('../models/detalleFactura');


function getStaticsByUser(req, res) {
    var id = req.params.id;
    getCountsGeneratedsByUser(id).then((countsGenerateds) => {
        getCountsOnwedByUser(id).then((countsOwneds) => {
            getCountsGlobal().then((countGlobal) => {
                return res.status(200).send({
                    Message: 'Lista de Conteos Generada Correctamente!!...',
                    generateds: countsGenerateds,
                    owners: countsOwneds,
                    globals: countGlobal
                });
            })
        })
    })
}
async function getCountsGeneratedsByUser(id) {
    var users = await User.countDocuments({
        updated_by: id
    }).exec().then((count) => {
        return count;
    })
    var bills = await Bill.countDocuments({
        updated_by: id
    }).exec().then((count) => {
        return count;
    })
    var meters = await Meter.countDocuments({
        updated_by: id
    }).exec().then((count) => {
        return count;
    })
    var extras = await Bill.countDocuments({
        updated_by: id
    }).exec().then((count) => {
        return count;
    })
    var importes = await Importe.countDocuments({
        updated_by: id
    }).exec().then((count) => {
        return count;
    })
    var registers = await Register.countDocuments({
        updated_by: id
    }).exec().then((count) => {
        return count;
    })
    return {
        usuarios: users,
        facturas: bills,
        medidores: meters,
        registros: registers,
        extras,
        importes
    }
}
function getGlobals(req, res) {
    getCountsGlobal().then( (counts) => {
        return res.status(200).send({Message: 'Datos Generales Obtenidos Correctamente!', statistics: counts});
    })
}
async function getCountsGlobal() {
    var bills = await Bill.countDocuments().exec().then((count) => {
        return count;
    })
    var meters = await Meter.countDocuments().exec().then((count) => {
        return count;
    })
    var rates = await Rate.countDocuments().exec().then((count) => {
        return count;
    })
    var users = await User.countDocuments().exec().then((count) => {
        return count;
    })
    var registers = await Register.countDocuments().exec().then(count => {
        return count;
    })
    var unpayedBills = await Bill.countDocuments({pago: 'debe'}).exec().then((count)=> {
        return count;
    })
    var payedBills = await Bill.find({
        $or: [{
            "pago": 'efectivo'
        },
        {
            "pago": 'transferencia'
        },
        {
            "pago": 'tarjeta'
        }]
    }).count().then((count)=> {
        return count;
    })
    var sectors = await Sector.countDocuments().exec().then((count) => {
        return count;
    })
    var avaiableSectors = await Sector.find({activa: true}).count().then((count)=>{
        return count;
    })
    var unavaiableSectors = await Sector.find({activa: false}).count().then((count)=>{
        return count;
    })
    return {
        facturas: bills,
        facturasPagadas: payedBills,
        facturaSinPagar: unpayedBills,
        medidores: meters,
        tarifas: rates,
        usuarios: users,
        lecturas: registers,
        sectores: sectors,
        sectoresActivos: avaiableSectors,
        sectoresInactivos: unavaiableSectors
    }
}
async function getCountsOnwedByUser(id) {
    var bills = await Bill.countDocuments({
        usuario: id
    }).exec().then((count) => {
        return count;
    })
    var meters = await Meter.countDocuments({
        user: id
    }).exec().then((count) => {
        return count;
    })
    var costos = await Bill.find({
        usuario: id
    }, { _id: 1, total: 1 }, (err, response) => {
        return response;
    })
    return {
        facturas: bills,
        medidores: meters,
        costos
    }
}

function getBillsNumbers(req, res) {
    Bill.find({},{numero: 1, _id: 0}, (err, response) => {
        if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion de Numeros de Facturas', Error: err});
        if (!response) return res.status(404).send({Message: 'No se pudieron cargar los numeros de las facturas'});
        if (response.length <=0) return res.status(200).send({Message: 'Aun no hay facturas ingresadas'});
        return res.status(200).send({Message: 'Datos de las facturas Obtenidos Correctamente... ', numeros: response});
    })
}

function getCedulas(req, res) {
    User.find({}, {cedula: 1, cuenta: 1, correo: 1, _id:0}, (err, response) => {
        if (err) return res.status(500).send({Message: 'Error al Ejecutar la peticion de cedulas', Error: err});
        if (!response) return res.status(404).send({Message: 'Error al devolver las cedulas'});
        if (response.length<=0) return res.status(404).send({Message: 'No se registra ninguna cedula'});
        return res.status(200).send({Message: 'Cedulas Cargadas correctamente', cedulas: response})
    })
}
function getStatisticsSectores (req, res) {
    Sector.countDocuments().exec().then((count) => {
        return res.status(200).send({Message: 'carga de sectores correcta', sectores: count});
    })    
}
function getMetersSectors (req, res) {
    var sector = req.params.id;
    Meter.countDocuments({sector}).exec().then((count)=> {
        return res.status(200).send({Message: 'Medidores por Sector correcto', meters: count});
    })
}
function getMeterNumbers (req, res) {
    Meter.find({}, {clave: 1, _id:0}, (err, response) => {
        if (err) return res.status(500).send({Message: 'Error al ejecutar la peticion en el servidor', Error: err});
        if (!response) return res.status(404).send({Message: 'Error al devolver las claves de medidor'});
        if (response.length <=0) return res.status(200).send({Message: 'No hay registros de claves en el sistema!'});
        return res.status(200).send({Message: 'Exito al devolver las claves de medidores existentes!', Claves: response});
    })
}
function getAll(req, res) {
    console.log(req.user.sub);
    getOneByOne().then((globals)=> {
        return res.status(200).send({Message: 'Todos los Datos', globals})
    })
}
async function getOneByOne () {
    var medidores = await Meter.find({}, {rate: 1, user: 1, sector: 1, _id: 1},(err, response)=>{
        return response;
    })
    var tarifas = await Rate.find({},{tarifa:1, _id:1},(err, response) => {
        return response;
    })
    var registros = await Register.find({}, {consumo: 1, bill: 1, meter: 1, _id: 1}, (err, response) => {
        return response;
    })
    var facturas = await Bill.find({}, {pago: 1, tarifa: 1, medidor: 1, usuario: 1, registro: 1, _id: 1}, (err, response) => {
        return response;
    })
    var extras = await Extra.find((err, response) => {
        return response;
    })
    var detalles = await Detalle.find((err, response) => {
        return response;
    })
    var sectores = await Sector.find((err, response) => {
        return response;
    })
    var usuarios = await User.find((err, response) => {
        return response;
    })
    return {
        medidores,
        tarifas,
        registros,
        facturas,
        extras,
        detalles,
        sectores,
        usuarios
    }
}
module.exports = {
    getStaticsByUser,
    getBillsNumbers,
    getCedulas,
    getStatisticsSectores,
    getMetersSectors,
    getGlobals,
    getMeterNumbers,
    getAll
}