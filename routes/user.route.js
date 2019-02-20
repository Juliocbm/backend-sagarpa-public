'use strict'

var express = require('express');
var UserController = require('../controllers/user.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//Middleware para subir archivos
var multipart = require('connect-multiparty');//NOS PERMITE MANEJAR LOS FICHEROS
var md_upload = multipart({uploadDir:'./uploads/users'}); //MIDDLEWARE DONDE SE GUARDARAN LOS ARCHIVOS

//Indicamos la ruta y la acción a cargar
//GET
api.get('/pruebas-del-controlador',md_auth.ensureAuth ,UserController.pruebas);//RUTA DE PRUEBA
api.get('/get-image-file/:id',UserController.getImageFile);//OBTENER LA IMAGEN DEL USUARIO
api.get('/admins',UserController.getAdmins);//LISTADO DE LOS ADMINISTRADORES

api.get('/usuarios',UserController.getUsuarios);
//POST
api.post('/register',UserController.saveUser);						//REGISTRAR USUARIO
api.post('/login',UserController.login);							//lOGUEARSE
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);	//SUBIR IMAGEN DE USUARIO
//PUT
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser); //ACTUALIZACIÓN DE USUARIO
api.put('/update-password/:id',md_auth.ensureAuth,UserController.cambiarPassword); //ACTUALIZACIÓN DE LA CONTRASEÑA DEL USUARIO

module.exports = api;