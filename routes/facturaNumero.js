'use strict'
var express = require('express');
var FacturaNumeroController = require('../controllers/facturaNumero');
var api = express.Router();

var md_auth = require('../middleware/authenticate');

api.post('/guardar', md_auth.ensureAuth, FacturaNumeroController.save);
api.put('/editar/:id', md_auth.ensureAuth, FacturaNumeroController.update);
api.get('/listar',FacturaNumeroController.gets);
module.exports = api;