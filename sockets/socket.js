'use strict'

var io = require('socket.io');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user.model');
var Mensajes = require('../models/mensajes.model');

function desconectar(cliente){
	cliente.on('disconnect',() => {
	  	console.log('Cliente desconectado');
	  });
}//desconectar

function mensaje(cliente,io){
	cliente.on('mensaje',(payload) => {

		/*------- ESTO ES PARA MANDAR UN MENSAJE --------*/
		if(!payload.mensaje && !payload.emisor){
			return console.log('Es necesario el mensaje y el emisor');
		}

		var mensaje = new Mensajes();
		mensaje.emisor = payload.emisor;
		mensaje.chatId = payload.chatId;
		mensaje.mensaje = payload.mensaje;
		mensaje.fecha_enviado = moment().unix();
		mensaje.visto = false;

		mensaje.save((error,mensajeStored) => {
			if(error) return console.log('Error en la petición');
			if(!mensajeStored) return console.log('El mensaje no se pudo guardar');

			var mensajeEnviado = mensajeStored;

			//Encontramos el nombre del usuario
			User.findOne({_id:mensajeEnviado.emisor},(err,user) => {
				if(err){
					console.log('Error en la consulta de la base de datos.');
				}
				//Verifica que exista el usuario
				else if(user){
					//ESTO EMITE EL MENSAJE Y EL NOMBRE DEL USUARIO QUE LO MANDO, DEL LADO CLIENTE SE MUESTRA
					//COMO UN ARREGLO, POR LO CUAL NO PODEMOS REALIZARLO COMO UNA PETICIÓN POR AJAX.
					io.emit('mensaje-nuevo',{emisor:user.name, mensaje:mensajeEnviado.mensaje});			
				}//else if
					
			});
		});
	});
}//mensaje

module.exports = {
	desconectar,
	mensaje
}