/* Resumen del caso: Comercializadora EMBLEMA (fuente: Parcial práctico). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['linea-de-enfasis-ii/casos/emblema'] = `
<h2 id="p1">PARTE I - Contexto y problema</h2>
<h3 id="activos">1. Identificación y análisis de activos críticos</h3>
<p>Comercializadora EMBLEMA S. A. S. depende de cinco activos enlazados entre sí: el sistema de facturación e inventario, la base de datos de clientes y proveedores, el correo corporativo, el almacenamiento en la nube y la tienda virtual por donde entran los pedidos.</p>
<p>Si se ordenan desde el más crítico, primero va la base de datos de clientes y proveedores, porque una filtración trae multas y pérdida de confianza que no se arreglan reiniciando un equipo. Siguen la facturación e inventario, la tienda virtual, el correo y la nube, aunque justo por el correo y la nube fue por donde entró el problema.</p>

<h2 id="p2">PARTE II - Análisis de evidencias</h2>
<h3 id="incidente">2. Investigación y diagnóstico del incidente de seguridad</h3>
<p>La amenaza fue un ataque de <strong>phishing</strong> con suplantación: un correo que imitaba a un proveedor conocido para que un empleado escribiera su usuario y su contraseña en un enlace falso.</p>
<p>Funcionó porque se juntaron siete puntos débiles: personal sin capacitación, contraseñas compartidas, sin verificación en dos pasos, copias de seguridad sin probar, sin procedimiento para reportar incidentes, permisos amplios y una gerencia que creía que era un problema solo del técnico. La confidencialidad quedó comprometida y la disponibilidad también, con la nube y la facturación bloqueadas.</p>
<p>La investigación sigue siete pasos: hablar con el empleado sin regañarlo, revisar los accesos al correo y a la nube, buscar reglas de reenvío escondidas, ver qué archivos se tocaron, comprobar otras cuentas, revisar los buzones de los compañeros y llamar a los proveedores reales.</p>

<h3 id="impactos">3. Evaluación de impactos y consecuencias empresariales</h3>
<p>Dos días sin facturación ni inventario arman un trancón inmediato: no se pueden sacar facturas, los envíos se atrasan y todo se anota a mano para pasarlo después al sistema.</p>
<p>En lo legal, la Superintendencia de Industria y Comercio puede sancionar la fuga de datos personales, y la demora en las facturas electrónicas trae multas. Por orden de urgencia, primero se recupera la operación, luego se cierra el paso al intruso y por último se cuida la reputación.</p>

<h2 id="p3">PARTE III - Propuesta de solución</h2>
<h3 id="medidas">4. Diseño de soluciones y medidas de protección</h3>
<p>Como en la empresa no sobra la plata, se proponen cinco medidas sencillas y baratas: contraseñas propias para cada trabajador con verificación en dos pasos, reglas contra el phishing (filtros y llamar al proveedor antes de cambiar cualquier cuenta bancaria), copias de seguridad automáticas y probadas, capacitación práctica para los veinticinco trabajadores y un procedimiento claro para reportar incidentes.</p>

<h3 id="plan">5. Plan de acción y estrategia empresarial de ciberseguridad</h3>
<p>El plan de los primeros treinta días tiene cuatro tramos: contención de urgencia (días 1 a 3), investigación en siete pasos (días 4 a 10), montaje de las medidas (días 8 a 20) y procedimientos y cultura de trabajo (días 15 a 30).</p>
<p>La gerencia lo sigue con ocho indicadores sencillos, por ejemplo 100 % de trabajadores con verificación en dos pasos y 0 contraseñas compartidas.</p>
<p>La lección del caso: el problema nunca fue solo un mal clic, sino los descuidos acumulados. Con controles baratos bien puestos y jefes comprometidos, cualquier empresa pequeña baja su riesgo.</p>
`;
