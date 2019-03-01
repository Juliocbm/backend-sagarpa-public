'use strict'

//MODULOS
var bcrypt = require('bcrypt-nodejs');		//PARA ENCRIPTAR CONTRASEÑAS Y DESENCRIPTARLAS
var fs = require('fs');						//NOS PERMITE TRABAJAR CON NUESTROS FICHEROS DEL PROYECTO
var path = require('path');

//MODELOS
var User = require('../models/user.model'); //MODELO DE USUARIOS

//SERVICIO JWT
var jwt = require('../services/jwt');		//PARA GENERAR TOKENS, DANDO SEGURIDAD EN EL LOGIN

//ACCIONES
function pruebas(req,res){
	res.status(200).send({
		message:'Probando el controlador de usuarios y la acción pruebas',
		user: req.user
	});
}//pruebas

function cambiarPassword(req,res){
	var userId = req.params.id;
	var user_password = req.body.password;

	//Si el id no coincide con el usuario logueado, no te deja actualizar
	if(userId != req.user.sub){
		return res.status(500).send({message:'No tienes permisos para actualizar el usuario'});
	}
	//Cifrar contraseña
	bcrypt.hash(req.body.password,null,null,function(err,hash){
		user_password = hash;

		//En caso de pasar la condición, se busca y se actualiza el usuario
		User.findByIdAndUpdate({_id:userId},{$set:{password:user_password}},{new:true},(err,userUpdated) =>{
			if(err){
				return res.status(500).send({message:'Error al actualizar la contraseña'});
			}else if(!userUpdated){
				return res.status(404).send({message:'No se ha podido actualizar la contraseña'});
			}else{
				return res.status(200).send({
					message:'La contraseña se actualizo correctamente'
					//,user:userUpdated
				});
			}

		});
	});
	
}//cambiarPassword

function saveUser(req,res){
	//HACEMOS UNA INSTANCIA DEL MODELO
	var user = new User();

	//RECOGEMOS LOS PARAMETROS DE LA PETICIÓN
	var params = req.body;

	if(params.password && params.name && params.surname && params.email){
		//ASIGNAMOS VALORES AL OBJETO
		user.name = params.name;
		user.surname = params.surname;
		user.role = params.role;
		user.email = params.email;
		user.status = params.status;
		user.municipio = params.municipio;
		user.localidad = params.localidad;
		user.sector = params.sector;
		user.image = params.image;

		User.findOne({email:user.email}, (err,userFind) => {
			if(err){
				res.status(500).send({message: 'Error al comprobar usuario'});
			}else if(!userFind){

				//Cifrar contraseña
				bcrypt.hash(params.password,null,null,function(err,hash){
					user.password = hash;

					//Guardamos el registro
					user.save((err,userStored) => {
						if(err){
							res.status(500).send({
								message:'Error al guardar el usuario.'
							});
						}else if(!userStored){
							res.status(404).send({
								message:'No se ha registrado el usaurio.'
							});
						}else{
							res.status(200).send({
								user: userStored
							});
						}
					});
				});

			}else{
				res.status(200).send({
					message:'El usuario ya existe.'
				});
			}
		});
	}else{
		res.status(200).send({
			message:'Introduce todos los datos para el usuario.'
		});
	}
}//saveUser

function login(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email:email},(err,user) => {
		if(err){
			res.status(500).send({message:'Error al intentar buscar el email'});
		}
		//Verifica que exista el usuario
		else if(user){
			//Compara la contraseña
			bcrypt.compare(password,user.password, (err,check) =>{
				if(check){
					//Comprobar y generar el token
					if(params.gettoken){
						//Devolver el token
						res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
						user.password = undefined;
						res.status(200).send({user});
					}
					
				}else{
					res.status(404).send({
						message:'El usuario no ha podido loguearse correctamente.'
					});		
				}
			});
			
		}else{
			res.status(404).send({
				message:'El usuario no ha podido loguearse.'
			});
		}
	});
}//login

function updateUser(req,res){

	var userId = req.params.id;
	var update = req.body;
	delete update.password;

	//Si el id no coincide con el usuario logueado, no te deja actualizar
//	if(userId != req.user.sub){
//		return res.status(500).send({message:'No tienes permisos para actualizar el usuario'});
//	}
	//En caso de pasar la condición, se busca y se actualiza el usuario
	User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated) =>{
		if(err){
			return res.status(500).send({message:'Error al actualizar usuario'});
		}else if(!userUpdated){
			return res.status(404).send({message:'No se ha podido actualizar el usuario'});
		}else{
			return res.status(200).send({
				message:'El usuario se actualizo correctamente',
				user:userUpdated
			});
		}
	});

}//updateUser

function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	//EL PARAMETRO "FILES" EXISTE GRACIAS AL MULTIPARTY
	if(req.files){
		var file_path = req.files.image.path; 	//OBTENEMOS LA RUTA
		var file_split = file_path.split('\\');	//SEPARAMOS LA RUTA
		var file_name = file_split[2];			//OBTENEMOS EL NOMBRE DEL ARCHIVO

		var ext_split = file_name.split('\.');	//SEPARAMOS NOMBRE DEL ARCHIVO Y LA EXTENSIÓN
		var file_ext = ext_split[1];			//GUARDAMOS LA EXTENSIÓN DEL ARCHIVO

		//VALIDAMOS SI ESTA DENTRO DE LAS EXTENSIONES QUE DESEAMOS
		if(file_ext == 'jpg' || file_ext == 'PNG' || file_ext == 'jpeg' || file_ext == 'gif'){

			//SI EL ID NO COINCIDE CON EL USUARIO LOGUEADO ENTONCES NO DEJA ACTUALIZAR
//			if(userId != req.user.sub){
//				return res.status(500).send({message:'No tienes permisos para actualizar el usuario'});
//			}
			//SI PASA LA CONDICIÓN, ENTONCES INTENTA ACTUALIZAR
			User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated) =>{
				if(err){
					return res.status(500).send({message:'Error al actualizar usuario'});
				}else if(!userUpdated){
					return res.status(404).send({message:'No se ha podido actualizar el usuario'});
				}else{
					return res.status(200).send({
						message:'La foto de perfil se actualizo correctamente',
						user:userUpdated,
						image: file_name
					});
				}
			});

		}else{
			//ESTO NOS PERMITE BORRAR UN FICHERO, INDICANDO DONDE SE ENCUENTA Y SU NOMBRE
			fs.unlink(file_path,(err)=>{
				if(err){
					return res.status(200).send({message:'El archivo no se pudo eliminar.'});		
				}else{
					return res.status(200).send({message:'Extensión no válida.'});
				}
			});

		}
		
	}else{
		return res.status(404).send({message:'No se han subido los ficheros'});
	}

}//uploadImage

function getImageFile(req,res){

	User.findOne({_id:req.params.id}, (err,userFind) => {
		//Si no encuentra la foto manda la foto por default
		if(userFind == null){
			return res.sendFile(path.resolve('./uploads/users/null.jpg'));
		}
		
		var imageFile = userFind.image;//req.params.imageFile;//NOMBRE DEL ARCHIVO
		var path_file = './uploads/users/'+imageFile;//RUTA DONDE ESTA GUARDADO EL ARCHIVO
		fs.exists(path_file,function(exists){
			if(exists){
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(404).send({message:'La imagen no existe.'});
			}
		});
	});
}//getImageFile

function getAdmins(req,res){
	User.find({role:'ROLE_ADMIN'}).exec((err,users)=>{
		if(err){
			return res.status(500).send({message:'Error en la petición'});		
		}else if(!users){
			return res.status(404).send({message:'No hay administradores'});
		}else{
			return res.status(200).send({
				Administradores: users
			});
		}
	});
	
}//getKeepers






function getUsuarios(req,res){
	User.find({}).exec((err,users)=>{
		if(err){
			return res.status(500).send({
				message:'Error en la petición.'
			});		
		}else if(users.length <= 0){
			return res.status(404).send({
				message:'No hay usuarios.'
			});
		}else{
			return res.status(200).send({
				usuarios:users
			});
		}
	});
}//getProductos




module.exports = {
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	getAdmins,
	cambiarPassword,
	getUsuarios
}//exports