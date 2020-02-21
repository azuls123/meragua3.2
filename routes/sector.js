'use strict'

var express = require('express');
var SectorController = require('../controllers/sector');
var api = express.Router()
var md_auth = require('../middleware/authenticate');

api.get('/show/:id', md_auth.ensureAuth, SectorController.get);
api.get('/shows', md_auth.ensureAuth, SectorController.gets);
api.post('/save', md_auth.ensureAuth, SectorController.save);
api.put('/update/:id', md_auth.ensureAuth, SectorController.updates);
module.exports = api;