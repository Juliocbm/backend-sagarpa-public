'use strict'

var express = require('express');
var ProgramaController = require('../controllers/programa.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Middleware para subir archivos
var multipart = require('connect-multiparty');//NOS PERMITE MANEJAR LOS FICHEROS
//var md_upload = multipart({uploadDir:'./uploads/animals'}); //MIDDLEWARE DONDE SE GUARDARAN LOS ARCHIVOS

//EXPRESS.ROUTER."ACCIÓN"("/RUTA","MIDDLEWARE CUANDO SE QUIERA","ACCIÓN DEL CONTROLADOR A REALIZAR")f
//GET
api.get('/pruebas-programa',ProgramaController.pruebas);//RUTA DE PRUEBA
api.get('/programas',ProgramaController.getProgramas);//OBTENER TODAS LOS APOYOS
//POST
api.post('/add-programa',ProgramaController.crearPrograma);//GUARDAR UN NUEVO APOYO

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