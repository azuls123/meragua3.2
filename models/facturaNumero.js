'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FacturaNumSchema = Schema({
    num_min:            Number,
    num_max:            Number,
    caduca:           String,
    estado:             Boolean,
    codigoTalonario:    String,
    updated_at:         String,
    created_at:         String,
    updated_by:         {type: Schema.ObjectId, ref: 'user'},
    created_by:         {type: Schema.ObjectId, ref: 'user'}
})
module.exports = mongoose.model('FacturaNumeros', FacturaNumSchema);
