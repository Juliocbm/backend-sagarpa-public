'use strict'

//Cargamos las dependencias
var express = require('express');
var bodyParser = require('body-parser');

//Cargamos el framework de express
var app = express();

//Cargamos las rutas
var user_routes = require('./routes/user.route');
var animal_routes = require('./routes/animal.route');
var noticia_routes = require('./routes/noticia.route');
var apoyo_routes = require('./routes/apoyo.route');
var producto_routes = require('./routes/producto.route');
var mensajes_routes = require('./routes/mensajes.route');
var foronoticia_routes = require('./routes/foro-noticia.route');
var programa_routes = require('./routes/programa.route');
var componente_routes = require('./routes/componente.route');

//Middlewares de body-parser
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({limit: '50mb'}));
//app.use(bodyParser.json({limit: '50mb'}));

var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
  var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' })

  app.use(jsonParser);
  app.use(urlencodedParser);


//Configurar cabeceras y cors
//ESTO PERMITE LA COMUNICACION CON AJAX
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Ruta base
//Si no quiero un prefijo simplemente cargo '/'
app.use('/api',user_routes);
app.use('/api',animal_routes);
app.use('/api',noticia_routes);
app.use('/api',apoyo_routes);
app.use('/api',producto_routes);
app.use('/api',mensajes_routes);
app.use('/api',foronoticia_routes);
app.use('/api',programa_routes);
app.use('/api',componente_routes);

module.exports = app;
