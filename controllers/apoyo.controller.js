'use strict'

//MODELOS
var Apoyo = require('../models/apoyo.model'); //MODELO DE APOYO

//ACCIONES
function pruebas(req,res){
	res.status(200).send({
		message:'Probando el controlador de apoyo y la acción pruebas'
	});
}//pruebas


//FUNCIÓN PARA OBTENER UN APOYO EN CONCRETO
function getApoyo(req,res){
	var apoyo_id = req.params.id;

	Apoyo.findById(apoyo_id).populate({path:'userId'}).exec((err,apoyo) =>{
		if(err){
			res.status(500).send({
				message:'Error en la petición.'
			});		
		}else if(!apoyo){
			res.status(404).send({
				message:'La apoyo no existe.'
			});
		}else{
			res.status(200).send({
				apoyo:apoyo
			});
		}
	});
}//getNoticia


function getApoyos(req,res){

	//REALIZAMOS UNA CONSULTA A LA COLECCIÓN DE APOYOS
	Apoyo.find().exec((err,apoyosFind) =>{
		if(err){
			res.status(500).send({
				message:'No se pudo realizar la consulta a la BD'
			});	
		}else if(!apoyosFind){
			res.status(404).send({
				message:'Error en la consulta'
			});
		}else{
			res.status(200).send({
				apoyos:apoyosFind
			});
		}
			
	});
	
}//getApoyos

function crearApoyo(req,res){
	//HACEMOS UNA INSTANCIA DEL MODELO
	var apoyo = new Apoyo();

	//RECOGEMOS LOS PARAMETROS DE LA PETICIÓN
	var params = req.body;

	if(params.titulo && params.descripcion){
		//ASIGNAMOS VALORES AL OBJETO
		apoyo.id_programa = params.id_programa;
		apoyo.id_componente = params.id_componente;
		apoyo.titulo = params.titulo;
		apoyo.descripcion = params.descripcion;
		apoyo.fecha_reg =params.fecha_reg;
		apoyo.status=true;

		Apoyo.findOne({_id:apoyo._id}, (err,apoyoFind) => {
			if(err){
				res.status(500).send({message: 'Error al comprobar los apoyos'});
			}else if(!apoyoFind){
				//Guardamos el registro
				apoyo.save((err,apoyoStored) => {
					if(err){
						res.status(500).send({
							message:'Error al guardar el apoyo.'
						});
					}else if(!apoyoStored){
						res.status(404).send({
							message:'No se ha registrado el apoyo.'
						});
					}else{
						res.status(200).send({
							apoyo: apoyoStored
						});
					}
				});
				
			}else{
				res.status(200).send({
					message:'El apoyo ya existe.'
				});
			}
		});
	}else{
		res.status(200).send({
			message:'Introduce todos los datos para el apoyo.'
		});
	}
}//crearApoyo

module.exports = {
	pruebas,
	getApoyos,
	getApoyo,
	crearApoyo
} 