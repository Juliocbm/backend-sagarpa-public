'use strict'

var express = require('express');
var NoticiaController = require('../controllers/noticia.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Middleware para subir archivos
var multipart = require('connect-multiparty');//NOS PERMITE MANEJAR LOS FICHEROS
//var md_upload = multipart({uploadDir:'./uploads/animals'}); //MIDDLEWARE DONDE SE GUARDARAN LOS ARCHIVOS

//EXPRESS.ROUTER."ACCIÓN"("/RUTA","MIDDLEWARE CUANDO SE QUIERA","ACCIÓN DEL CONTROLADOR A REALIZAR")
//GET
api.get('/pruebas-noticia',NoticiaController.pruebas);//RUTA DE PRUEBA
api.get('/seccion-noticias',NoticiaController.getNoticias);//OBTENER TODAS LAS NOTICIAS
api.get('/noticias-rel',NoticiaController.getNoticiasRel);//Obtener noticias con relevancia 3
api.get('/admin-noticias/:page?',[md_auth.ensureAuth,md_admin.isAdmin],
						NoticiaController.getNoticiasAdmin);//OBTENER TODAS LAS NOTICIAS DE FORMA PAGINADA PARA EL ADMINISTRADOR
api.get('/noticias/:page?',NoticiaController.getNoticiasUsers);//OBTENER TODAS LAS NOTICIAS DE FORMA PAGINADA PARA EL USUARIO

api.get('/noticia/:id',NoticiaController.getNoticia);//OBTENER UNA NOTICIA ESPECIFICO

api.get('/get-image-noticia/:imageFile',NoticiaController.getImageFile);//OBTENER LA IMAGEN DEL PRODUCTO

//POST
api.post('/add-noticia',md_auth.ensureAuth,NoticiaController.crearNoticia);//GUARDAR UNA NUEVA NOTICIA
//DELETE
api.delete('/noticia/:id',[md_auth.ensureAuth,md_admin.isAdmin] ,NoticiaController.deleteNoticia);//ELIMINAR NOTICIAS

api.put('/upd-noticia/:id',md_auth.ensureAuth,NoticiaController.updateNoticia); //ACTUALIZACIÓN DE Noticia

module.exports = api;