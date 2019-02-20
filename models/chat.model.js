'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = Schema({
	usuario1:{type:Schema.ObjectId, ref:'Usuario'},
	usuario2:{type:Schema.ObjectId, ref:'Usuario'}
});

module.exports = mongoose.model('Chat',ChatSchema);