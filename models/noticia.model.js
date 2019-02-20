'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticiaSchema = Schema({
	titulo:String,
	descripcion:String,
	//fecha_reg:{type:Date,default:new Date()},
	fecha_reg:String,
	status:Boolean,
	imagen:Array,
	recurso:String,
	relevancia:Number,
	likes:Number,
	userId:{type:Schema.ObjectId, ref:'Usuario'}
}); 

module.exports = mongoose.model('Noticia',NoticiaSchema);