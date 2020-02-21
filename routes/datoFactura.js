'use strict'
var express = require('express');
var datoFacturaController = require('../controllers/datofactura');
var api = express.Router();

var md_auth = require('../middleware/authenticate');

api.post('/save', md_auth.ensureAuth, datoFacturaController.save);
api.get('/gets',md_auth.ensureAuth, datoFacturaController.show);

module.exports = api;
