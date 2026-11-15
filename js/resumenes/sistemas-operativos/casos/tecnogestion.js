/* Resumen del caso: TecnoGestión (fuente: Parcial 1). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/casos/tecnogestion'] = `
<h2 id="p1">PARTE I - Contexto y problema</h2>
<h3 id="punto1">Punto 1 Diagnóstico inicial de la falla</h3>
<p>Lo primero en soporte es no confundir lo que el usuario ve en pantalla con lo que realmente le pasa al sistema operativo por debajo, separando síntomas, causas y datos para comprobarlas.</p>
<p>El programa de facturación se queda congelado cuando el usuario abre varias cosas a la vez. Eso apunta a la administración de procesos y a la planificación de la CPU: procesos en segundo plano mal optimizados le quitan turnos.</p>
<p>La RAM casi al límite apunta al gestor de memoria; los documentos que tardan en abrir y el aviso de poco espacio, al sistema de archivos, con la partición C llena de temporales. La impresora que desaparece al reiniciar suele deberse a que el router le cambió la IP por DHCP o a una cola de impresión atascada.</p>

<h2 id="p2">PARTE II - Análisis de evidencias</h2>
<h3 id="punto2">Punto 2 Procedimiento de inspección de recursos</h3>
<p>Se hace una revisión en caliente, sin interrumpir al usuario: primero el Administrador de tareas y luego el Monitor de recursos con “resmon”.</p>
<p>En la CPU se revisan el uso total y los tres procesos que más consumen: un uso sostenido de 85% o 90% por un programa ajeno confirma el problema. En la RAM, la memoria libre y los fallos de página; en el disco, el espacio libre en C (menos del 10 % es crítico) y los tiempos de respuesta (más de 50 a 100 ms indican saturación). Con “tasklist /v /fo list” queda un registro de todos los procesos.</p>
<h3 id="punto3">Punto 3 Diagnóstico de la impresora y sus controladores</h3>
<p>Al imprimir, el controlador traduce el documento a un lenguaje como PCL y el spooler guarda los trabajos en el disco para soltarlos cuando la impresora está libre.</p>
<p>El diagnóstico va por niveles: revisar la impresora y el cable, hacer un ping a la IP configurada, comprobar el puerto y, si la cola sigue bloqueada, detener el servicio en “services.msc”, limpiar la carpeta de la cola y volver a iniciarlo.</p>

<h2 id="p3">PARTE III - Propuesta de solución</h2>
<h3 id="punto4">Punto 4. Plan de solución y comprobación</h3>
<p>Lo primero es sacar un respaldo y liberar espacio en el disco: copiar las carpetas y la base de datos de facturación y ejecutar el Liberador de espacio con “cleanmgr”.</p>
<p>Después viene la limpieza del arranque: con Ctrl + Shift + Esc se deshabilitan los programas que se inician solos y consumen memoria sin necesidad.</p>
<p>Para los bloqueos en los que la facturación queda en “No responde”, se revisa el código del error en el Visor de eventos (“eventvwr.msc”) y se repara la base de datos del programa.</p>
<p>La cuarta acción es arreglar la cola de impresión y el puerto de la impresora: limpiar la cola atascada y configurar el puerto con la IP correcta.</p>
<p>La quinta acción revisa la integridad de Windows y del disco con “sfc /scannow” y “chkdsk C: /scan”.</p>
<h3 id="punto5">Punto 5. Prevención y reporte técnico</h3>
<p>El plan preventivo asigna responsables: copias automáticas cada tarde con una prueba de restauración los viernes, actualizaciones fuera del horario de oficina y una IP reservada para la impresora en el router.</p>
<p>Para cerrar el caso se hace un seguimiento de 72 horas con una prueba de carga: la RAM no debe pasar del 80 %, la cola de disco debe quedar por debajo de 1.0 y el disco C debe conservar más del 20 % libre.</p>
`;
