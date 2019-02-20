'use strict'

//MODELOS
var Programa = require('../models/programa.model'); //MODELO DE PROGRAMA

//ACCIONES
function pruebas(req,res){
	res.status(200).send({
		message:'Probando el controlador de programas y la acción pruebas'
	});
}//pruebas

function getProgramas(req,res){

	//REALIZAMOS UNA CONSULTA A LA COLECCIÓN DE PROGRAMAS
	Programa.find().exec((err,programasFind) =>{
		if(err){
			res.status(500).send({
				message:'No se pudo realizar la consulta a la BD'
			});	
		}else if(!programasFind){
			res.status(404).send({
				message:'Error en la consulta'
			});
		}else{
			res.status(200).send({
				programas:programasFind
			});
		}
			
	});
	
}//getProgramas

function crearPrograma(req,res){
	//HACEMOS UNA INSTANCIA DEL MODELO
	var programa = new Programa();

	//RECOGEMOS LOS PARAMETROS DE LA PETICIÓN
	var params = req.body;

	if(params.titulo && params.descripcion){
		//ASIGNAMOS VALORES AL OBJETO
		programa.titulo = params.titulo;
		programa.descripcion = params.descripcion;

		Programa.findOne({programa:programa.titulo}, (err,programaFind) => {
			if(err){
				res.status(500).send({message: 'Error al comprobar los programas'});
			}else if(!programaFind){
				//Guardamos el registro
				programa.save((err,programaStored) => {
					if(err){
						res.status(500).send({
							message:'Error al guardar el programa.'
						});
					}else if(!programaStored){
						res.status(404).send({
							message:'No se ha registrado el programa.'
						});
					}else{
						res.status(200).send({
							programa: programaStored
						});
					}
				});
				
			}else{
				res.status(200).send({
					message:'El programa ya existe.'
				});
			}
		});
	}else{
		res.status(200).send({
			message:'Introduce todos los datos para el programa.'
		});
	}
}//crearPROGRAMA

module.exports = {
	pruebas,
	getProgramas,
	crearPrograma
} 