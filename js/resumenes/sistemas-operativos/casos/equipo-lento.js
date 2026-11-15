/* Resumen del caso: Un equipo al límite (fuente: Actividad práctica). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/casos/equipo-lento'] = `
<h2 id="p1">PARTE I - Contexto y problema</h2>
<h3 id="caso">El caso de Soluciones Digitales S. A. S.</h3>
<p>Un empleado del área administrativa reporta que su computador está muy lento, que la hoja de cálculo y el software de facturación se bloquean y que aparecen avisos de falta de memoria. El sistema operativo es el que reparte el procesador, la RAM y el disco entre los programas, así que el problema se analiza desde sus funciones (Silberschatz et al., 2018).</p>
<p>a. Síntomas principales: el Administrador de tareas muestra la CPU al 90 %, la memoria al 97 % y el disco al 100 %. MATLAB R2019b consume el 30,2 % de la RAM, Chrome el 13,5 %, Spotify el 7,9 % y Edge el 6,9 %.</p>
<p>b. Posibles causas: programas que no son del trabajo administrativo (MATLAB y Spotify), dos navegadores abiertos a la vez, la RAM casi llena que obliga a usar el disco como memoria y 91 procesos acumulados en segundo plano.</p>

<h2 id="p2">PARTE II - Análisis de evidencias</h2>
<h3 id="conceptos">Conceptos del sistema operativo involucrados</h3>
<p>• Procesos y planificación: con la CPU al 90 % y el disco al 100 %, muchos procesos hacen fila esperando turno y los programas de trabajo responden tarde.</p>
<p>• Memoria RAM y memoria virtual: al llenarse la RAM al 97 %, Windows usa un pedazo del disco como si fuera memoria. Como el disco es mucho más lento, todo el equipo se frena.</p>
<p>• Kernel: está saturado atendiendo las peticiones del disco y cambiando rápidamente de un proceso a otro.</p>
<h3 id="procedimiento">Procedimiento de diagnóstico paso a paso</h3>
<p>Paso 1 (Información previa antes de hacer cambios): pedirle al empleado que guarde su trabajo y dejar evidencia del estado del equipo con una captura o con el comando <code>tasklist</code>.</p>
<p>Paso 2 (Consultar consumo de CPU y RAM): abrir el Administrador de tareas con Ctrl + Shift + Esc y revisar la pestaña Rendimiento.</p>
<p>Paso 3 (Identificar los procesos que más consumen): ordenar por memoria y confirmar que MATLAB, Chrome, Spotify y Edge son los que la llenan.</p>
<p>Paso 4 (Verificar aplicaciones innecesarias en segundo plano): revisar los 91 procesos en segundo plano y la pestaña Inicio para encontrar programas extraños, como "Advanced System Repair Pro Service".</p>

<h2 id="p3">PARTE III - Propuesta de solución</h2>
<h3 id="acciones">Soluciones propuestas</h3>
<p>Acción 1 (Cerrar programas que no son del trabajo y usar un solo navegador): Problema: RAM al 97 % y disco al 100 %. Procedimiento: finalizar MATLAB, Spotify y Edge desde el Administrador de tareas. Resultado y comprobación: se libera más del 40 % de la RAM y el disco baja a menos del 20 %.</p>
<p>Acción 2 (Quitar programas del inicio automático): Problema: aplicaciones que siguen consumiendo después de cerrarlas. Procedimiento: deshabilitarlas en la pestaña Inicio y desactivar la ejecución en segundo plano de los navegadores.</p>
<p>Acción 3 (Desinstalar software basura): Problema: servicios ajenos al trabajo que gastan recursos. Procedimiento: detenerlos en services.msc y desinstalarlos.</p>
<p>Acción 4 (Ajustar la memoria virtual y limpiar archivos temporales): Problema: avisos de falta de memoria. Procedimiento: pasar el Liberador de espacio (cleanmgr.exe) y revisar el archivo de paginación en sysdm.cpl.</p>
<p>Acción 5 (Explicarle lo básico al usuario): Problema: el trabajador no sabe qué le pone lento el equipo. Procedimiento: enseñarle a usar el Administrador de tareas y darles prioridad a los programas del trabajo.</p>
<h3 id="plan">Plan de mejoramiento preventivo</h3>
<p>1. Gestión de permisos de usuario: dejar la cuenta del empleado como usuario estándar para que no instale programas ajenos al trabajo.</p>
<p>2. Actualización controlada de controladores: revisarlos cada dos o tres meses, creando antes un punto de restauración.</p>
<p>3. Mantenimiento de dispositivos y hardware: limpiar archivos temporales, ejecutar <code>sfc /scannow</code> y cambiar el disco mecánico por un SSD.</p>
<p>4. Copias de seguridad (backups): programarlas fuera del horario de trabajo para no frenar el disco.</p>
<p>5. Monitoreo preventivo de errores: revisar cada quince días el Visor de eventos (eventvwr.msc) y el Monitor de confiabilidad.</p>
<h3 id="conclusiones">Conclusiones</h3>
<p>El equipo no estaba dañado: estaba saturado por programas ajenos al trabajo. Con buena administración de procesos y memoria, permisos adecuados y un poco de capacitación, el computador vuelve a responder con normalidad.</p>
`;
