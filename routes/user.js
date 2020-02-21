'use strict' // Habilita el uso de cualquier libreria de forma forzada y el uso de los nuevos standares de JavaScript 6 //
//=================Declaracion de variables //
// libreria para la conexion y manipulacion de datos en nodejs //
var express = require('express');
// controlador que se usara en esta ruta //
var UserController = require('../controllers/user');
// declaracion del uso de rutas //
var api = express.Router();
// variable de autenticacion de tokens //
var md_auth = require('../middleware/authenticate');
// variable de subida de archivos
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/users' });
//=================Rutas //
//========Gets //
api.get('/show/:id?', md_auth.ensureAuth, UserController.show);
api.get('/users/:page?', md_auth.ensureAuth, UserController.showUsers);
api.get('/get-image/:imageFile', UserController.getImageFile);
api.get('/show-raw', md_auth.ensureAuth, UserController.showRaw);
api.get('/show-for-consulting', UserController.showRaw);
//========Post //
api.post('/login', UserController.login);
api.post('/save',md_auth.ensureAuth, UserController.save);
api.post('/image/:id', [md_auth.ensureAuth, md_upload], UserController.UploadImageUser);
api.post('/save-user', md_auth.ensureAuth, UserController.saveUser);
api.post('/password-confirm', md_auth.ensureAuth, UserController.passwordConfirm);
//========Put //
api.put('/update/:id', md_auth.ensureAuth, UserController.update);
api.put('/update-commons/:id', md_auth.ensureAuth, UserController.updateCommons);
api.put('/change-password/:id', md_auth.ensureAuth, UserController.changePassword);
api.put('/change-activa/:id', md_auth.ensureAuth, UserController.changeActiva);
//========Delete //
api.delete('/delete/:id', md_auth.ensureAuth, UserController.remove);

module.exports = api;
