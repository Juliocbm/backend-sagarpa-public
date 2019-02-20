'use strict'

var express = require('express');
var MensajesController = require('../controllers/mensajes.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Middleware para subir archivos
var multipart = require('connect-multiparty');//NOS PERMITE MANEJAR LOS FICHEROS
var md_upload = multipart({uploadDir:'./uploads/mensajeria'}); //MIDDLEWARE DONDE SE GUARDARAN LOS ARCHIVOS

//EXPRESS.ROUTER."ACCIÓN"("/RUTA","MIDDLEWARE CUANDO SE QUIERA","ACCIÓN DEL CONTROLADOR A REALIZAR")f
//GET
api.get('prueba-md',MensajesController.probando);//RUTA DE PRUEBA
api.get('/ver-mensajes/:id',md_auth.ensureAuth ,MensajesController.recibirMensajes);//RUTA PARA RECIBIR MENSAJES
api.get('/ver-chats/',md_auth.ensureAuth ,MensajesController.listarChats);//RUTA PARA VER LOS MENSAJES QUE MANDA EL USUARIO
api.get('novistos-mensajes',md_auth.ensureAuth ,MensajesController.getMensajesNoVistos);//RUTA PARA VER LOS MENSAJES NO VISTOS
api.get('marcar-novistos-mensajes',md_auth.ensureAuth ,MensajesController.ponerVistoMensajes);//RUTA PARA MARCAR LOS MENSAJES COMO VISTOS
api.get('/buscar-chat/:id',md_auth.ensureAuth,MensajesController.buscarChats);//RUTA PARA VER SI EXISTE EL CHAT

//POST
api.post('/crear-chat/',md_auth.ensureAuth,MensajesController.crearChat);//RUTA PARA CREAR UN CHAT

module.exports = api;