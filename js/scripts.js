eventListeners();
// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');


function eventListeners(){

	//Document Ready
	document.addEventListener('DOMContentLoaded',function(){
		actualizarProgreso();
	});

	// Boton para crear proyecto
	document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);

	// Boton para una nueva tarea
	document.querySelector('.nueva-tarea').addEventListener('click',agregarTarea);

	// botones para las acciones de las tareas
	document.querySelector('.listado-pendientes').addEventListener('click',accionesTareas);
}

function nuevoProyecto(e){
	e.preventDefault();
	console.log('presionaste en nuevo proyecto');

	// Crea un input para el nombre del nuevo proyecto
	var nuevoProyecto = document.createElement('li');
	nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
	listaProyectos.appendChild(nuevoProyecto);

	//Seleccionar el input con  id con el nuevo-proyecto
	var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
	
	//Al presionar enter crear el nuevo proyecto
	inputNuevoProyecto.addEventListener('keypress',function(e){
		var tecla = e.which || e.keyCode;
		if(tecla === 13){
			guardarProyectoDB(inputNuevoProyecto.value);
			listaProyectos.removeChild(nuevoProyecto);
		}
	});

}





function guardarProyectoDB(nombreProyecto){

	

	var xhr = new XMLHttpRequest();
	var datos = new FormData();
	datos.append('proyecto',nombreProyecto);
	datos.append('accion','crear');

	xhr.open('POST','inc/modelos/modelo-proyecto.php',true);

	xhr.onload = function(){
		if(this.status === 200){
			var respuesta = JSON.parse(xhr.responseText);
			var proyecto = respuesta.nombre_proyecto,
			id_proyecto = respuesta.id_proyecto,
			tipo = respuesta.tipo,
			resultado = respuesta.respuesta;

			if(resultado==='correcto'){
				//Fue exitoso
				if(tipo==='crear'){
					//se creo un nuevo proyecto
					//Inyectar el html
					var nuevoProyecto = document.createElement('li');
					nuevoProyecto.innerHTML = `
					<a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
					${proyecto}
					</a>`;
					listaProyectos.appendChild(nuevoProyecto);	

					Swal({
						title:'Proyecto Creado',
						text:`El proyecto ${proyecto} se creo correctamente`,
						type:'success'
					})
					.then(resultado=>{
						//apenas presione el boton ok redireccionar a la nueva url
						if(resultado.value){
							window.location.href=`index.php?id_proyecto=${id_proyecto}`;
						}		
					});

					
				}else{
					//se actualizo o elimino un proyecto
					console.log('actualizo o elimino');
				}
			}else{
				Swal({
					type:'error',
					title:'Error!',
					text:'Hubo un error'
				});
			}



		}
	}

	xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e){
	e.preventDefault();
	var nombreTarea = document.querySelector('.nombre-tarea').value;
	// Validar que el campo tenga algo escrito
	if(nombreTarea===''){
		Swal({
			title:'Error',
			text:'Una tarea no puede ir vacia',
			type:'error'
		});
	}else{
		//Insertar en php
		var xhr = new XMLHttpRequest();

		var datos = new FormData();
		datos.append('tarea',nombreTarea);
		datos.append('accion','crear');
		datos.append('id_proyecto',document.querySelector('#id_proyecto').value);

		xhr.open('POST','inc/modelos/modelo-tareas.php',true);
		xhr.onload = function(){
			if(this.status===200){
				var respuesta = JSON.parse(xhr.responseText);
				var resultado = respuesta.respuesta,
				tarea = respuesta.tarea,
				id_insertado = respuesta.id_insertado
				tipo=respuesta.tipo;
				if(resultado==='correcto'){
					if(tipo==='crear'){
						Swal({
							type:'success',
							title:'Tarea Creada',
							text:`La tarea ${tarea} se creo correctamente`
						});

						//seleccionar el parrafo con la lista vacia
						var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
						if(parrafoListaVacia.length > 0){
							document.querySelector('.lista-vacia').remove();
						}

						// construir template
						var nuevaTarea = document.createElement('li');
						//asignar id 
						nuevaTarea.id= `tarea:${id_insertado}`;
						//asignar clase tarea que tiene estilos definidos
						nuevaTarea.classList.add('tarea');
						//construir el html
						nuevaTarea.innerHTML= `
						<p>${tarea}</p>
						<div class="acciones">
						<i class="far fa-check-circle"></i>
						<i class="fas fa-trash"></i>
						</div>
						`;

						//agregarlo al html
						var listado = document.querySelector('.listado-pendientes ul');
						listado.appendChild(nuevaTarea);

						//limpiar el formulario
						document.querySelector('.agregar-tarea').reset();

						//Actualizar el Progreso
						actualizarProgreso();
					}

				}else{
					Swal({
						type:'error',
						title:'Error!',
						text:'Hubo un error'
					});
				}

			}
		}
		xhr.send(datos);

	}

}

// Cambia el estado de las tareas o las elimina (delegation)
function accionesTareas(e){
	e.preventDefault();
	if(e.target.classList.contains('fa-check-circle')){
		// console.log('hiciste click en el circulo');
		if(e.target.classList.contains('completo')){
			e.target.classList.remove('completo');
			cambiarEstadoTarea(e.target,0);
		}else{
			e.target.classList.add('completo');
			cambiarEstadoTarea(e.target,1);
		}
	}

	if(e.target.classList.contains('fa-trash')){
		// console.log('hiciste click en borrar');
		Swal.fire({
			title: 'Seguro(a)?',
			text: "Esta accion no se puede deshacer!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si,borrar!',
			cancelButtonText:'Cancelar'
		}).then((result) => {
			if (result.value) {
				var tareaEliminar = e.target.parentElement.parentElement;
				//Borar de la db
				eliminarTareaDB(tareaEliminar);

				//borrar del html
				tareaEliminar.remove();

				Swal.fire(
					'Eliminado!',
					'La tarea fue eliminada.',
					'success'
					)
			}
		})
	}
}

//completa o descompleta la tarea
function cambiarEstadoTarea(tarea,estado){
	var idTarea = tarea.parentElement.parentElement.id.split(':');
	//crear llamado ajax
	var xhr = new XMLHttpRequest();

	var datos = new FormData();
	datos.append('id',idTarea[1]);
	datos.append('accion','actualizar');
	datos.append('estado',estado);


	xhr.open('POST','inc/modelos/modelo-tareas.php',true);

	xhr.onload = function(){
		if(this.status === 200){
			var respuesta = JSON.parse(xhr.responseText);
			console.log(respuesta);
			//Actualizar el Progreso
			actualizarProgreso();
		}
	}

	xhr.send(datos);
}

//Elimina las tareas de la base de datos
function eliminarTareaDB(tarea){
	var idTarea = tarea.id.split(':');
	//crear llamado ajax
	var xhr = new XMLHttpRequest();

	var datos = new FormData();
	datos.append('id',idTarea[1]);
	datos.append('accion','eliminar');

	xhr.open('POST','inc/modelos/modelo-tareas.php',true);

	xhr.onload = function(){
		if(this.status === 200){
			var respuesta = JSON.parse(xhr.responseText);
			console.log(respuesta);
			//Comprobar que halla tareas restantes
			var listaTareasRestantes = document.querySelectorAll('li.tarea');
			if(listaTareasRestantes.length===0){
				document.querySelector('.listado-pendientes ul').innerHTML = `
				<p class="lista-vacia">No hay tareas en este proyecto</p>
				`;
			}

			// Actualizar el progreso
			actualizarProgreso();


		}
	}

	xhr.send(datos);
}

//Actualiza el avance del proyecto
function actualizarProgreso(){
	//Obtener todas las tareas
	const tareas = document.querySelectorAll('li.tarea');

	// obtener las tareas completadas
	const tareasCompletadas = document.querySelectorAll('i.completo');

	//Determinar el avance
	const avance = Math.round((tareasCompletadas.length / tareas.length)*100);
	
	//asignar el avance a la barra
	const porcentaje = document.querySelector('#porcentaje');
	porcentaje.innerHTML = `<span>${avance}%</span>`;
	porcentaje.style.width = `${avance}%`;

	//mostrar alerta al completar el 100%
	if(avance===100){
		Swal({
			title:'Proyecto Terminado',
			text:`Ya no tienes tareas pendientess`,
			type:'success'
		})
	}

}