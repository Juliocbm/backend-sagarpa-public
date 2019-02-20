'use strict'

//MODULOS
var fs = require('fs');						//NOS PERMITE TRABAJAR CON NUESTROS FICHEROS DEL PROYECTO
var path = require('path');

//MODELOS
var User = require('../models/user.model'); //MODELO DE USUARIOS
var Foro = require('../models/foro.model'); //MODELO DE FORO
var Comentario = require('../models/comentarios.model'); //MODELO DE COMENTARIOS

//ACCIONES
function pruebas(req,res){
	res.status(200).send({
		message:'Probando el controlador de Foro Noticia'
	});
}//pruebas

function crearPregunta(req,res){
	var pregunta = new Foro();

	var params = req.body; //GUARDAMOS LOS PARAMETROS QUE SE RECIBEN DEL POST
	//SI RECIBE ALGO DEL POST ENTONCES GUARDAMOS LOS PARAMETROS PARA INTENTARLOS INSERTAR
	if(params.pregunta){
		pregunta.pregunta = params.pregunta;
		pregunta.fecha_reg = params.fecha_reg;
		pregunta.activa = true;
		pregunta.topicoId = params.topicoId;
		pregunta.userId = req.user.sub;


		pregunta.save((err,preguntaStored) => {
			if(err){
				res.status(500).send({
					message:'Error en el servidor.'
				});
			}else if(!preguntaStored){
				res.status(404).send({
					message:'No se ha guardado la pregunta.'
				});
			}else{
				res.status(200).send({
					pregunta:preguntaStored
				});
			}
		});
	}else{
		res.status(200).send({
			message:'El nombre del producto es obligatorio.'
		});
	}
}//crearPregunta

function crearComentario(req,res){
	var comentario = new Comentario();
	var params = req.body; //GUARDAMOS LOS PARAMETROS QUE SE RECIBEN DEL POST

	//SI RECIBE ALGO DEL POST ENTONCES GUARDAMOS LOS PARAMETROS PARA INTENTARLOS INSERTAR
	if(params.comentario){
		comentario.comentario = params.comentario;
		comentario.fecha_reg = params.fecha_reg;
		comentario.activa = true;
		comentario.preguntaId = params.preguntaId;
		comentario.userId = req.user.sub;


		comentario.save((err,comentarioStored) => {
			if(err){
				res.status(500).send({
					message:'Error en el servidor.'
				});
			}else if(!comentarioStored){
				res.status(404).send({
					message:'No se ha guardado la pregunta.'
				});
			}else{
				res.status(200).send({
					comentario:comentarioStored
				});
			}
		});
	}else{
		res.status(200).send({
			message:'El comentario es obligatorio.'
		});
	}
}//crearComentario

function getPreguntas(req,res){

	Foro.find({topicoId:req.params.id}).populate({path:'userId',model:'Usuario'}).exec((err,preguntas)=>{
		if(err){
			res.status(500).send({
				message:'Error en la petición.'
			});		
		}else{
			res.status(200).send({
				preguntasHechas:preguntas
			});
		}
	});
}//getPreguntas

function getPreguntaEspecifica(req,res){

	Foro.findById(req.params.id).populate({path:'userId',model:'Usuario'}).exec((err,pregunta)=>{
		if(err){
			res.status(500).send({
				message:'Error en la petición.'
			});		
		}else if(!pregunta){
			res.status(404).send({
				message:'La pregunta ha sido eliminada o no existe.'
			});
		}else{
			res.status(200).send({
				pregunta:pregunta
			});
		}
	});
}//getPreguntas

function getComentarios(req,res){

	Comentario.find({preguntaId:req.params.id}).populate({path:'userId'}).exec((err,comentarios)=>{
		if(err){
			res.status(500).send({
				message:'Error en la petición.'
			});		
		}else if(!comentarios){
			res.status(404).send({
				message:'No hay comentarios.'
			});
		}else{
			res.status(200).send({
				comentarios:comentarios
			});
		}
	});
}//getComentarios

function cerrarPregunta(req,res){
	var params = req.body;
	Foro.findByIdAndUpdate(params._id,{activa:false},{new:true},(err,preguntaUpdate) => {
		if(err){
			res.status(500).send({
				message:'Error en la petición'
			});
		}else if(!preguntaUpdate){
			res.status(404).send({
				message:'No se ha cerrado la pregunta'
			});
		}else{
			res.status(200).send({
				pregunta:preguntaUpdate
			});
		}
	});
}//cerrarPregunta

function deleteProducto(req,res){
	var productoId = req.params.id;
	

	Producto.remove({_id:req.params.id},(err,productoRemoved)=>{
		if(err){
			return res.status(500).send({message:'Error en la peticion'});
		}else if(!productoRemoved){
			return res.status(404).send({message:'No se ha podido eliminar el Producto'});
		}else{
			return res.status(200).send({
				producto:productoRemoved
			});
		}
	});
}

module.exports = {
	pruebas,
	crearPregunta,
	crearComentario,
	getPreguntas,
	getPreguntaEspecifica,
	getComentarios,
	cerrarPregunta
}