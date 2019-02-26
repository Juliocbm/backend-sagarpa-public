'use strict'

var io = require('socket.io');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user.model');
var Mensajes = require('../models/mensajes.model');

function desconectar(cliente){
	cliente.on('disconnect',() => {
		cliente.leave(cliente.room);
	  	console.log('Cliente desconectado');
	  });
}//desconectar

function addSalaPrivada(cliente) {
	// when the client emits 'adduser', this listens and executes
	cliente.on('addusuarioSala', (payload) =>{
		// store the username in the socket session for this client
		cliente.username = payload.usuario;
		// store the room name in the socket session for this client
		cliente.room = payload.sala;
		// add the client's username to the global list
		//usernames[username] = payload.usuario;
		// send client to room 1
		cliente.join(payload.sala);
		console.log(cliente.rooms);
		//this.rooms.push(payload.sala);
		// echo to client they've connected
		//cliente.emit('updatechat', 'SERVER', '');
		// echo to room 1 that a person has connected to their room
		//cliente.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		//cliente.emit('updaterooms', rooms, payload.sala);
	});
}//addSalaPrivada

function leaveSalaPrivada(cliente) {
	cliente.on('leaveSalaPrivada', (payload) =>{
		cliente.leave(cliente.room);
		console.log(cliente.rooms);
	});
}//leaveSalaPrivada

function mensaje(cliente,io){
	cliente.on('mensaje',(payload) => {
		
		//------- ESTO ES PARA MANDAR UN MENSAJE --------//
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
					io.to(payload.chatId).emit('mensaje-nuevo',{emisor:user.name, mensaje:mensajeEnviado.mensaje});			
				}//else if
					
			});
		});

		/*
		//------- ESTO ES PARA MANDAR UN MENSAJE --------//
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
		*/
	});
}//mensaje

/*

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['5c6b3108591a9b3e005755f4','5c6b37ba8e27b12fd029a4b3'];
		
		io.sockets.on('connection', function (socket) {
	function addSalaPrivada(cliente) {
		// when the client emits 'adduser', this listens and executes
		cliente.on('addusuarioSala', (payload) =>{
			// store the username in the socket session for this client
			cliente.username = payload.usuario;
			// store the room name in the socket session for this client
			cliente.room = payload.sala;
			// add the client's username to the global list
			//usernames[username] = payload.usuario;
			// send client to room 1
			cliente.join(payload.sala);
			//this.rooms.push(payload.sala);
			// echo to client they've connected
			//cliente.emit('updatechat', 'SERVER', '');
			// echo to room 1 that a person has connected to their room
			//cliente.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
			//cliente.emit('updaterooms', rooms, payload.sala);
		});

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (data) {
			// we tell the client to execute 'updatechat' with 2 parameters
			io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		});

		socket.on('switchRoom', function(newroom){
			// leave the current room (stored in session)
			socket.leave(socket.room);
			// join new room, received as function parameter
			socket.join(newroom);
			socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
			// sent message to OLD room
			socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
			// update socket session room title
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
			socket.emit('updaterooms', rooms, newroom);
		});

		// when the user disconnects.. perform this
		socket.on('disconnect', function(){
			// remove the username from global usernames list
			delete usernames[socket.username];
			// update list of users in chat, client-side
			io.sockets.emit('updateusers', usernames);
			// echo globally that this client has left
			socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
			socket.leave(socket.room);
		});


		*/

module.exports = {
	desconectar,
	mensaje,
	addSalaPrivada
}