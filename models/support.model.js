'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupportSchema = Schema({
	Title:String,
	Description:String,
	DateBegin:{type:Date,default:new Date()},
	DateFinish:Date,
	Status:Boolean,
	Photo:String,
	Resource:String,
	Requirements:Array<String>
	
}); 

module.exports = mongoose.model('Support',SupportSchema);