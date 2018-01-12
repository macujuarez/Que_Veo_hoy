var conexion = require("../lib/conexionbd.js");
    
function obtenerPelicula(req, res) {
    var filtro = '';
    
    if (req.query.titulo) {
        filtro += "AND titulo LIKE '%" + req.query.titulo + "%'"; 
    }
    
    if (req.query.anio) {
        filtro += " AND anio LIKE " + req.query.anio; 
    }
    
    if(req.query.genero) {
        filtro += " AND genero_id = " + req.query.genero;
    }

    if (req.query.columna_orden) {
        filtro += " ORDER BY " + req.query.columna_orden + " ";
    }

    if (req.query.tipo_orden){
        filtro += req.query.tipo_orden;
    }

    if (req.query.cantidad) {
        var cantidad = req.query.cantidad;
    } else {
        var cantidad = 52;
    }

    if (req.query.pagina) {
        var comienzo = (req.query.pagina - 1) * cantidad;
    }   else {
        var comienzo = 0;
    }

    var sql = "SELECT * FROM pelicula WHERE 1 = 1 " + filtro + " LIMIT " + comienzo + "," + cantidad + ";";
    
    conexion.query(sql, function(error, resultado) {
        if(error) {
            console.log('ERROR', error.message);
            return res.status(500).send(error);
        } 

        var sql2 = "SELECT COUNT(*) AS total FROM pelicula WHERE 1=1 " + filtro;
        conexion.query(sql2, function(error, total, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
    
            var response = {
                'total': total[0].total
            };
    
            response.peliculas = resultado;

            res.send(JSON.stringify(response));
        });
    });
}


function obtenerGenero(req, res) {
    var sql = "SELECT nombre,id FROM genero"
    conexion.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'generos': resultado
        };

        res.send(JSON.stringify(response));
    
    });
}

function buscarPelicula(req, res) {
    var id = req.params.id;

    var peliculas = "SELECT poster, titulo, anio, trama, fecha_lanzamiento, director, duracion, puntuacion, genero.nombre FROM pelicula JOIN genero ON genero_id = genero.id WHERE pelicula.id = " + id;

    conexion.query(peliculas, function(error, resultado) {
        if(error) {
            console.log('ERROR', error.message);
            return res.status(404).send(error);
        }

        if (resultado.length == 0) {
            console.log("ERROR");
            return res.status(404).send(error);
        }

        var actores = "SELECT actor.nombre FROM actor_pelicula JOIN pelicula ON pelicula_id = pelicula.id JOIN actor ON actor_id = actor.id WHERE pelicula.id = " + id;

        conexion.query(actores, function(error, actor, fields) {
            if (error) {
                console.log("ERROR", error.message);
                return res.status(404).send(error);
            }

            if (actor.length == 0) {
                console.log("ERROR", error.message);
                return res.status(404).send(error);
            }

            var generos = "SELECT genero.nombre FROM pelicula JOIN genero ON genero_id = genero.id WHERE pelicula.id = " + id;

            conexion.query(generos, function(error, genero, fields) {
                if (error) {
                    console.log("ERROR", error.message);
                    return res.status(404).send(error);
                }

                if (genero.length == 0) {
                    console.log("ERROR", error.message);
                    return res.status(404).send(error);
                }
                
                    var response = {
                        'pelicula': resultado[0],
                        'actores' : actor,
                        'genero' : genero
                    };
        
            res.send(JSON.stringify(response));
            console.log(response);
            
            });
        });
    });

}

function recomendarPelicula(req, res){
        var genero = req.query.genero;
        var anio_inicio = req.query.anio_inicio;
        var anio_fin = req.query.anio_fin;
        var puntuacion = req.query.puntuacion;
        var sql = "SELECT pelicula.id, titulo, poster, trama, genero.nombre FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE ";
        var filtro = "";
    
        if (anio_inicio != undefined || anio_fin != undefined) {
          filtro += "pelicula.anio BETWEEN " + anio_inicio + " AND " + anio_fin + " AND ";
        }
    
        if (genero != undefined){
          filtro += "genero.nombre = '" + genero + "' AND ";
        }
    
        if (puntuacion!= undefined) {
          filtro += "puntuacion >= " + puntuacion + " AND ";
        }

        filtro = filtro.slice(0,-5);
		sql += filtro;
                  
        console.log("Consulta realizada:" + sql);
        conexion.query(sql, function(error, resultado){
          if (error) {
              console.log("Hubo un error en la consulta", error.message);
              return res.status(500).send("Hubo un error en la consulta");
          }
    
          var response = {
            'peliculas': resultado
          }
          res.send(JSON.stringify(response));
        });
      }



module.exports = {
    obtenerPelicula: obtenerPelicula,
    obtenerGenero: obtenerGenero,
    buscarPelicula : buscarPelicula,
    recomendarPelicula: recomendarPelicula
};