'use strict'

//MODULOS
var fs = require('fs');						//NOS PERMITE TRABAJAR CON NUESTROS FICHEROS DEL PROYECTO
var path = require('path');

//MODELOS
var User = require('../models/user.model'); //MODELO DE USUARIOS
var Animal = require('../models/animal.model'); //MODELO DE USUARIOS

//ACCIONES
function pruebas(req,res){
	res.status(200).send({
		message:'Probando el controlador de animales',
		user: req.user
	});
}//pruebas

function saveAnimal(req,res){
	var animal = new Animal();

	var params = req.body; //GUARDAMOS LOS PARAMETROS QUE SE RECIBEN DEL POST

	//SI RECIBE ALGO DEL POST ENTONCES GUARDAMOS LOS PARAMETROS PARA INTENTARLOS INSERTAR
	if(params.name){
		animal.name = params.name;
		animal.description = params.description;
		animal.year = params.year;
		animal.image = null;
		animal.userId = req.user.sub;

		animal.save((err,animalStored) => {
			if(err){
				res.status(500).send({
					message:'Error en el servidor.'
				});
			}else if(!animalStored){
				res.status(404).send({
					message:'No se ha guardado el animal.'
				});
			}else{
				res.status(200).send({
					animal:animalStored
				});
			}
		});
	}else{
		res.status(200).send({
			message:'El nombre del animal es obligatorio.'
		});
	}
}//saveAnimal

function getAnimals(req,res){
	Animal.find({}).populate({path:'user'}).exec((err,animals)=>{
		if(err){
			res.status(500).send({
				message:'Error en la petición.'
			});		
		}else if(!animals){
			res.status(404).send({
				message:'No hay animales.'
			});
		}else{
			res.status(200).send({
				animals:animals
			});
		}
	});
}//getAnimals

function getAnimal(req,res){
	var animal_id = req.params.id;

	Animal.findById(animal_id).populate({path:'user'}).exec((err,animal) =>{
		if(err){
			res.status(500).send({
				message:'Error en la petición.'
			});		
		}else if(!animal){
			res.status(404).send({
				message:'El animal no existe.'
			});
		}else{
			res.status(200).send({
				animal:animal
			});
		}
	});
}//getAnimal

function updateAnimal(req,res){
	var animalId = req.params.id;
	var update = req.body;

	Animal.findByIdAndUpdate(animalId,update,{new:true},(err,animalUpdated) => {
		if(err){
			res.status(500).send({
				message:'Error en la petición'
			});
		}else if(!animalUpdated){
			res.status(404).send({
				message:'No se ha actualizado el animal'
			});
		}else{
			res.status(200).send({
				animal:animalUpdated
			});
		}
	});
		var file_path = req.files.image.path; 	//OBTENEMOS LA RUTA
		var file_split = file_path.split('\\');	//SEPARAMOS LA RUTA
		var file_name = file_split[2];			//OBTENEMOS EL NOMBRE DEL ARCHIVO

		var ext_split = file_name.split('\.');	//SEPARAMOS NOMBRE DEL ARCHIVO Y LA EXTENSIÓN
		var file_ext = ext_split[1];			//GUARDAMOS LA EXTENSIÓN DEL ARCHIVO

		//VALIDAMOS SI ESTA DENTRO DE LAS EXTENSIONES QUE DESEAMOS
		if(file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif'){

			//SI PASA LA CONDICIÓN, ENTONCES INTENTA ACTUALIZAR
			Animal.findByIdAndUpdate(animalId,{image:file_name},{new:true},(err,animalUpdated) =>{
				if(err){
					return res.status(500).send({message:'Error al actualizar el animal'});
				}else if(!animalUpdated){
					return res.status(404).send({message:'No se ha podido actualizar el animal'});
				}else{
					return res.status(200).send({
						message:'La foto de perfil se actualizo correctamente',
						animal:animalUpdated,
						image: file_name
					});
				}
			});

		}else{
			//ESTO NOS PERMITE BORRAR UN FICHERO, INDICANDO DONDE SE ENCUENTA Y SU NOMBRE
			fs.unlink(file_path,(err)=>{
				if(err){
					res.status(200).send({message:'El archivo no se pudo eliminar.'});		
				}else{
					res.status(200).send({message:'Extensión no válida.'});
				}
			});

		}
	}//updateAnimal


function uploadImage(req,res){
	var animalId = req.params.id;
	var file_name = 'No subido...';

	//EL PARAMETRO "FILES" EXISTE GRACIAS AL MULTIPARTY
	if(req.files){
		var file_path = req.files.image.path; 	//OBTENEMOS LA RUTA
		var file_split = file_path.split('\\');	//SEPARAMOS LA RUTA
		var file_name = file_split[2];			//OBTENEMOS EL NOMBRE DEL ARCHIVO

		var ext_split = file_name.split('\.');	//SEPARAMOS NOMBRE DEL ARCHIVO Y LA EXTENSIÓN
		var file_ext = ext_split[1];			//GUARDAMOS LA EXTENSIÓN DEL ARCHIVO

		//VALIDAMOS SI ESTA DENTRO DE LAS EXTENSIONES QUE DESEAMOS
		if(file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif'){

			//SI PASA LA CONDICIÓN, ENTONCES INTENTA ACTUALIZAR
			Animal.findByIdAndUpdate(animalId,{image:file_name},{new:true},(err,animalUpdated) =>{
				if(err){
					return res.status(500).send({message:'Error al actualizar el animal'});
				}else if(!animalUpdated){
					return res.status(404).send({message:'No se ha podido actualizar el animal'});
				}else{
					return res.status(200).send({
						message:'La foto de perfil se actualizo correctamente',
						animal:animalUpdated,
						image: file_name
					});
				}
			});

		}else{
			//ESTO NOS PERMITE BORRAR UN FICHERO, INDICANDO DONDE SE ENCUENTA Y SU NOMBRE
			fs.unlink(file_path,(err)=>{
				if(err){
					res.status(200).send({message:'El archivo no se pudo eliminar.'});		
				}else{
					res.status(200).send({message:'Extensión no válida.'});
				}
			});

		}
		
	}else{
		return res.status(404).send({message:'No se han subido los ficheros'});
	}

}//uploadImage

function getImageFile(req,res){
	var imageFile = req.params.imageFile;//NOMBRE DEL ARCHIVO
	var path_file = './uploads/animals/'+imageFile;//RUTA DONDE ESTA GUARDADO EL ARCHIVO
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			return res.status(404).send({message:'La imagen no existe.'});
		}
	});
}//getImageFile

function deleteAnimal(req,res){
	var animalId = req.params.id;

	Animal.findByIdAndRemove(animalId,(err,animalRemoved)=>{
		if(err){
			return res.status(500).send({message:'Error en la peticion'});
		}else if(!animalUpdated){
			return res.status(404).send({message:'No se ha podido eliminar el animal'});
		}else{
			return res.status(200).send({
				animal:animalRemoved
			});
		}
	});
}

module.exports = {
	pruebas,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImage,
	getImageFile,
	deleteAnimal
}