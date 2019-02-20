'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_de_Sagarpa_app_tec';

//Generamos el token que llevara la información del usuario
exports.createToken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30,'days').unix() //expira en 30 días
	};
	return jwt.encode(payload,secret);
};