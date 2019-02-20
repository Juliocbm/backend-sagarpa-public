'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProgramaApoyoSchema = Schema({
	titulo:String,
	descripcion:String,
	componentes:Array,
	status:Boolean
}); 

module.exports = mongoose.model('Programa',ProgramaApoyoSchema);