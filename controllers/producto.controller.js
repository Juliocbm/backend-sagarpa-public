'use strict'

//MODULOS
var fs = require('fs'); //NOS PERMITE TRABAJAR CON NUESTROS FICHEROS DEL PROYECTO
var path = require('path');

//MODELOS
var User = require('../models/user.model'); //MODELO DE USUARIOS
var Producto = require('../models/producto.model'); //MODELO DE PRODUCTOS

//ACCIONES
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de productos'
    });
} //pruebas


function a(params, callback) {

    let size2 = params.image.length;

    params.image.forEach(

        function (imagen, index) {

            var size = imagen.length;
            var imagen = imagen.substring(23, size);

            var nombrearchivo = Math.random().toString() + ".jpg";

            fs.writeFile("public/uploadsProd/" + nombrearchivo, imagen, 'base64', (error) => {

                array[index] = nombrearchivo;

                if (index == size2 - 1) {
                    console.log(array);
                    callback();


                }

            });

        }
    );






}

var array = [];

function crearProducto(req, res) {
    var producto = new Producto();

    var params = req.body; //GUARDAMOS LOS PARAMETROS QUE SE RECIBEN DEL POST

    //SI RECIBE ALGO DEL POST ENTONCES GUARDAMOS LOS PARAMETROS PARA INTENTARLOS INSERTAR
    if (params.nombreProducto) {
        producto.nombreProducto = params.nombreProducto;
        producto.descripcion = params.descripcion;
        producto.cantidad = params.cantidad;
        producto.unidadMedida = params.unidadMedida;
        producto.caracteristicas = params.caracteristicas;
        producto.status = params.status;
        producto.tipo = params.tipo;
        producto.precio = params.precio;
        producto.moneda = params.moneda;
        //		producto.image = params.image;
        producto.userId = req.user.sub;



        a(params, function () {


            array.forEach(function (img) {
                producto.image.push(img);

            });

            //producto.image=array.slice();
            

            console.log("entro a callback");






            producto.save((err, productoStored) => {
                if (err) {
                    array = [];
                    res.status(500).send({
                        message: 'Error en el servidor.'
                    });
                } else if (!productoStored) {
                    array = [];
                    res.status(404).send({
                        message: 'No se ha guardado el producto.'
                    });
                } else {
                    //console.log("producto insertado");
                    array = [];
                    res.status(200).send({
                        producto: productoStored
                        
                    });
                }
            });


        });









    } else {
        res.status(200).send({
            message: 'El nombre del producto es obligatorio.'
        });
    }
} //crearProducto


function getProductos(req, res) {
	console.log("si entra al backend");
    Producto.find({}).populate({
        path: 'userId'
    }).exec((err, productos) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición.'
            });
        } else if (productos.length == 0) {
            res.status(404).send({
                message: 'No hay productos.'
            });
        } else {
            res.status(200).send({
                productos: productos
            });
        }
    });
} //getProductos

function getProducto(req, res) {
    var producto_id = req.params.id;

    Producto.findById(producto_id).populate({
        path: 'userId'
    }).exec((err, producto) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición.' + producto_id
            });
        } else if (!producto) {


            res.status(404).send({
                message: 'El producto no existe.' + producto_id
            });
        } else {

            res.status(200).send({

                producto: producto

            });
        }
    });
} //getProducto

function updateProducto(req, res) {
    var productoId = req.params.id;
    var update = req.body;

    Producto.findByIdAndUpdate(productoId, update, {
        new: true
    }, (err, productoUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else if (!productoUpdated) {
            res.status(404).send({
                message: 'No se ha actualizado el Producto'
            });
        } else {
            res.status(200).send({
                producto: productoUpdated
            });
        }
    });
    /*	var file_path = req.files.image.path; 	//OBTENEMOS LA RUTA
    	var file_split = file_path.split('\\');	//SEPARAMOS LA RUTA
    	var file_name = file_split[2];			//OBTENEMOS EL NOMBRE DEL ARCHIVO

    	var ext_split = file_name.split('\.');	//SEPARAMOS NOMBRE DEL ARCHIVO Y LA EXTENSIÓN
    	var file_ext = ext_split[1];			//GUARDAMOS LA EXTENSIÓN DEL ARCHIVO

    	//VALIDAMOS SI ESTA DENTRO DE LAS EXTENSIONES QUE DESEAMOS
    	if(file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif'){

    		//SI PASA LA CONDICIÓN, ENTONCES INTENTA ACTUALIZAR
    		Producto.findByIdAndUpdate(ProductoId,{image:file_name},{new:true},(err,productoUpdated) =>{
    			if(err){
    				return res.status(500).send({message:'Error al actualizar el Producto'});
    			}else if(!productoUpdated){
    				return res.status(404).send({message:'No se ha podido actualizar el Producto'});
    			}else{
    				return res.status(200).send({
    					message:'La foto de perfil se actualizo correctamente',
    					producto:productoUpdated,
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
    	}*/
} //updateProductos


function uploadImage(req, res) {
    var productoId = req.params.id;
    var file_name = 'No subido...';

    //EL PARAMETRO "FILES" EXISTE GRACIAS AL MULTIPARTY
    if (req.files) {
        var file_path = req.files.image.path; //OBTENEMOS LA RUTA
        var file_split = file_path.split('\\'); //SEPARAMOS LA RUTA
        var file_name = file_split[2]; //OBTENEMOS EL NOMBRE DEL ARCHIVO

        var ext_split = file_name.split('\.'); //SEPARAMOS NOMBRE DEL ARCHIVO Y LA EXTENSIÓN
        var file_ext = ext_split[1]; //GUARDAMOS LA EXTENSIÓN DEL ARCHIVO

        //VALIDAMOS SI ESTA DENTRO DE LAS EXTENSIONES QUE DESEAMOS
        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif') {

            //SI PASA LA CONDICIÓN, ENTONCES INTENTA ACTUALIZAR
            Producto.findByIdAndUpdate(productoId, {
                image: file_name
            }, {
                new: true
            }, (err, productoUpdated) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error al actualizar el animal'
                    });
                } else if (!productoUpdated) {
                    return res.status(404).send({
                        message: 'No se ha podido actualizar el animal'
                    });
                } else {
                    return res.status(200).send({
                        message: 'La foto del producto se actualizo correctamente',
                        producto: productoUpdated,
                        image: file_name
                    });
                }
            });

        } else {
            //ESTO NOS PERMITE BORRAR UN FICHERO, INDICANDO DONDE SE ENCUENTA Y SU NOMBRE
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({
                        message: 'El archivo no se pudo eliminar.'
                    });
                } else {
                    res.status(200).send({
                        message: 'Extensión no válida.'
                    });
                }
            });

        }

    } else {
        return res.status(404).send({
            message: 'No se han subido los ficheros'
        });
    }

} //uploadImage

function getImageFile(req, res) {
    var imageFile = req.params.imageFile; //NOMBRE DEL ARCHIVO
    var path_file = './public/uploadsProd/' + imageFile; //RUTA DONDE ESTA GUARDADO EL ARCHIVO
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                message: 'La imagen no existe.'
            });
        }
    });
} //getImageFile

function deleteProducto(req, res) {
    var productoId = req.params.id;


    Producto.remove({
        _id: req.params.id
    }, (err, productoRemoved) => {
        if (err) {
            return res.status(500).send({
                message: 'Error en la peticion'
            });
        } else if (!productoRemoved) {
            return res.status(404).send({
                message: 'No se ha podido eliminar el Producto'
            });
        } else {
            return res.status(200).send({
                producto: productoRemoved
            });
        }
    });

}



function getProductosUsuario(req, res) {

    var usuarioId = req.params.id;
    Producto.find({
        userId: usuarioId
    }).populate({
        path: 'userId'
    }).exec((err, productos) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición.'
            });
        } else if (productos.length == 0) {
            res.status(404).send({
                message: 'No hay productos.'
            });
        } else {
            res.status(200).send({
                productos: productos

            });
        }
    });
} //getProductos

module.exports = {
    pruebas,
    crearProducto,
    getProductos,
    getProducto,
    updateProducto,
    uploadImage,
    getImageFile,
    deleteProducto,
    getProductosUsuario
}
