<aside class="contenedor-proyectos">
    <div class="panel crear-proyecto">
        <a href="#" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
    </div>
    
    <div class="panel lista-proyectos">
        <h2>Proyectos</h2>
        <ul id="proyectos">
            <?php $proyectos = obtenerProyectos();?>
            <?php if($proyectos): ?>
                <?php foreach($proyectos as $proyecto): ?>
                    <li>
                        <a href="index.php?id_proyecto=<?=$proyecto['id']?>" id="proyecto:<?=$proyecto['id']?>"><?=$proyecto['nombre'] ?></a>
                    </li>
                <?php endforeach;?>
            <?php endif; ?>   
        </ul>
    </div>
</aside>