'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComponenteApoyoSchema = Schema({
	id_programa:String,
	titulo:String,
	descripcion:String,
	apoyos:Array,
	status:Boolean
}); 

module.exports = mongoose.model('Componente',ComponenteApoyoSchema);