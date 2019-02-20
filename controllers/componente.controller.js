'use strict'

//MODELOS
var Componente = require('../models/componente.model'); //MODELO DE APOYO

//ACCIONES
function pruebas(req,res){
	res.status(200).send({
		message:'Probando el controlador de componente y la acción pruebas'
	});
}//pruebas

function getComponentes(req,res){

	//REALIZAMOS UNA CONSULTA A LA COLECCIÓN DE APOYOS
	Componente.find().exec((err,componentesFind) =>{
		if(err){
			res.status(500).send({
				message:'No se pudo realizar la consulta a la BD'
			});	
		}else if(!componentesFind){
			res.status(404).send({
				message:'Error en la consulta'
			});
		}else{
			res.status(200).send({
				componentes:componentesFind
			});
		}
			
	});
	
}//getApoyos




function getComponentesPrograma(req,res){
	
	var id_prog = req.params.id;

	//REALIZAMOS UNA CONSULTA A LA COLECCIÓN DE APOYOS
	Componente.find({id_programa:id_prog}).exec((err,componentesFind) =>{
		if(err){
			res.status(500).send({
				message:'No se pudo realizar la consulta a la BD'
			});	
		}else if(!componentesFind){
			res.status(404).send({
				message:'Error en la consulta'
			});
		}else{
			res.status(200).send({
				componentes:componentesFind
			});
		}
			
	});
	
}//getApoyos




function crearComponente(req,res){
	//HACEMOS UNA INSTANCIA DEL MODELO
	var componente = new Componente();

	//RECOGEMOS LOS PARAMETROS DE LA PETICIÓN
	var params = req.body;

	if(params.titulo && params.descripcion){
		//ASIGNAMOS VALORES AL OBJETO
		componente.id_programa = params.id_programa;
		componente.descripcion = params.descripcion;
		componente.titulo = params.titulo;

		Componente.findOne({titulo:componente.titulo}, (err,componenteFind) => {
			if(err){
				res.status(500).send({message: 'Error al comprobar los componentes'});
			}else if(!componenteFind){
				//Guardamos el registro
				componente.save((err,componenteStored) => {
					if(err){
						res.status(500).send({
							message:'Error al guardar el componente.'
						});
					}else if(!componenteStored){
						res.status(404).send({
							message:'No se ha registrado el componente.'
						});
					}else{
						res.status(200).send({
							componente: componenteStored
						});
					}
				});
				
			}else{
				res.status(200).send({
					message:'El componente ya existe.'
				});
			}
		});
	}else{
		res.status(200).send({
			message:'Introduce todos los datos para el componente.'
		});
	}
}//crearComponente

module.exports = {
	pruebas,
	getComponentes,
	crearComponente
} 