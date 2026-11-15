/* Resumen del caso: MULTISERVICIOS S.A. (fuente: Taller práctico 4). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['sistemas-operativos/casos/multiservicios'] = `
<h2 id="p1">PARTE I - Contexto y problema</h2>
<h3 id="a1">Actividad 1. Concepto de sistemas distribuidos</h3>
<p>MULTISERVICIOS S.A. depende de un esquema centralizado: un solo servidor en la sede principal atiende a 350 empleados en cuatro ciudades y mueve al mismo tiempo inventario, ventas, facturación y clientes. A la hora pico se llenan la memoria, el procesador y el canal de red, y si ese servidor se apaga se detienen las cuatro sedes y no se pueden abrir las tres nuevas.</p>
<p>La salida es un sistema distribuido: un grupo de computadores conectados que reparten las tareas pero que el empleado ve como una sola plataforma (Tanenbaum y Van Steen, 2017). Debe cuidar tres cualidades: transparencia de acceso y ubicación, tolerancia a fallos y escalabilidad.</p>

<h2 id="p2">PARTE II - Análisis de la arquitectura</h2>
<h3 id="a2">Actividad 2. Arquitectura cliente-servidor</h3>
<p>Se propone una arquitectura de tres capas. En la primera están los clientes: los computadores y navegadores de los 350 empleados, que solo muestran formularios y envían solicitudes.</p>
<p>En la segunda, un balanceador de carga reparte las peticiones entre dos o más servidores de aplicaciones. En la tercera, un servidor principal de bases de datos y servidores réplica que mantienen copias al día.</p>
<p>El camino de una consulta es limpio: el empleado envía la petición, el balanceador la pasa al servidor de aplicaciones más libre, este revisa los permisos, guarda el cambio en la base de datos y responde en milisegundos.</p>
<h3 id="a3">Actividad 3. Comunicación entre procesos</h3>
<p>Los módulos de inventario, facturación, ventas y clientes pasan a ser servicios independientes conectados por la red: cuando un vendedor cierra un pedido, el inventario descuenta las unidades y la facturación genera la factura.</p>
<p>Para que ningún dato se pierda se combinan API REST sobre HTTPS con mensajes JSON, una cola de mensajes como RabbitMQ que guarda los avisos si se cae el internet de una ciudad y conexiones cifradas entre las sedes.</p>
<h3 id="a4">Actividad 4. Modelos de comunicación</h3>
<p>El pago en caja usa comunicación síncrona: el vendedor, con el cliente enfrente, necesita confirmar en ese mismo instante que el producto está disponible.</p>
<p>La actualización de catálogos entre ciudades, el envío de facturas por correo y los reportes usan comunicación asíncrona por colas, para que el vendedor siga atendiendo sin esperar.</p>

<h2 id="p3">PARTE III - Propuesta de solución</h2>
<h3 id="a5">Actividad 5. Tolerancia a fallos</h3>
<p>Se elimina el punto único de falla con varios servidores de aplicaciones en paralelo que se vigilan con latidos (<em>heartbeat</em>). Si uno se apaga, el balanceador desvía las conexiones a los equipos sanos mediante <em>failover</em>.</p>
<p>La base de datos principal replica cada factura y cada movimiento de inventario en servidores separados, en otra máquina física o en la nube. Si falla la principal, una réplica toma el mando en pocos segundos.</p>
<p>Las bitácoras de transacciones registran cada paso antes de aplicarlo, así el servidor reparado termina lo que había quedado a medias y se pone al día.</p>
<h3 id="a6">Actividad 6. Sistemas de archivos distribuidos</h3>
<p>Un sistema de archivos distribuido como CephFS, GlusterFS o Nextcloud permite que las siete sedes guarden y abran documentos sin llenar el computador central.</p>
<p>Cada archivo se copia en al menos tres servidores distintos: si uno entra en mantenimiento, el documento sigue disponible en los otros dos.</p>
<p>La conexión a un directorio central con control de acceso por roles (RBAC) separa las carpetas de Ventas, Bodega, Contabilidad y Gerencia, para que cada empleado vea solo lo que le corresponde.</p>
`;
