<?php 

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion==='crear'){
	// Codigo para crear los administradores

	// Hashear passwords
	$opciones = array(
		'cost'=>10,
	);

	$hash_password = password_hash($password,PASSWORD_BCRYPT,$opciones);

	// importar la conexion
	include '../funciones/conexion.php';

	try {
		// Realizar la consulta a la base de datos
		$stmt = $conn->prepare("INSERT INTO usuarios (usuario,password) VALUES(?,?)");
		$stmt->bind_param('ss',$usuario,$hash_password);
		$stmt->execute();
		if($stmt->affected_rows > 0){
			$respuesta = array(
				'respuesta'=>'correcto',
				'id_insertado'=>$stmt->insert_id,
				'tipo'=>$accion
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
			'respuesta'=>$e->getMessage()
		);
	}
	echo json_encode($respuesta);
}


if($accion==='login'){

	include '../funciones/conexion.php';
	try {
		$stmt = $conn->prepare("select id,usuario,password from usuarios where usuario=?");
		$stmt->bind_param('s',$usuario);
		$stmt->execute();
		//Loguear el usuario
		$stmt->bind_result($id_usuario,$nombre_usuario,$password_usuario);
		$stmt->fetch();
		if($nombre_usuario){
			// El usuario existe verificar el password
			if(password_verify($password,$password_usuario)){
				//Iniciar la sesion
				session_start();
				$_SESSION['nombre'] = $usuario;
				$_SESSION['id'] = $id_usuario;
				$_SESSION['login'] = true;
				//Login correcto
				$respuesta = array(
					'respuesta'=>'correcto',
					'nombre'=>$nombre_usuario,
					'tipo'=>$accion
				);

			}else{
				//Login Incorrecto enviar error
				$respuesta = array(
					'resultado'=>'password incorrecto'
				);

			}

		}else{
			$respuesta = array(
				'error'=>'usuario no existe'
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