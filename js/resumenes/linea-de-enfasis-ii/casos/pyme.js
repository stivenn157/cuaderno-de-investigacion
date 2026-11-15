/* Resumen del caso: Diagnóstico de una pyme (fuente: Taller práctico). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['linea-de-enfasis-ii/casos/pyme'] = `
<h2 id="p1">PARTE I - Contexto y problema</h2>
<h3 id="activos">Identificación de activos críticos</h3>
<p>Una empresa comercial trabaja con cinco activos que sostienen sus ventas diarias:</p>
<div class="tabla"><table><thead><tr><th>Activo</th><th>Función</th><th>Si se pierde</th></tr></thead><tbody>
<tr><td>Base de datos de clientes y proveedores</td><td>Guarda datos personales e historial de ventas</td><td>Se pierde el historial y se expone información protegida</td></tr>
<tr><td>Facturación e inventario</td><td>Registra ventas y existencias</td><td>Se detienen la operación y la contabilidad</td></tr>
<tr><td>Tienda virtual y pagos</td><td>Recibe pedidos y cobros en línea</td><td>Se frenan los ingresos y se pueden alterar precios</td></tr>
<tr><td>Almacenamiento en la nube</td><td>Guarda la información financiera y operativa</td><td>Se pierde el respaldo de los documentos</td></tr>
<tr><td>Red Wi-Fi compartida</td><td>Conecta a empleados y visitantes</td><td>Permite ataques de intermediario hacia equipos con información</td></tr>
</tbody></table></div>

<h3 id="incidente">Análisis del incidente</h3>
<p>La <strong>amenaza</strong> fue un phishing: llegó un correo que parecía de un proveedor y pedía actualizar las credenciales. La <strong>vulnerabilidad</strong> fue la falta de capacitación y de controles. El <strong>incidente</strong>: credenciales comprometidas, accesos inusuales al correo días después y problemas para consultar los archivos de la nube. Se afectaron la confidencialidad y la disponibilidad.</p>

<h2 id="p2">PARTE II - Análisis de evidencias</h2>
<h3 id="impacto">Evaluación del impacto empresarial</h3>
<p>Sin la tienda virtual se pierden ventas que nunca se recuperan; sin facturación ni inventario se paraliza la bodega; los pedidos incumplidos y los cobros alterados dañan la reputación; la recuperación cuesta peritos, asesorías y posibles sanciones; y sin archivos no se sabe qué cobrar ni qué pagar a los proveedores.</p>

<h2 id="p3">PARTE III - Propuesta de solución</h2>
<h3 id="prioridades">Priorización de necesidades</h3>
<p>Los problemas se ordenan según su urgencia, y cada uno recibe una medida concreta:</p>
<div class="tabla"><table><thead><tr><th>Problema</th><th>Medida de protección</th></tr></thead><tbody>
<tr><td>Contraseñas compartidas sin verificación en dos pasos</td><td>Cuentas individuales, gestor de contraseñas y verificación en dos pasos en correo y nube</td></tr>
<tr><td>Copias ocasionales y sin verificar</td><td>Respaldos automáticos con la regla 3-2-1 y pruebas de recuperación</td></tr>
<tr><td>Empleados sin formación</td><td>Capacitaciones periódicas con simulacros de phishing</td></tr>
<tr><td>Sin procedimiento para reportar incidentes</td><td>Protocolo de respuesta: a quién avisar, cómo y cómo guardar evidencias</td></tr>
<tr><td>Wi-Fi compartido con visitantes</td><td>Red de invitados separada con cifrado WPA2 o WPA3</td></tr>
</tbody></table></div>

<h3 id="decisiones">Toma de decisiones gerenciales</h3>
<p>Acciones:</p>
<p>Cambiar de inmediato todas las credenciales comprometidas y cerrar las sesiones activas.</p>
<p>Activar la verificación en dos pasos en el correo corporativo y en todos los accesos a la nube.</p>
<p>Establecer una política de contraseñas individuales que no se comparten.</p>
<p>Configurar el respaldo de los archivos críticos y probar su recuperación.</p>
<p>Capacitar a los empleados para que reconozcan y eviten estos ataques.</p>
<p>La prioridad principal es proteger las cuentas con medidas de bajo costo, sin software complejo ni equipos costosos, para evitar que el negocio se paralice.</p>

<h2 id="p4">PARTE IV - Diagnóstico de Mercados y Suministros del Oriente</h2>
<h3 id="empresa">1. Información general y 2. Infraestructura tecnológica</h3>
<p>Mercados y Suministros del Oriente S. A. S. vende al por menor y al por mayor mercado, insumos de cafetería y productos de aseo. Su tecnología creció poco a poco: computadores de escritorio en cajas y bodega, un servidor contable, un sistema POS y un único Wi-Fi para todos.</p>

<h3 id="problemas">3. Información que necesita proteger y 4. Identificación de problemas de seguridad</h3>
<p>Debe proteger la facturación, el inventario, las listas de clientes y proveedores y las claves bancarias de la gerencia. Al compararlo con su forma de trabajar aparecen cinco fallas graves: copias en una USB guardada junto al servidor, una cuenta de administrador compartida, sistemas viejos y memorias USB personales, un Wi-Fi compartido con proveedores y claves que nadie quita cuando un empleado se retira.</p>

<h3 id="diagnostico">5. Diagnóstico inicial</h3>
<div class="tabla"><table><thead><tr><th>Necesidad</th><th>Riesgo</th><th>Medida inicial</th></tr></thead><tbody>
<tr><td>Respaldo externo de la información</td><td>Si se daña el disco o hay un robo, se pierde todo</td><td>Copias automáticas fuera del local y en la nube</td></tr>
<tr><td>Cuentas individuales en cajas y bodega</td><td>Nadie sabe quién cambió precios o existencias</td><td>Un usuario por persona con permisos mínimos</td></tr>
<tr><td>Protección de equipos y puertos</td><td>Un virus captura claves bancarias o cifra el servidor</td><td>Actualizar sistemas, antivirus y bloquear USB</td></tr>
<tr><td>Segmentación del Wi-Fi</td><td>Un extraño entra a las carpetas del servidor</td><td>Red separada para invitados</td></tr>
<tr><td>Ciclo de vida de accesos</td><td>Un exempleado filtra o borra datos</td><td>Quitar accesos al retirarse y capacitar al personal</td></tr>
</tbody></table></div>

<h2 id="p5">PARTE V - Conclusiones y reflexión</h2>
<h3 id="reflexion">Lo que deja el caso</h3>
<p>Una empresa pequeña puede sufrir un ataque en cualquier momento, y hoy las pymes son el blanco preferido. Cuidar la información no puede quedar solo en manos del técnico: es un trabajo repartido entre jefes, empleados y el encargado de tecnología. El respaldo automático y la protección de los equipos de caja y bodega son, además, una buena oportunidad de negocio.</p>
`;
