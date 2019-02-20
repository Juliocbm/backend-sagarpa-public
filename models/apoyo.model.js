'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApoyoSchema = Schema({
	id_programa:String,
	id_componente:String,
	titulo:String,
	descripcion:String,
	fecha_reg:String,
	status:Boolean
}); 

module.exports = mongoose.model('Apoyo',ApoyoSchema);