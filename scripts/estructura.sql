DROP DATABASE IF EXISTS Peliculas;

CREATE DATABASE Peliculas;
USE Peliculas;
CREATE TABLE pelicula(
    id int NOT NULL auto_increment,
    titulo varchar(100) NOT NULL,
    duracion INT NOT NULL,
    director varchar(400) NOT NULL,
    anio int NOT NULL,
    fecha_lanzamiento date NOT NULL,
    puntuacion int NOT NULL,
    poster varchar(300) NOT NULL,
    trama varchar(700) NOT NULL,
    PRIMARY KEY (id)
);

source C:/Users/Macu/Desktop/acamica/que-veo-hoy-recursos/scripts/script-paso-1-peliculas.sql;

DROP TABLE IF EXISTS genero;
USE Peliculas;
CREATE TABLE genero(
    id int NOT NULL auto_increment,
    nombre varchar(30) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE pelicula add column genero_id int;
ALTER TABLE pelicula add FOREIGN KEY (genero_id) REFERENCES genero (id); 


source C:/Users/Macu/Desktop/acamica/que-veo-hoy-recursos/scripts/script-paso-2-generos.sql;

SELECT * FROM pelicula JOIN genero ON genero_id = genero.id;


DROP TABLE IF EXISTS actor;
USE Peliculas;
CREATE TABLE actor(
    id int NOT NULL auto_increment,
    nombre varchar(70) NOT NULL,
    PRIMARY KEY (id)
);
DROP TABLE IF EXISTS actor_pelicula;
USE Peliculas;
CREATE TABLE actor_pelicula(
    id int NOT NULL auto_increment,
    actor_id int NOT NULL,
    pelicula_id int NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE actor_pelicula add FOREIGN KEY (actor_id) REFERENCES actor (id);
ALTER TABLE actor_pelicula add FOREIGN KEY (pelicula_id) REFERENCES pelicula (id);

source C:/Users/Macu/Desktop/acamica/que-veo-hoy-recursos/scripts/script-paso-3-actores.sql;

  
