'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var io_functions = require('./sockets/socket');
var mensajes = [{
	id:1,
	texto:'Bienvenido al chat de prueba',
	nickname:'Bot de socket.io'
}];

mongoose.Promise = global.Promise;
//Conexión a la base de datos

//mongoose.connect('mongodb://localhost:27017/SagarpaDB',{useNewUrlParser:true})
mongoose.connect('mongodb://juliocbm500:YeVfhj555ybymmPc@cluster0-shard-00-00-e8zdp.mongodb.net:27017,cluster0-shard-00-01-e8zdp.mongodb.net:27017,cluster0-shard-00-02-e8zdp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{useNewUrlParser:true})
	.then(() =>{	
		//Si se conecta exitosamente mostramos un mensaje de exito.
		console.log('La conexión a la base de datos SagarpaDB se ha realizado correctamente...');
		
		io.on('connection', cliente => {
		  console.log('El cliente: ' + cliente.handshake.address + ' se ha conectado.');

		  cliente.emit('mensajes',mensajes);

		  //FUNCION QUE DESCONECTA AL CLIENTE
		  io_functions.desconectar(cliente);

		  //FUNCION QUE MANDA MENSAJES
		  io_functions.mensaje(cliente,io);

		  //FUNCION QUE MANDA MENSAJES
		  io_functions.addSalaPrivada(cliente);

		});


		http.listen(port, () => {
			console.log("El servidor local con Node y Express esta corriendo correctamente en el puerto -> "+port);
		});
	})
	//cachamos el error cuando exista...
	.catch(err => console.log(err));

