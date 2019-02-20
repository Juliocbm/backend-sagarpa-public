'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentarioSchema = Schema({
	comentario:String,
	preguntaId:String,
	fecha_reg:String,
	activa:Boolean,
	userId:{type:Schema.ObjectId, ref:'Usuario'}
}); 

module.exports = mongoose.model('Comentario',ComentarioSchema);