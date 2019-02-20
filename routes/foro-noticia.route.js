'use strict'

var express = require('express');
var ForoNoticiaController = require('../controllers/foro-noticia.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//EXPRESS.ROUTER."ACCIÓN"("/RUTA","MIDDLEWARE CUANDO SE QUIERA","ACCIÓN DEL CONTROLADOR A REALIZAR")
//GET
api.get('/pruebas-foro-noticia',ForoNoticiaController.pruebas);//RUTA DE PRUEBA
api.get('/preguntas-noticia/:id',ForoNoticiaController.getPreguntas);//OBTENER TODAS LAS PREGUNTAS DE UNA NOTICIA ESPECIFICA
api.get('/pregunta/:id',ForoNoticiaController.getPreguntaEspecifica);//OBTENER INFO DE UNA PREGUNTA ESPECIFICA
api.get('/comentarios-pregunta/:id',ForoNoticiaController.getComentarios);//OBTENER TODOS LOS COMENTARIOS SOBRE UNA PREGUNTA ESPECIFICA

//POST
api.post('/crear-pregunta-noticia',md_auth.ensureAuth,ForoNoticiaController.crearPregunta);//CREAR UNA NUEVA PREGUNTA
api.post('/crear-comentario-noticia',md_auth.ensureAuth,ForoNoticiaController.crearComentario);//CREAR UN COMENTARIO PARA UNA PREGUNTA

//PUT
api.put('/cerrarPregunta/',[md_auth.ensureAuth,md_admin.isAdmin] ,ForoNoticiaController.cerrarPregunta);//CERRAR PREGUNTA

/*
//DELETE
api.delete('/del-prod/:id',md_auth.ensureAuth ,ProductoController.deleteProducto);//OBTENER TODOS LOS PRODUCTO
 								

//DELETE
api.delete('/producto/:id',[md_auth.ensureAuth,md_admin.isAdmin] ,ProductoController.deleteProducto);//OBTENER TODOS LOS PRODUCTO

*/
module.exports = api;