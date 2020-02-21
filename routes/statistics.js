'use strict'

var express = require('express');
var StatisticsController = require('../controllers/statistics');
var api = express.Router();
var md_auth = require('../middleware/authenticate');

api.get('/get-statistics-user/:id', StatisticsController.getStaticsByUser);
api.get('/get-bills-numbers', StatisticsController.getBillsNumbers);
api.get('/get-cedulas', StatisticsController.getCedulas);
api.get('/get-sectores', StatisticsController.getStatisticsSectores);
api.get('/get-medidores-sector/:id', StatisticsController.getMetersSectors);
api.get('/get-statistics-global', StatisticsController.getGlobals);
api.get('/get-meters-numbers', StatisticsController.getMeterNumbers);
api.get('/get-globals', md_auth.ensureAuth, StatisticsController.getAll);
module.exports = api;