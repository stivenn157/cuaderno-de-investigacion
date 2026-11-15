/* Resumen: Hardware y rendimiento (fuente: Taller práctico). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/temas/hardware'] = `
<h3 id="t1">1. Bajo rendimiento de un procesador multinúcleo</h3>
<p>Una empresa compra equipos de 8 núcleos y 16 hilos y aun así van lentos. La razón es el software: muchas tareas diarias, como mover mallas en un programa 3D, trabajan en un solo hilo, así que un núcleo se satura mientras los otros siete esperan.</p>
<p>Además, un núcleo físico no equivale a dos hilos: los hilos comparten el mismo motor. También influyen el calentamiento (<em>thermal throttling</em>), la poca RAM, los discos lentos y la falta de una tarjeta gráfica dedicada.</p>

<h3 id="t2">2. Administración de procesos e hilos por parte del kernel</h3>
<p>Con navegador, editor de fotos, reproductor y base de datos abiertos, el kernel reparte el procesador con multitarea apropiativa: turnos de pocos milisegundos según la prioridad.</p>
<p>Cuando los hilos superan por mucho a los núcleos, el kernel hace miles de cambios de contexto por segundo y ese trabajo extra provoca trabas y demoras.</p>

<h3 id="t3">3. Saturación de memoria RAM</h3>
<p>Un diseñador con 8 GB de RAM abre programas 3D, edición de video y navegador al mismo tiempo. La memoria no alcanza, y si los gráficos son integrados, una parte de esos 8 GB también se la lleva el video.</p>
<p>El sistema recurre a la memoria virtual para no cerrar programas, pero hasta el SSD más rápido es mucho más lento que la RAM. La solución es subir a 32 GB, o al menos a 16 GB en doble canal.</p>

<h3 id="t4">4. Diferencias entre las generaciones DDR</h3>
<p>Comprar DDR5 para todos los equipos es imposible: cada generación tiene la muesca en otro lugar para que no se pueda instalar en una placa equivocada.</p>
<p>La DDR3 tiene 240 pines, trabaja a 1,5 V y va de 800 a 2.133 MT/s. La DDR4 sube a 288 pines y 1,2 V, con 2.133 a 3.200 MT/s. La DDR5 conserva los 288 pines, baja a 1,1 V, integra su propio regulador de energía y arranca en 4.800 MT/s.</p>

<h3 id="t5">5. Problemas relacionados con los buses de transferencia</h3>
<p>Si el procesador es el motor y la RAM la bodega, el bus es la avenida que los une. Aunque haya 32 GB de RAM, un bus estrecho o lento crea un trancón al mover archivos grandes.</p>
<p>Lo primero que hay que revisar es si la memoria está en un solo canal: repartirla en dos módulos (doble canal) duplica los carriles disponibles.</p>

<h3 id="t6">6. Gráficos integrados frente a tarjetas de video dedicadas</h3>
<p>La GPU es un chip con miles de unidades pequeñas que calculan en paralelo. La integrada viene con el procesador, gasta poca energía y comparte la RAM; la dedicada se conecta en la ranura PCI Express y trae su propia memoria y refrigeración.</p>
<p>La integrada sirve para ofimática y equipos compactos; la dedicada es necesaria para videojuegos, modelado 3D y edición de video.</p>

<h3 id="t7">7. Procesador potente con bajo rendimiento gráfico</h3>
<p>Un procesador de 16 núcleos y 32 hilos no reemplaza a la GPU. La CPU dirige en serie y la GPU dibuja en paralelo: si la parte gráfica es débil, el procesador espera y el equipo se traba. Instalar una tarjeta dedicada cambia el rendimiento por completo.</p>

<h3 id="t8">8. Memoria RAM compartida y memoria VRAM</h3>
<p>Con gráficos integrados, el sistema aparta primero un bloque fijo de 512 MB o 1 GB y luego toma más RAM a medida que la necesita, lo que deja menos memoria para los programas. Una tarjeta dedicada con 8 GB de VRAM tiene memoria propia y un bus mucho más ancho, por eso le gana con amplitud al renderizar o editar video.</p>

<h3 id="t9">9. Problemas de compatibilidad entre componentes</h3>
<p>Antes de modernizar hay que revisar el socket y el chipset de la placa, la generación de RAM que acepta, la potencia de la fuente, el enfriamiento y el espacio del gabinete. La mejor estrategia es actualizar cada equipo según el trabajo real de cada puesto.</p>

<h3 id="t10">10. Diagnóstico integral de un computador</h3>
<p>Un equipo con 4 núcleos y 8 hilos, 8 GB de DDR4, gráficos integrados y un SSD de 256 GB se traba al editar video porque la RAM y la parte gráfica están al límite. Las primeras mejoras son más RAM y una tarjeta de video dedicada, y luego más espacio en disco.</p>
`;
