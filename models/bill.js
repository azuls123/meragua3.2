'use strict' // Habilita el uso de cualquiera de librerias de forma forzada y el uso de los nuevos standares de JavaScript 6 //
//=================Declaracion de variables //
// Variable de Mongoose //
var mongoose = require('mongoose');
// la variable schema es una parte del modulo mongoose que permite cargar los esquemas a realizar //
var Schema = mongoose.Schema;
// Variable de entidad que da forma a todos los objetos con este esquema //
var BillSchema = Schema({
    numero:         Number,
    fecha:          String,
    total:          Number,
    pago:           String,
    datoFacturado:  { type: Schema.ObjectId, ref: 'DatoFactura' },
    claveAccesso:   String,
    tarifa:         { type: Schema.ObjectId, ref: 'Rate'        },
    base:           Number,
    exceso:         Number,
    subtotal:       Number,
    importes:       Number,
    descuentos:     Number,
    
    medidor:        {
        id:         { type: Schema.ObjectId, ref: 'Meter'       },
        clave:      Number,
        sector:     String,
        direccion:  String
    },
    usuario:        { 
        nombre:             String,
        cedula:             String,
        apellido:           String,
        direccion:          String,
        telefono:           String,
        correo:             String,
     },
     cliente: {
        nombre:                 String,
        cedula:                 String,
        apellido:               String,
        direccion:              String,
        telefono:               String,
        correo:                 String
    },
    registro:       { type: Schema.ObjectId, ref: 'Register'    },
    updated_by:     { type: Schema.ObjectId, ref: 'user'        },
    updated_at:     String,
    created_by:     { type: Schema.ObjectId, ref: 'user'        },
    created_at:     String
});
// Exportacion del modelo para habilitarlo en toda la aplicacion //
module.exports = mongoose.model('Bill', BillSchema);