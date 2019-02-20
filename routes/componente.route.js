'use strict'

var express = require('express');
var ComponenteController = require('../controllers/componente.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Middleware para subir archivos
var multipart = require('connect-multiparty');//NOS PERMITE MANEJAR LOS FICHEROS
//var md_upload = multipart({uploadDir:'./uploads/animals'}); //MIDDLEWARE DONDE SE GUARDARAN LOS ARCHIVOS

//EXPRESS.ROUTER."ACCIÓN"("/RUTA","MIDDLEWARE CUANDO SE QUIERA","ACCIÓN DEL CONTROLADOR A REALIZAR")f
//GET
api.get('/pruebas-componentes',ComponenteController.pruebas);//RUTA DE PRUEBA
api.get('/componentes',ComponenteController.getComponentes);//OBTENER TODAS LOS APOYOS

//api.get('/componentes/:id',ComponenteController.getComponentesPrograma);//OBTENER TODAS LOS componentes de un programa

//POST
api.post('/add-componente',ComponenteController.crearComponente);//GUARDAR UN NUEVO APOYO

/*
api.get('/animals',md_auth.ensureAuth ,AnimalController.getAnimals);//OBTENER TODOS LOS ANIMALES
api.get('/animal/:id',md_auth.ensureAuth ,AnimalController.getAnimal);//OBTENER UN ANIMAL ESPECIFICO
api.get('/get-image-animal/:imageFile',AnimalController.getImageFile);//OBTENER LA IMAGEN DEL ANIMAL
//POST
api.post('/animal',[md_auth.ensureAuth,md_admin.isAdmin] ,AnimalController.saveAnimal);//RUTA DE PRUEBA
api.post('/upload-image-animal/:id',[md_auth.ensureAuth,md_upload,md_admin.isAdmin],
									AnimalController.uploadImage);	//SUBIR IMAGEN DEL ANIMAL
//PUT
api.put('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin] ,AnimalController.updateAnimal);//RUTA DE PRUEBA
//DELETE
api.delete('/animal/:id',[md_auth.ensureAuth,md_admin.isAdmin] ,AnimalController.deleteAnimal);//OBTENER TODOS LOS ANIMALES
*/
module.exports = api;