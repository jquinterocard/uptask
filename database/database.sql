CREATE DATABASE uptask;

-- utf-8 general_ci

use uptask;


-- ALTER DATABASE uptask CHARACTER SET utf8 COLLATE utf8_general_ci;
-- ALTER TABLE proyectos CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
-- ALTER TABLE tareas CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
-- ALTER TABLE usuarios CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE usuarios(
	id int(11) not null auto_increment,
	usuario varchar(50) not null,
	password varchar(60) not null,
	constraint pk_usuarios primary key(id)
);

CREATE TABLE proyectos(
	id int(11)  not null auto_increment,
	nombre varchar(100) not null,
	constraint pk_proyectos primary key(id)
);

CREATE TABLE tareas(
	id int(11) not null auto_increment,
	nombre varchar(100) not null,
	estado int(1) not null,
	id_proyecto  int(11) not null,
	constraint pk_tareas primary key(id),
	constraint fk_tareas_proyecto foreign key(id_proyecto) references proyectos(id) on delete restrict on update restrict
);

ALTER TABLE `tareas` CHANGE `estado` `estado` INT(1) NOT NULL DEFAULT '0'; 
