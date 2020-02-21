'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DatoFacturaSchema = Schema({
    tipoComp   : String,
    ruc        : String,
    tipoAmb    : String,
    serie      : String,
    tipEmi     : String,
    codNum     : String,
    nombres    : String,
    apellidos  : String,
    updated_by:     { type: Schema.ObjectId, ref: 'user'        },
    updated_at:     String,
    created_by:     { type: Schema.ObjectId, ref: 'user'        },
    created_at:     String
});
module.exports = mongoose.model('DatoFactura', DatoFacturaSchema);