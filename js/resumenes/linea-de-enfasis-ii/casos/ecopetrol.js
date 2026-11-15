/* Resumen del caso: Ransomware en Ecopetrol (fuente: Análisis de caso). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['linea-de-enfasis-ii/casos/ecopetrol'] = `
<h2 id="p1">PARTE I - Contexto y problema</h2>
<h3 id="actividad">Actividad económica de Ecopetrol e importancia de su infraestructura tecnológica</h3>
<p>Ecopetrol S.A. es la empresa petrolera más grande de Colombia, un grupo de 15 compañías que participa en todas las etapas de los hidrocarburos. Su tecnología es su columna vertebral y se divide en dos mundos conectados: la Tecnología de la Información (IT), con centros de datos, ERP y nube, y la Tecnología de Operación (OT), con sistemas SCADA y sensores que vigilan tuberías y refinerías.</p>

<h3 id="incidente">Descripción del incidente de ciberseguridad de julio de 2026</h3>
<p>El 17 de julio de 2026 Ecopetrol informó una intrusión con doble intención: el robo masivo de archivos guardados en la nube y un intento posterior de bloquear sus servidores con ransomware. El ataque se atribuyó a The Gentlemen, un grupo que opera con doble extorsión. Las defensas detuvieron el cifrado a tiempo, pero los documentos ya habían salido.</p>

<h3 id="descarga">Significado de la descarga de información almacenada en la nube</h3>
<p>Que los atacantes descargaran información de la nube significa que hubo una <strong>exfiltración</strong>: los datos salieron de los servidores de trabajo compartido del grupo. Eso abre la puerta al chantaje, como ocurrió el 28 de julio de 2026, cuando el grupo publicó archivos en foros ilegales.</p>

<h3 id="ransomware">Funcionamiento de un ataque de ransomware</h3>
<p>Un ransomware funciona como un secuestro digital: un programa dañino entra a los equipos y le pone un candado criptográfico a archivos, bases de datos y servidores, y luego exige un rescate para liberarlos.</p>
<p>Si no se hubiera frenado el 17 de julio, el bloqueo de los servidores administrativos de las 15 empresas habría impedido despachar combustible, pagar contratistas y comprar insumos, con un golpe para todo el país.</p>

<h3 id="cuentas">Importancia de la información asociada con las 3.300 cuentas de usuario</h3>
<p>Las cerca de 3.300 cuentas alcanzadas guardan el escritorio diario de ingenieros, abogados, analistas financieros y técnicos: contratos, informes, cuadros financieros y datos personales protegidos por la ley, como nombres, cargos, cédulas y teléfonos.</p>

<h3 id="botin">Por qué la información corporativa es objetivo de los ciberdelincuentes</h3>
<p>Para bandas como The Gentlemen, robar documentación administrativa, financiera y contractual es tan rentable como bloquear pantallas: sirve para extorsionar a la víctima y además se vende en la dark web.</p>

<h3 id="consecuencias">Consecuencias económicas, legales, administrativas y reputacionales</h3>
<p>La publicación de archivos de las 15 compañías trae costos de investigación y defensa, posibles sanciones por la Ley 1581 de 2012, el desorden del trabajo normal mientras abogados y técnicos atienden la emergencia y la pérdida de confianza de inversionistas, socios y del público.</p>

<h3 id="medidas">Medidas implementadas por Ecopetrol para contener el incidente</h3>
<p>Al detectar el movimiento extraño, Ecopetrol activó su protocolo de incidentes: aisló los recursos afectados, bloqueó accesos, reforzó el monitoreo con el ColCERT y denunció ante la Fiscalía. Más adelante le conviene reforzar la vigilancia de la nube y la protección de las identidades.</p>

<h2 id="p2">PARTE II - Análisis de evidencias</h2>
<h3 id="cid">Relación del incidente con los principios de Confidencialidad, Integridad y Disponibilidad</h3>
<p>La <strong>confidencialidad</strong> fue el pilar golpeado de lleno: personas sin permiso vieron y se llevaron documentos internos.</p>
<p>La <strong>integridad</strong> se salvó: las revisiones forenses confirmaron que los atacantes no cambiaron ni borraron los registros originales. La <strong>disponibilidad</strong> también resistió, porque el ransomware se bloqueó y la operación siguió al cien por ciento. Dos de los tres pilares salieron bien librados del golpe.</p>

<h3 id="debilidades">Cinco posibles debilidades de seguridad</h3>
<p>Debilidad 1: falta de límites de descarga y de vigilancia sobre los datos que salen de la nube, con herramientas como CASB o DLP.</p>
<p>Debilidad 2: exceso de permisos y conexiones de confianza demasiado abiertas entre las nubes de las filiales, sin aplicar el mínimo privilegio.</p>
<p>Debilidad 3: portales de acceso remoto y equipos VPN sin actualizar, que dejan entrar solo con usuario y clave.</p>
<p>Debilidad 4: robo de tokens de sesión (<em>session hijacking</em>), que permite entrar sin conocer la contraseña.</p>
<p>Debilidad 5: documentos delicados guardados sin clasificar ni cifrar en las carpetas de las 3.300 cuentas.</p>

<h2 id="p3">PARTE III - Propuesta de solución</h2>
<h3 id="estrategias">Cinco estrategias para fortalecer la seguridad informática de Ecopetrol</h3>
<p>Estrategia 1: prevención automatizada de exfiltración con CASB y DLP adaptativo, para frenar descargas masivas de la nube.</p>
<p>Estrategia 2: microsegmentación y arquitectura de confianza cero, para que un acceso no se extienda a las 15 compañías.</p>
<p>Estrategia 3: clasificación automática y cifrado persistente de documentos (IRM), para que un archivo robado no se pueda abrir.</p>
<p>Estrategia 4: identidades protegidas con llaves FIDO2, resistentes al phishing, y tokens amarrados al equipo de la empresa.</p>
<p>Estrategia 5: endurecimiento anti-ransomware y caza de amenazas 24/7 con XDR, SIEM y vigilancia de la dark web.</p>

<h3 id="propuesta">Propuesta comercial de una empresa especializada</h3>
<p>Las cinco estrategias se ofrecen como un servicio gestionado llamado <strong>CloudShield Zero-Exfil Enterprise 360°</strong>: protección de la nube, prevención de exfiltración y resiliencia ante ransomware, con monitoreo permanente, simulacros mensuales tipo Purple Team y un equipo de respuesta a incidentes.</p>

<h2 id="p4">PARTE IV - Conclusiones</h2>
<h3 id="silencio">¿Por qué una empresa puede sufrir una filtración sin que sus operaciones dejen de funcionar?</h3>
<p>Porque el robo de archivos es silencioso y porque la nube de oficina está separada de los sistemas que mueven la producción. Las refinerías siguieron andando mientras los documentos salían por la puerta de atrás.</p>

<h3 id="permisos">¿Por qué la gestión de usuarios y permisos debe ser una prioridad?</h3>
<p>Porque el tamaño de la fuga lo marcó la cantidad de carpetas que podían ver las cuentas comprometidas. La gestión de identidades (IAM) y el mínimo privilegio limitan lo que un intruso alcanza con una sola cuenta.</p>

<h3 id="pyme">¿Qué le pasaría a una empresa de menor tamaño?</h3>
<p>Una pyme colombiana no tendría la caja, los abogados ni los ingenieros de una petrolera: un ataque similar podría dejarla sin operar durante semanas, con multas y clientes perdidos que pondrían en riesgo su existencia.</p>
`;
