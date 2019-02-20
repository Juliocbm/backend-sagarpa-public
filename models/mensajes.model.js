'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MensajesSchema = Schema({
	chatId:String,
	mensaje:String,
	fecha_enviado:String,
	visto:Boolean,
	emisor:{type:Schema.ObjectId, ref:'Usuario'}
});

module.exports = mongoose.model('Mensajes',MensajesSchema);