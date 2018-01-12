//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('./controladores/controlador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.get('/peliculas', controlador.obtenerPelicula);
app.get('/generos', controlador.obtenerGenero);
app.get('/peliculas/recomendacion', controlador.recomendarPelicula);
app.get('/peliculas/:id', controlador.buscarPelicula);


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

