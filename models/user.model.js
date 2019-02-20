'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	/*
	NameUser:String,
	Password:String,
	Role:String,
	Data{
		Name:String,
		Lastname:String,
		Age:Number,
		Address:String,
		PhoneNumber:String,
		Birthday:Date,
		Email:String
	},
	Register:{type:Date,default:new Date()}
	Status:Boolean
	*/
	name:String,
	municipio:String,
	localidad:String,
	sector:String,
	surname:String,
	email:String,
	password:String,
	role:String,
	status:Boolean,
	image:String
}); 

//module.exports = mongoose.model('User',UserSchema);
module.exports = mongoose.model('Usuario',UserSchema);