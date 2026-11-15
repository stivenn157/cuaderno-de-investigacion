/* Resumen: Sistemas distribuidos (fuente: Taller teórico 4). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/temas/distribuidos'] = `
<h3 id="t1">1. Concepto de sistemas distribuidos</h3>
<p>Un sistema operativo distribuido maneja un grupo de computadores independientes conectados por red, de modo que el usuario los ve y los usa como una sola máquina (Tanenbaum y Van Steen, 2017). Sus cualidades clave son la transparencia, la tolerancia a fallos, la escalabilidad, la concurrencia y el uso compartido de recursos.</p>
<p>En un sistema centralizado todo ocurre en un único servidor; en uno distribuido el trabajo se reparte entre varios nodos que cooperan.</p>

<h3 id="t2">2. Arquitectura cliente-servidor</h3>
<p>Para la plataforma académica de una universidad conviene separar tres capas: el <strong>cliente</strong> (navegador o app) solo muestra la información; el <strong>servidor de aplicaciones</strong> aplica las reglas académicas, como validar usuarios o revisar requisitos; y el <strong>servidor de bases de datos</strong> guarda estudiantes, materias y notas, y solo recibe órdenes de la capa intermedia.</p>

<h3 id="t3">3. Comunicación entre procesos</h3>
<p>Como los programas corren en computadores distintos que no comparten RAM, la comunicación entre procesos (IPC) se hace con mensajes por la red.</p>
<p>El primer mecanismo usa Sockets sobre el protocolo TCP, que confirma cada paquete con un ACK y reenvía los que se pierden. Las llamadas a procedimientos remotos permiten ejecutar funciones de otro servidor, y las colas de mensajes como RabbitMQ o Apache Kafka guardan los avisos si el destino está ocupado o desconectado.</p>

<h3 id="t4">4. Modelos de comunicación</h3>
<p>En la comunicación <strong>síncrona</strong>, quien pregunta se queda esperando la respuesta; en la <strong>asíncrona</strong>, deja el mensaje en una cola y sigue trabajando.</p>
<p>Al cobrar con tarjeta en una tienda virtual se usa una llamada síncrona al banco, porque hace falta un sí o un no inmediato.</p>
<p>Después, el envío de la factura, el descuento del inventario y los reportes van por una cola asíncrona, y el cliente ya no tiene que esperarlos.</p>

<h3 id="t5">5. Transparencia en sistemas distribuidos</h3>
<p>La transparencia esconde que los datos y programas están repartidos en muchos servidores, gracias a una capa intermedia llamada <em>middleware</em>.</p>
<p>Lograrla tiene retos: la latencia de la red, los fallos parciales (no saber si un servidor se apagó o si se cayó la conexión) y mantener los datos iguales en todas partes al mismo tiempo.</p>

<h3 id="t6">6. Tolerancia a fallos</h3>
<p>Si un servidor bancario se apaga a mitad del día, un clúster de alta disponibilidad con equipos gemelos detecta el silencio gracias a los latidos (<em>heartbeat</em>) y pasa el trabajo al respaldo (<em>failover</em>).</p>
<p>Las transacciones ACID y la confirmación en dos fases evitan que el dinero se pierda o se duplique, y la bitácora de escritura anticipada permite terminar lo pendiente cuando el equipo vuelve a encender.</p>

<h3 id="t7">7. Escalabilidad y disponibilidad</h3>
<p>Para que el portal de la universidad no se caiga en la semana de matrículas conviene la <strong>escalabilidad horizontal</strong>: agregar servidores en la nube cuando sube la demanda, en lugar de comprar un equipo gigante que pasaría casi vacío el resto del semestre.</p>
<p>Los balanceadores de carga reparten a los miles de estudiantes que entran a las 8:00 a. m., y la redundancia de servidores y bases de datos mantiene el servicio aunque uno falle.</p>

<h3 id="t8">8. Sistemas de archivos distribuidos</h3>
<p>Para cuatro sedes en ciudades distintas, un sistema de archivos distribuido como CephFS, GlusterFS o Nextcloud, unido por VPN, guarda cada archivo en varios servidores.</p>
<p>El bloqueo de archivos al editar y el control de versiones cuidan la consistencia, y la conexión a Active Directory o LDAP con permisos por rol (RBAC) protege las carpetas de cada área.</p>

<h3 id="t9">9. Aplicaciones empresariales de los sistemas distribuidos</h3>
<p>Una cadena de supermercados con tiendas en todo el país y venta en línea se beneficia de una arquitectura híbrida: un servidor local en cada tienda y servidores centrales en la nube.</p>
<p>Comparten el catálogo, las facturas electrónicas y los puntos de los clientes. Si se corta el internet de una tienda, sus veinte cajas siguen facturando con el servidor local y suben todo a la nube cuando vuelve la conexión.</p>
`;
