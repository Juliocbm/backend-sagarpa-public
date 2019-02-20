'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
	nombreProducto:String,
	descripcion:String,
	cantidad:Number,
	unidadMedida:String,
	Registro:{type:Date,default:new Date()},
	status:Boolean,
	image:Array,
	caracteristicas:Array,
	tipo:String,
	precio:Number,
	moneda:String,
	userId:{type:Schema.ObjectId, ref:'Usuario'}
	
}); 

module.exports = mongoose.model('Producto',ProductoSchema);