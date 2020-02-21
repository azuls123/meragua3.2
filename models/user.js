'use strict' // Habilita el uso de cualquiera de librerias de forma forzada y el uso de los nuevos standares de JavaScript 6 //
//=================Declaracion de variables //
// Variable de Mongoose //
var mongoose = require('mongoose');
// la variable schema es una parte del modulo mongoose que permite cargar los esquemas a realizar //
var Schema = mongoose.Schema;
// Variable de entidad que da forma a todos los objetos con este esquema //
var userSchema = Schema({
    cuenta: String,
    contrase: String,
    direccion: {
        type: String,
        default: 'Sin Dirección'
    },
    correo: {
        type: String,
        default: 'Sin Correo'
    },
    image: String,
    nombre: String,
    apellido: String,
    cedula: String,
    role_user: String,
    telefono: {
        type: String, 
        default: 'Sin Teléfono'
    },
    fecha_nacimiento: {
        type: String,
        default: 'Sin Fecha de Nacimiento'
    },
    sexo: {
        type: String,
        default: 'Indefinido'
    },
    activa: {
        type: Boolean,
        default: true
    },
    updated_at: String,
    updated_by: { type: Schema.ObjectId, ref: 'user' },
    created_at: String,
    created_by: { type: Schema.ObjectId, ref: 'user' }
});
// Exportacion del modelo para habilitarlo en toda la aplicacion //
module.exports = mongoose.model('user', userSchema);