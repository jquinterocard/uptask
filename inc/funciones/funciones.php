<?php 

//Obtiene la pagina actual que se ejecuta
function obtenerPaginaActual(){
	$archivo = basename($_SERVER['PHP_SELF']);
	$pagina = str_replace(".php","", $archivo);
	return $pagina;
}

// Consultas

// Obtener todos los proyectos
function obtenerProyectos(){
	include 'conexion.php';
	try {
		return $conn->query("select id,nombre from proyectos");	
	} catch (Exception $e) {
		echo "error : ".$e->getMessage();
		return false;
	}
}

//Obtener el nombre del proyecto
function obtenerNombreProyecto($id=null){
	include 'conexion.php';
	try {
		return $conn->query("select nombre from proyectos where id= {$id}");
	} catch (Exception $e) {
		echo "error : ".$e->getMessage();
		return false;
	}
}

//Obtener tareas asociadas al proyecto
function obtenerTareasProyecto($id=null){
	include 'conexion.php';
	try {
		return $conn->query("select id,nombre,estado from tareas where id_proyecto= {$id}");
	} catch (Exception $e) {
		echo "error : ".$e->getMessage();
		return false;
	}
}
