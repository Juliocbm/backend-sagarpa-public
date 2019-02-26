'use strict'

//MODELOS
var Noticia = require('../models/noticia.model'); //MODELO DE NOTICIA
var Usuario = require('../models/user.model');

var mongoosePaginate = require('mongoose-pagination');

var path = require('path');
var fs = require('fs');
var moment = require('moment');

//ACCIONES
function pruebas(req, res) {
	res.status(200).send({
		message: 'Probando el controlador de noticia y la acción pruebas'
	});
} //pruebas

//FUNCIÓN PARA OBTENER TODAS LAS NOTICIAS (PIENSO QUE AQUÍ SE DEBERÍA DE LIMITAR LA CANTIDAD DE NOTICIAS QUE SE MUESTREN)
function getNoticias(req, res) {



	//REALIZAMOS UNA CONSULTA A LA COLECCIÓN DE NOTICIAS
	Noticia.find({
		status: true
	}).exec((err, noticiasFind) => {
		if (err) {
			res.status(500).send({
				message: 'No se pudo realizar la consulta a la BD'
			});
		} else if (!noticiasFind) {
			res.status(404).send({
				message: 'Error en la consulta'
			});
		} else {
			res.status(200).send({
				noticias: noticiasFind,
				message: "Se obtuvieron las noticias habilitadas"
			});
		}
	});



} //getNoticias



function getNoticiasRel(req, res) {

	//REALIZAMOS UNA CONSULTA A LA COLECCIÓN DE NOTICIAS
	Noticia.find({
		relevancia: 3
	}).limit(6).exec((err, noticiasFind) => {
		if (err) {
			res.status(500).send({
				message: 'No se pudo realizar la consulta a la BD'
			});
		} else if (!noticiasFind) {
			res.status(404).send({
				message: 'Error en la consulta'
			});
		} else {
			res.status(200).send({
				noticias: noticiasFind
			});
		}
	});

} //getNoticias

//FUNCIÓN PARA OBTENER TODAS LAS NOTICIAS PAGINADAS PARA EL ADMINISTRADOR
function getNoticiasAdmin(req, res) {

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsXpagina = 5;

	Noticia.find().sort('_id').paginate(page, itemsXpagina, (err, noticias, total) => {
		if (err) return res.status(500).send({
			message: 'Error en la petición'
		});
		if (!noticias) return res.status(404).send({
			message: 'No hay noticias'
		});

		return res.status(200).send({
			noticias: noticias,
			total: total,
			pages: Math.ceil(total / itemsXpagina)
		});
	});

} //getNoticiasAdmin

//FUNCIÓN PARA OBTENER TODAS LAS NOTICIAS PAGINADAS PARA EL USUARIO (FALTA FILTRARLO SOLO POR EL MES ACTUAL)
function getNoticiasUsers(req, res) {

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsXpagina = 5;

	Noticia.find({
		status: true
	}).sort('_id').paginate(page, itemsXpagina, (err, noticias, total) => {
		if (err) return res.status(500).send({
			message: 'Error en la petición'
		});
		if (!noticias) return res.status(404).send({
			message: 'No hay noticias'
		});

		return res.status(200).send({
			noticias: noticias,
			total: total,
			pages: Math.ceil(total / itemsXpagina),
			itemsPorPagina: itemsXpagina
		});
	});

} //getNoticiasAdmin

//FUNCIÓN PARA OBTENER UNA NOTICIA EN CONCRETO
function getNoticia(req, res) {
	var noticia_id = req.params.id;

	Noticia.findById(noticia_id).populate({
		path: 'userId'
	}).exec((err, noticia) => {
		if (err) {
			res.status(500).send({
				message: 'Error en la petición.'
			});
		} else if (!noticia) {
			res.status(404).send({
				message: 'La noticia no existe.'
			});
		} else {
			res.status(200).send({
				noticia: noticia
			});
		}
	});
} //getNoticia


function getImageFile(req, res) {
    var imageFile = req.params.imageFile; //NOMBRE DEL ARCHIVO
    var path_file = './public/uploadsNot/' + imageFile; //RUTA DONDE ESTA GUARDADO EL ARCHIVO
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                message: 'La imagen no existe.'
            });
        }
    });
} //getImageFile








//FUNCIÓN PARA DAR DE ALTA NUEVAS NOTICIAS
function crearNoticia(req, res) {
	//HACEMOS UNA INSTANCIA DEL MODELO
	var noticia = new Noticia();

	//RECOGEMOS LOS PARAMETROS DE LA PETICIÓN
	var params = req.body;

	if (params.titulo && params.descripcion) {
		//ASIGNAMOS VALORES AL OBJETO
		noticia.titulo = params.titulo;
		noticia.descripcion = params.descripcion;
		noticia.userId = req.user.sub;
		noticia.relevancia = params.relevancia;
		noticia.fecha_reg = params.fecha_reg;
		noticia.status = true;
		noticia.imagen = params.imagen;








			noticia.save((err, noticiaStored) => {
				if (err) {
					
					res.status(500).send({
						message: 'Error al guardar la noticia.'
					});
				} else if (!noticiaStored) {
					
					res.status(404).send({
						message: 'No se ha registrado la noticia.'
					});
				} else {
					
					res.status(200).send({
						noticia: noticiaStored
					});
				}
			});






		








	} else {
		res.status(200).send({
			message: 'Introduce todos los datos para la noticia.'
		});
	}
} //crearNoticia

//FUNCIÓN PARA BORRAR NOTICIAS
function deleteNoticia(req, res) {
	var noticiaId = req.params.id;

	Noticia.findByIdAndRemove(noticiaId, (err, noticiaRemoved) => {
		if (err) {
			return res.status(500).send({
				message: 'Error en la peticion'
			});
		} else if (!noticiaRemoved) {
			return res.status(404).send({
				message: 'No se ha podido eliminar la noticia'
			});
		} else {
			return res.status(200).send({
				noticia: noticiaRemoved
			});
		}
	});
} //deleteNoticia


//update noticia
function updateNoticia(req, res) {
	var noticiaId = req.params.id;
	var update = req.body;

	Noticia.findByIdAndUpdate(noticiaId, update, {
		new: true
	}, (err, noticiaUpdated) => {
		if (err) {
			res.status(500).send({
				message: 'Error en la petición'
			});
		} else if (!noticiaUpdated) {
			res.status(404).send({
				message: 'No se ha actualizado la noticia'
			});
		} else {
			res.status(200).send({
				noticia: noticiaUpdated,
				message: "actualizacion satisfactoria"
			});
		}
	});

} //updateNoticia



module.exports = {
	pruebas,
	getNoticias,
	crearNoticia,
	getNoticia,
	deleteNoticia,
	getNoticiasAdmin,
	getNoticiasUsers,
	getNoticiasRel,
	updateNoticia,
	getImageFile
}
