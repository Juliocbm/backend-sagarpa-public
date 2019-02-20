'use strict'

exports.isAdmin = function(req,res,next){
	//SI ENTRA EN ESTA CONDICIÓN ENTONCES SALIMOS DEL MÉTODO PARA NEGARLE EL ACCESO A LAS DEMAS ACCIONES
	if(req.user.role != 'ROLE_ADMIN'){
		return res.status(200).send({message:'No tienes acceso a esta zona.'});
	}

	next(); //EN CASO DE NO CUMPLIRSE, SIGNFICA QUE ES UN AMDINISTRADOR Y SE LE BRINDA ACCESO
};