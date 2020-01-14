eventListeners();

function eventListeners(){
	document.querySelector('#formulario').addEventListener('submit',validarRegistro);
}

function validarRegistro(e){
	e.preventDefault();
	var usuario = document.querySelector('#usuario').value;
	var password = document.querySelector('#password').value;
	var tipo = document.querySelector('#tipo').value;

	if(usuario==='' || password===''){
		// La validacion fallo
		Swal.fire({
			type: 'error',
			title: 'Error!',
			text: 'Ambos campos son obligatorios!'
		});
	}else{
		// ambos campos son correctos mandar a ejecutar ajax

		// Datos que se envian al servidor
		var datos = new FormData();
		datos.append('usuario',usuario);
		datos.append('password',password);
		datos.append('accion',tipo);
		// console.log(datos.get('usuario'));

		// crear el llamado a ajax
		var xhr = new XMLHttpRequest();

		// Abrir la conexion
		xhr.open('POST','inc/modelos/modelo-admin.php',true);

		// retorno de datos
		xhr.onload = function(){
			if(this.status===200){
				var respuesta = JSON.parse(xhr.responseText);
				if(respuesta.respuesta==='correcto'){

					if(respuesta.tipo==='crear'){
						Swal({
							title:'Usuario Creado',
							text:'El usuario se creo correctamente',
							type:'success'
						});

					}else if(respuesta.tipo==='login'){
						Swal({
							title:'Login Correcto',
							text:'Presiona OK para abrir el dashboard',
							type:'success'
						})
						.then(resultado=>{
							if(resultado.value){
								window.location.href="index.php";
							}
						})


					}
				}else{
					// Hubo un error
					Swal({
						title:'Error',
						text:'Hubo un error',
						type:'error'
					});
				}

			}
		}

		// Enviar la peticion
		xhr.send(datos);

	}
	
}