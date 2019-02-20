'use strict'

var express = require('express');
var ProductoController = require('../controllers/producto.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

//Middleware para subir archivos
var multipart = require('connect-multiparty');//NOS PERMITE MANEJAR LOS FICHEROS
var md_upload = multipart({uploadDir:'./uploads/productos'}); //MIDDLEWARE DONDE SE GUARDARAN LOS ARCHIVOS

//EXPRESS.ROUTER."ACCIÓN"("/RUTA","MIDDLEWARE CUANDO SE QUIERA","ACCIÓN DEL CONTROLADOR A REALIZAR")
//GET
api.get('/pruebas-productos',ProductoController.pruebas);//RUTA DE PRUEBA
api.get('/productos',ProductoController.getProductos);//OBTENER TODOS LOS PRODUCTOS

api.get('/productos-usuario/:id',ProductoController.getProductosUsuario);//OBTENER TODOS LOS PRODUCTOS DE UN PRODUCTOR
api.get('/producto/:id',ProductoController.getProducto);//OBTENER UN PRODUCTO ESPECIFICO

api.get('/get-image-producto/:imageFile',ProductoController.getImageFile);//OBTENER LA IMAGEN DEL PRODUCTO

//POST
api.post('/producto',[md_auth.ensureAuth],ProductoController.crearProducto);//DAR DE ALTA UN PRODUCTO

api.post('/upload-image-producto/:id',[md_auth.ensureAuth,md_upload],
									ProductoController.uploadImage);	//SUBIR IMAGEN

//DELETE
api.delete('/del-prod/:id',md_auth.ensureAuth ,ProductoController.deleteProducto);//OBTENER TODOS LOS PRODUCTO


	/* 								
api.post('/upload-image-producto/:id',[md_auth.ensureAuth,md_upload,md_admin.isAdmin],
									ProductoController.uploadImage);	//SUBIR IMAGEN DEL PRODUCTO
//PUT
api.put('/producto/:id',[md_auth.ensureAuth,md_admin.isAdmin] ,ProductoController.updateProducto);//RUTA DE PRUEBA
//DELETE
api.delete('/producto/:id',[md_auth.ensureAuth,md_admin.isAdmin] ,ProductoController.deleteProducto);//OBTENER TODOS LOS PRODUCTO
*/
api.put('/upd-prod/:id',md_auth.ensureAuth,ProductoController.updateProducto); //ACTUALIZACIÓN DEproducto
module.exports = api;