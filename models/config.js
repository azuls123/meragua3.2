'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ConfigSchema = Schema({
    logo:       String,
    updated_at: String,
    created_at: String,
    updated_by: {type: Schema.ObjectId, ref: 'user'},
    created_by: {type: Schema.ObjectId, ref: 'user'}
})