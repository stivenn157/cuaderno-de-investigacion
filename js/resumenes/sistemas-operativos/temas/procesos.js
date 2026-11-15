/* Resumen: Procesos y sincronización (fuente: Taller teórico). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/temas/procesos'] = `
<h3 id="t1">1. Diferencia entre un programa y un proceso</h3>
<p>Un programa y un proceso no son lo mismo: el programa es la receta escrita en el cuaderno y el proceso es el momento en que ya se está cocinando. El programa es un archivo quieto en el disco que no consume CPU; el proceso es ese programa cargado en memoria, con su contador de programa, sus registros, su pila y sus archivos abiertos (Silberschatz et al., 2018).</p>
<p>Por eso el kernel guarda mucha más información de un proceso: su ficha de control o PCB, con el estado, la prioridad y los recursos que usa.</p>

<h3 id="t2">2. Administración simultánea de programas</h3>
<p>Con el navegador, un editor, la música y una hoja de cálculo abiertos, cada proceso funciona como una caja separada con su propia memoria virtual. Como los núcleos no alcanzan para todos, el planificador reparte el procesador en turnos de pocos milisegundos.</p>
<p>Sin ese control, un proceso pegado en un ciclo infinito acapararía la CPU, los demás quedarían congelados y los datos se mezclarían entre ventanas.</p>

<h3 id="t3">3. Estados de un proceso y transiciones</h3>
<p>Según el modelo de cinco estados (Stallings, 2018), un proceso nace como <strong>Nuevo</strong>, pasa a <strong>Listo</strong> mientras espera turno, entra <strong>En ejecución</strong> cuando recibe la CPU, queda <strong>Bloqueado</strong> si espera una operación de entrada y salida, y termina como <strong>Terminado</strong>.</p>
<p>Ejemplo: al abrir el programa de facturación el proceso nace, hace fila, recibe la CPU, se bloquea mientras guarda el PDF en el disco, vuelve a la fila al terminar la escritura y finaliza al cerrar la ventana.</p>

<h3 id="t4">4. Necesidad de los algoritmos de planificación en un servidor</h3>
<p>Un servidor que corre a la vez tareas cortas, como revisar una clave, y tareas largas, como armar el balance contable, necesita una regla clara para repartir la CPU.</p>
<p>Sin ella aparecen el <strong>efecto convoy</strong>, en el que las tareas cortas esperan detrás de una larga, y la <strong>inanición</strong>, en la que algunos procesos nunca reciben turno y las consultas terminan por tiempo de espera agotado.</p>

<h3 id="t5">5. Comparación entre los algoritmos FCFS y SJF</h3>
<p><strong>FCFS</strong> (el primero que llega es el primero que se atiende) funciona como la fila del supermercado: es sencillo y casi no gasta recursos al decidir, ideal para sistemas por lotes. <strong>SJF</strong> (el trabajo más corto primero) adelanta las tareas breves y logra el menor tiempo de espera promedio, aunque necesita estimar duraciones y puede dejar esperando a los procesos largos.</p>

<h3 id="t6">6. Acceso simultáneo a un archivo y necesidad de sincronización</h3>
<p>Si dos procesos modifican el mismo archivo sin control, ambos leen el valor viejo y el último en guardar borra el trabajo del otro: es la <strong>pérdida de actualizaciones</strong>.</p>
<p>Los candados de archivo, la exclusión mutua y los monitores obligan a esperar turno: mientras el proceso A edita, el proceso B queda en cola hasta que A guarde y libere el archivo.</p>

<h3 id="t7">7. Concurrencia en aplicación bancaria y condición de carrera</h3>
<p>Una cuenta tiene 100.000 pesos. Al mismo tiempo, el dueño retira 20.000 y su jefe le consigna 50.000. Si la operación del retiro lee el saldo, pierde la CPU y escribe de última, el resultado final es 80.000 en lugar de 130.000.</p>
<p>Eso es una <strong>condición de carrera</strong>: el resultado depende de quién escribe al final, y daña la integridad en silencio, sin mostrar ningún error.</p>

<h3 id="t8">8. Sección crítica y control de acceso a recursos compartidos</h3>
<p>La <strong>sección crítica</strong> es el fragmento de código donde un proceso toca datos compartidos. Como un proceso no sabe cuándo el kernel lo va a pausar, el sistema operativo debe garantizar que solo uno la ejecute a la vez.</p>
<p>Ejemplo: en la web de un cine solo queda libre la silla G-15 y dos compradores la piden al mismo tiempo. Sin exclusión mutua, ambos podrían recibir boleta para la misma silla.</p>

<h3 id="t9">9. Funcionamiento de los semáforos: binarios y contadores</h3>
<p>Un <strong>semáforo</strong>, creado por Edsger Dijkstra, es una variable entera que solo cambia con dos órdenes atómicas: <code>wait()</code>, que resta o hace esperar, y <code>signal()</code>, que suma y avisa.</p>
<p>El <strong>binario</strong> solo vale 0 o 1 y protege un recurso único, como la impresora de etiquetas de la bodega. El <strong>contador</strong> puede valer cualquier número y protege un grupo de recursos iguales, como un conjunto de conexiones a la base de datos.</p>

<h3 id="t10">10. Relación entre la sincronización de procesos y los bloqueos</h3>
<p>Los candados mal combinados generan un <strong>interbloqueo</strong>: cada proceso tiene un recurso y espera el que tiene el otro. Para que ocurra deben coincidir las cuatro condiciones de Coffman: exclusión mutua, retener y esperar, no expropiación y espera circular.</p>
<p>Dos medidas lo evitan: pedir siempre los recursos en el mismo orden, lo que rompe la espera circular, y usar candados con tiempo límite (<code>tryLock</code>) que suelten lo tomado si no consiguen el resto.</p>
`;
