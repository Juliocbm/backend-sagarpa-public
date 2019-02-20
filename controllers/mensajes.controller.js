'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user.model');
var Mensajes = require('../models/mensajes.model');
var Chat = require('../models/chat.model');

function probando(req,res){
	res.status(200).send({message:'hola que tal'});
}//probando

function buscarChats(req,res){
	
	//SI VIENEN LOS DOS USUARIOS BUSCAMOS SI EXISTE UN CHAT
	if(req.user.sub && req.params.id){

		//BUSCAMOS SI EXISTE EL CHAT ENTRE LOS DOS USUARIOS
		Chat.findOne({$or:[
			{usuario1:req.user.sub,usuario2:req.params.id},
			{usuario1:req.params.id,usuario2:req.user.sub}
		   ]
		}).exec((error,chat) => {
			if(error) return res.status(500).send({message:'Error en la petición'});
			
			return res.status(200).send({chat:chat});
		});

			
	//SI NO VIENEN LOS DOS USUARIOS ENTONCES RETORNAMOS UN ERROR DEL REQUERIMIENTO	
	}else{
		return res.status(500).send({message:'Tiene que haber tanto un emisor como un receptor'});
	}//else
	
}//chats

function crearChat(req,res){

	var params = req.body;

	var chatNuevo = new Chat(); 
	chatNuevo.usuario1 = req.user.sub;
	chatNuevo.usuario2 = params.receptor;
	
	chatNuevo.save((error,chatStored) => {
		if(error) return res.status(500).send({message:'Error en la petición'});
		if(!chatStored) return res.status(404).send({message:'Error al crear el chat entre los dos usuarios'});

		return res.status(200).send({chat:chatStored});
	});
	
}//crearChat

function listarChats(req,res){

	//BUSCAMOS SI EXISTE EL CHAT ENTRE LOS DOS USUARIOS
	Chat.find({$or:[
		{usuario1:req.user.sub},
		{usuario2:req.user.sub}
	   ]
	}).populate('usuario1 usuario2').exec((error,chats) => {
		if(error) return res.status(500).send({message:'Error en la petición'});
		
		return res.status(200).send({chats:chats});
	});
	
}//listarChats

function recibirMensajes(req,res){
	
	Mensajes.find({chatId:req.params.id}).populate('emisor').exec((error,mensajes) => {
			if(error) return res.status(500).send({message:'Error en la petición'});
			if(!mensajes) return res.status(404).send({message:'No hay mensajes'});

			return res.status(200).send({
				mensajes:mensajes
			});
		});
}//recibirMensajes

function verListaMensajes(req,res){
	var userId = req.user.sub;
	var pagina = 1;
	console.log(userId);
	if(req.params.page){
		pagina = req.params.page;
	}

	var itemsXpagina = 4;

	Mensajes.find({emisor:userId}).populate('emisor receptor', '_id name surname image').paginate(pagina,itemsXpagina,(error,mensajes,total) => {
		if(error) return res.status(500).send({message:'Error en la petición'});
		if(!mensajes) return res.status(404).send({message:'No hay mensajes'});
		console.log(mensajes);
		return res.status(200).send({
			total:total,
			paginas: Math.ceil(total/itemsXpagina),
			mensajes:mensajes
		}); 
	});

}//verMensajesMandados

function getMensajesNoVistos(req,res){
	var userId = req.user.sub;

	Mensajes.count({receptor:userId, visto:false}).exec((error,mensajes) => {
		if(error) return res.status(500).send({message:'Error en la petición'});
		return res.status(200).send({sinVer:mensajes});
	});
}//getMensajesNoVistos

function ponerVistoMensajes(req,res){
	var userId = req.user.sub;

	Mensajes.update({receptor:userId, visto:false},{visto:true},{"multi":true},(error,mensajesUpdate) =>{
		if(error) return res.status(500).send({message:'Error en la petición'});
		return res.status(200).send({
			mensajes:mensajesUpdate
		});		
	});

}//ponerVistoMensajes

module.exports = {
	probando,
	recibirMensajes,
	crearChat,
	buscarChats,
	listarChats,
	verListaMensajes,
	getMensajesNoVistos,
	ponerVistoMensajes
}