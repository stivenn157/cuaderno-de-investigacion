/* Resumen: Activos, amenazas y vulnerabilidades (fuente: Taller 1). */
window.Resumenes = window.Resumenes || {};
window.Resumenes['linea-de-enfasis-ii/temas/activos'] = `
<h3 id="activos">Activos de información</h3>
<p>Un activo de información es la información, o el recurso que la guarda y la procesa, que tiene valor para la empresa porque sostiene su operación. Su valor se mide por lo que la empresa perdería si se daña, se filtra o deja de estar disponible.</p>
<div class="tabla"><table><thead><tr><th>Activo</th><th>Tipo</th><th>Por qué importa</th></tr></thead><tbody>
<tr><td>Bases de datos</td><td>Información</td><td>Su pérdida detiene la facturación y puede traer sanciones por protección de datos</td></tr>
<tr><td>Servidores de producción y ERP</td><td>Hardware y software</td><td>Mantienen la empresa funcionando; su caída paraliza las tareas</td></tr>
<tr><td>Infraestructura de red</td><td>Hardware</td><td>Sin ella no hay acceso a los sistemas ni comunicación</td></tr>
<tr><td>Copias de seguridad</td><td>Información</td><td>No se usan a diario, pero son esenciales para recuperarse de un incidente</td></tr>
<tr><td>Equipos de usuario y correo</td><td>Servicio y hardware</td><td>Si fallan, la actividad diaria se ve afectada</td></tr>
</tbody></table></div>

<h3 id="amenazas">Amenazas y vulnerabilidades</h3>
<p>Es común confundir términos que según la norma ISO/IEC 27000 describen cosas distintas. La <strong>amenaza</strong> es la causa potencial de un daño; la <strong>vulnerabilidad</strong>, la debilidad que la amenaza aprovecha; el <strong>riesgo</strong>, la probabilidad de que ocurra combinada con su impacto; y el <strong>incidente</strong>, el daño que ya sucedió.</p>
<p>Ejemplo: una distribuidora usa una aplicación web propia para que los vendedores suban pedidos, pero el formulario no valida lo que se escribe. La vulnerabilidad es esa falta de validación; la amenaza, un atacante que inyecta código; el incidente, la base de datos alterada o expuesta.</p>
<p>Otro caso frecuente: los equipos de tesorería de una empresa mediana trabajan con permisos de administrador y sin actualizaciones. Un solo correo infectado basta para que el malware se instale y llegue a la información contable.</p>
`;
