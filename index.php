<?php 
include 'inc/funciones/sesiones.php';
include 'inc/funciones/funciones.php';
include 'inc/templates/header.php';
include 'inc/templates/barra.php';
    // echo "<pre>";
    //     var_dump($_SESSION);
    // echo "</pre>";

// obtener el id del proyecto de la url
$id_proyecto = isset($_GET['id_proyecto']) ? $_GET['id_proyecto']: '';
?>

<div class="contenedor">
    <?php include 'inc/templates/sidebar.php'; ?>
    <main class="contenido-principal">
        <?php $proyecto = obtenerNombreProyecto($id_proyecto);?> 
        <?php if($proyecto):?>
            <h1>Proyecto Actual:
                <?php foreach($proyecto as $nombre): ?>
                    <span><?=$nombre['nombre']?></span>
                <?php endforeach; ?>       
            </h1>

            <form action="#" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                </div>
                <div class="campo enviar">
                    <input type="hidden" id="id_proyecto" value="<?=$id_proyecto?>">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>

            <?php else: ?>
                <?php echo "<p>selecciona un proyecto a la izquierda</p>";?>         
            <?php endif; ?>



            <h2>Listado de tareas:</h2>

            <div class="listado-pendientes">
                <ul>
                    <?php 
                    //tareas del proyecto actual
                    $tareas = obtenerTareasProyecto($id_proyecto);
                    ?>

                    <?php if($tareas->num_rows>0): ?>
                        <?php foreach($tareas as $tarea): ?>
                            <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                                <p><?=$tarea['nombre']?></p>
                                <div class="acciones">
                                    <i class="far fa-check-circle <?=$tarea['estado']==='1'?'completo':''?>"></i>
                                    <i class="fas fa-trash"></i>
                                </div>
                            </li>  
                        <?php endforeach; ?>   
                    <?php else: ?>
                        <p class="lista-vacia">No hay tareas en este proyecto</p>
                    <?php endif; ?>   

                        
                    </ul>
                </div>
                <div class="avance">
                    <h2>Avance del Proyecto:</h2>
                    <div id="barra-avance" class="barra-avance">
                        <div id="porcentaje" class="porcentaje">
                            
                        </div>
                    </div>
                </div>

            </main>
        </div><!--.contenedor-->
        <?php 
        include 'inc/templates/footer.php';
        ?>

