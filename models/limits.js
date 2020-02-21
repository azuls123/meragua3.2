'use strict' // Habilita el uso de cualquiera de librerias de forma forzada y el uso de los nuevos standares de JavaScript 6 //
//=================Declaracion de variables //
// Variable de Mongoose //
var mongoose = require('mongoose');
// la variable schema es una parte del modulo mongoose que permite cargar los esquemas a realizar //
var Schema = mongoose.Schema;
// Variable de entidad que da forma a todos los objetos con este esquema //
var LimitsSchema = Schema({
    limit_from: Number,
    limit_to: Number,
    cost: Number,
    percent_cost: Boolean,
    updated_at: String,
    updated_by: {type: Schema.ObjectId, ref: 'user'},
    created_at: String,
    created_by: {type: Schema.ObjectId, ref: 'user'},
    rate_id: {
        // Definicion del tipo de variable como Object Id para establecer un enlace con la tabla Principal //
        type: Schema.ObjectId, ref: 'Rate'
    }
});
// Exportacion del modelo para habilitarlo en toda la aplicacion //
module.exports = mongoose.model('Limit', LimitsSchema);