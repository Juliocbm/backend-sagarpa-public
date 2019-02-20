'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ForoSchema = Schema({
	pregunta:String,
	topicoId:String,
	fecha_reg:String,
	activa:Boolean,
	userId:{type:Schema.ObjectId, ref:'Usuario'}
}); 

module.exports = mongoose.model('Foro',ForoSchema);