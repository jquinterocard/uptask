<?php 

$accion = isset($_POST['accion'])?$_POST['accion']:'';
$tarea = isset($_POST['tarea'])?$_POST['tarea']:'';
$id_proyecto = isset($_POST['id_proyecto'])?(int)$_POST['id_proyecto']:'';
$estado = isset($_POST['estado'])?(int)$_POST['estado']:'';
$id_tarea = isset($_POST['id'])?(int)$_POST['id']:'';

if($accion==='crear'){
	// importar la conexion
	include '../funciones/conexion.php';

	try {
		// Realizar la consulta a la base de datos
		$stmt = $conn->prepare("INSERT INTO tareas (nombre,id_proyecto) VALUES(?,?)");
		$stmt->bind_param('si',$tarea,$id_proyecto);
		$stmt->execute();
		if($stmt->affected_rows > 0){
			$respuesta = array(
				'respuesta'=>'correcto',
				'id_insertado'=>$stmt->insert_id,
				'tipo'=>$accion,
				'tarea'=>$tarea
			);
		}else{
			$respuesta = array(
				'respuesta'=>'error'
			);
		}
		$stmt->close();
		$conn->close();
	} catch (Exception $e) {
		$respuesta = array(
			'error'=>$e->getMessage()
		);
	}
	echo json_encode($respuesta);
}


//accion actualizar
if($accion==='actualizar'){

	// importar la conexion
	include '../funciones/conexion.php';

	try {
		// Realizar la consulta a la base de datos
		$stmt = $conn->prepare("UPDATE tareas SET estado=? WHERE id=?");
		$stmt->bind_param('ii',$estado,$id_tarea);
		$stmt->execute();
		if($stmt->affected_rows > 0){
			$respuesta = array(
				'respuesta'=>'correcto'
			);
		}else{
			$respuesta = array(
				'respuesta'=>'error'
			);
		}
		$stmt->close();
		$conn->close();
	} catch (Exception $e) {
		$respuesta = array(
			'error'=>$e->getMessage()
		);
	}
	echo json_encode($respuesta);
	
}

//accion eliminar tareas
if($accion==='eliminar'){
	// importar la conexion
	include '../funciones/conexion.php';
	try {
		$stmt = $conn->prepare("DELETE FROM tareas WHERE id=?");
		$stmt->bind_param('i',$id_tarea);
		$stmt->execute();
		if($stmt->affected_rows > 0){
			$respuesta = array(
				'respuesta'=>'correcto'
			);
		}else{
			$respuesta = array(
				'respuesta'=>'error'
			);
		}
		$stmt->close();
		$conn->close();
	} catch (Exception $e) {
		$respuesta = array(
			'error'=>$e->getMessage()
		);
	}
	echo json_encode($respuesta);
}