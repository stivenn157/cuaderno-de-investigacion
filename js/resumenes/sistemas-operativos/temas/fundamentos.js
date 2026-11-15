/* Resumen: Fundamentos del sistema operativo (fuente: Actividad 1). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/temas/fundamentos'] = `
<h3 id="concepto">Concepto y propósito del sistema operativo</h3>
<p>Un sistema operativo es el software que administra el hardware y hace de intermediario entre el usuario, las aplicaciones y los componentes físicos. Se encarga de arrancar el equipo y de su <strong>núcleo</strong>, el único código que corre en modo privilegiado: las demás aplicaciones trabajan en modo usuario y deben pedirle las operaciones delicadas mediante <em>llamadas al sistema</em> (Silberschatz et al., 2014).</p>
<p>Sin él, cada programa tendría que saber hablar directamente con cada tipo de procesador, disco o tarjeta de red, algo prácticamente imposible.</p>

<h3 id="relacion">Relación entre hardware, software, usuario y aplicaciones</h3>
<p>Los cuatro componentes forman capas enlazadas: el hardware aporta los recursos, el sistema operativo los controla y coordina, las aplicaciones resuelven las necesidades del usuario y el usuario solo interactúa con las interfaces que esas aplicaciones le ofrecen.</p>
<p>El sistema operativo envuelve la capa física y expone llamadas al sistema que funcionan como puentes estandarizados, así las aplicaciones hacen tareas complejas sin conocer los detalles del hardware (Brookshear y Brylow, 2015).</p>

<h3 id="funciones">Funciones principales del sistema operativo</h3>
<p>Administración de procesos: crea, planifica y termina los procesos. Al abrir el navegador, el sistema crea un proceso, le asigna un identificador y lo pone en la cola de ejecución.</p>
<p>Gestión de la memoria principal (RAM): sabe qué partes de la memoria están en uso y por quién, y reserva bloques para que un programa no sobrescriba a otro.</p>
<p>Gestión de archivos: organiza la información en directorios y controla los permisos sobre el almacenamiento.</p>
<p>Administración de dispositivos de E/S: oculta las diferencias entre periféricos mediante controladores; al conectar unos audífonos Bluetooth, carga el controlador y les envía el audio.</p>
<p>Protección y seguridad: controla el acceso a los recursos para que los procesos de un usuario no interfieran con los de otro.</p>

<h3 id="recursos">Administración de los recursos del sistema</h3>
<p>Como administrador de recursos, el sistema operativo decide quién usa cada recurso, cuándo y por cuánto tiempo, mediante la multiplexación en el tiempo (turnos de CPU) y en el espacio (porciones de memoria y disco).</p>
<p>Ejemplo: imaginemos un portátil con 4 GB de RAM con un navegador lleno de pestañas, una descarga grande, el antivirus y un editor abiertos. Los cuatro procesos compiten por CPU, memoria y disco; si la memoria se agota, el sistema envía páginas inactivas al disco, y cuando esto pasa en exceso aparece la <strong>hiperpaginación</strong>.</p>

<h3 id="procesador">Gestión del procesador y de los procesos</h3>
<p>El <strong>procesador</strong> es el chip físico que ejecuta instrucciones; el <strong>proceso</strong> es una entidad lógica: un programa en ejecución con su código, su contador de programa y sus variables en memoria (Tanenbaum y Bos, 2015).</p>
<p>Como hay muchos más procesos que núcleos, el planificador de la CPU decide a cuál darle el procesador y por cuántos milisegundos. Si falla o no maneja bien las prioridades, el usuario siente congelamientos y respuestas lentas.</p>

<h3 id="archivos">Administración de archivos y directorios</h3>
<p>Un archivo es una colección de datos con nombre que persiste en el almacenamiento. El sistema operativo interviene en todo su ciclo de vida: al crearlo revisa los permisos y reserva espacio, al organizarlo traduce bloques lógicos a ubicaciones físicas, y al leer, modificar o borrarlo vuelve a comprobar quién tiene derecho a hacerlo.</p>

<h3 id="nucleo">Núcleo, controladores y llamadas al sistema</h3>
<p>El kernel se carga en memoria desde el arranque, corre con el máximo privilegio y administra CPU, memoria virtual y procesos. Los controladores traducen sus órdenes al lenguaje de cada dispositivo.</p>
<p>Cuando un programa lee un archivo, prepara una llamada al sistema, el procesador pasa a modo privilegiado, el kernel delega en el controlador del disco y los datos llegan a la RAM por acceso directo a memoria, sin gastar ciclos de CPU.</p>

<h3 id="consola">Intérprete de comandos, consola y comandos básicos</h3>
<p>La <strong>consola</strong> es el entorno que captura el teclado y muestra el texto; el <strong>intérprete de comandos</strong> (shell) analiza cada orden, expande variables y le pide al kernel crear y vigilar los procesos. Frente a una interfaz gráfica, la consola consume muchos menos recursos y permite automatizar tareas.</p>
<p>cd (Change Directory)<br>• Sintaxis: cd [ruta_directorio]<br>• Propósito: cambia el directorio de trabajo actual.<br>• Ejemplo: cd /var/log/nginx</p>
<p>ls / Get-ChildItem (dir)<br>• Sintaxis: ls [opciones] [ruta]<br>• Propósito: lista archivos y carpetas con permisos, tamaño y fecha.<br>• Ejemplo: ls -lah /etc/</p>
<p>mkdir (Make Directory)<br>• Sintaxis: mkdir [opciones] &lt;nombre_carpeta&gt;<br>• Propósito: crea uno o varios directorios.<br>• Ejemplo: mkdir -p proyectos/so/semana1</p>
<p>grep / Select-String<br>• Sintaxis: grep [opciones] "patrón" &lt;archivos&gt;<br>• Propósito: busca texto línea por línea dentro de los archivos.<br>• Ejemplo: grep -i "error" registro.log</p>
`;
