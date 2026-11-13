/*
 * Efectos de "Parcial práctico: Caso Comercializadora EMBLEMA".
 *  - Candado lateral que se cierra a medida que avanza el plan, con el
 *    contador de horas sin facturación.
 *  - Ranking de los cinco activos críticos.
 *  - Correo de phishing del falso proveedor.
 *  - Reloj de 48 horas sin sistema.
 *  - Plan de 30 días en cuatro tramos y sus metas.
 */
(function () {
  'use strict';

  const CLAVE = 'linea-de-enfasis-ii/parcial-practico';
  const Fx = window.Fx;

  const ACTIVOS = [
    'Base de datos de clientes y proveedores',
    'Facturación e inventario',
    'Tienda virtual',
    'Correo corporativo',
    'Almacenamiento en la nube',
  ];

  const TRAMOS = [
    ['Días 1 a 3', 'Contención de urgencia', 1, 3],
    ['Días 4 a 10', 'Investigación en siete pasos', 4, 10],
    ['Días 8 a 20', 'Montaje de las medidas', 8, 20],
    ['Días 15 a 30', 'Procedimientos y cultura', 15, 30],
  ];

  const FASES = ['Activos identificados', 'Investigando el phishing', 'Midiendo el impacto', 'Diseñando medidas', 'Plan de 30 días en marcha'];

  function panelHtml() {
    return `
      <div class="fx-panel pp-candado">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Seguridad de EMBLEMA</p>
        <p class="fx-panel__estado">Activos identificados</p>
        <svg class="pp-candado__svg" viewBox="0 0 100 120" aria-hidden="true">
          <path class="pp-candado__arco" d="M30 55 V35 a20 20 0 0 1 40 0 V55" />
          <rect class="pp-candado__cuerpo" x="18" y="55" width="64" height="52" rx="6" />
          <circle class="pp-candado__ojo" cx="50" cy="78" r="6" />
          <rect class="pp-candado__ojo" x="47.5" y="80" width="5" height="12" rx="2" />
        </svg>
        <ol class="pp-avance">${FASES.map(() => '<li></li>').join('')}</ol>
      </div>`;
  }

  function rankingHtml() {
    const filas = ACTIVOS.map((a, i) => `
      <li style="--i: ${i}; --peso: ${1 - i * 0.16}"><span class="pp-rank__n">${i + 1}</span><span class="pp-rank__nombre">${a}</span><span class="pp-rank__barra"></span></li>`).join('');
    return `
      <figure class="fx-figura pp-rank">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Del más crítico al menos crítico</span>Los cinco activos de EMBLEMA</figcaption>
        <ol class="pp-rank__lista">${filas}</ol>
        <p class="fx-nota">Por el correo y la nube fue por donde entró el problema.</p>
      </figure>`;
  }

  function correo() {
    return Fx.correoHtml({
      rotulo: 'Recreación ilustrativa',
      titulo: 'Así se ve un correo que se hace pasar por un proveedor',
      de: 'Distribuciones Proveedor <[[facturacion@proveedor-pagos.net]]>',
      asunto: 'Actualización obligatoria de credenciales',
      cuerpo: 'Buen día. Por cambios en nuestra plataforma, [[debe ingresar su usuario y contraseña]] para seguir recibiendo sus facturas.',
      enlace: '[[Actualizar credenciales]]',
      senales: ['Dominio que imita al proveedor real', 'Pide usuario y contraseña por correo', 'Enlace a una página falsa'],
    });
  }

  function relojHtml() {
    return `
      <figure class="fx-figura pp-reloj">
        <div class="pp-reloj__cara" aria-hidden="true"><span class="pp-reloj__aguja"></span></div>
        <div>
          <p class="pp-reloj__n"><span class="pp-reloj__horas">0</span> horas</p>
          <p class="pp-reloj__texto">sin facturación, sin inventario y sin varios archivos de la nube. Todo se anota a mano.</p>
        </div>
      </figure>`;
  }

  function planHtml() {
    const filas = TRAMOS.map(([dias, nombre, ini, fin], i) => `
      <li style="--i: ${i}; --ini: ${(ini - 1) / 30}; --fin: ${fin / 30}">
        <span class="pp-plan__texto"><strong>${nombre}</strong>${dias}</span>
        <span class="pp-plan__pista"><span class="pp-plan__barra"></span></span>
      </li>`).join('');
    return `
      <figure class="fx-figura pp-plan">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Plan de los primeros 30 días</span>Cuatro tramos que se solapan para no frenar el negocio</figcaption>
        <ol class="pp-plan__lista">${filas}</ol>
        <div class="pp-plan__escala" aria-hidden="true"><span>Día 1</span><span>Día 10</span><span>Día 20</span><span>Día 30</span></div>
        <ul class="pp-metas">
          <li><span class="pp-metas__valor">100 %</span>con verificación en dos pasos</li>
          <li><span class="pp-metas__valor">0</span>contraseñas compartidas</li>
        </ul>
      </figure>`;
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('pp');

    const temas = Fx.titulos(prosa).filter((h) => h.tagName === 'H3');
    const [h1, h2, h3, , h5] = temas;
    const ranking = Fx.insertarDespues(Fx.buscarParrafo(prosa, /desde el más crítico/i) || h1, Fx.crear(rankingHtml()));
    const phishing = Fx.insertarDespues(h2, Fx.crear(correo()), 1);
    const reloj = Fx.insertarDespues(h3, Fx.crear(relojHtml()));
    const plan = Fx.insertarDespues(h5, Fx.crear(planHtml()));

    limpiezas.push(Fx.activarAlAparecer([ranking, phishing, reloj, plan], (el) => {
      if (el === reloj) anim.contar(reloj.querySelector('.pp-reloj__horas'), 0, 48, 2400);
    }));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    const avance = [...panelRaiz.querySelectorAll('.pp-avance li')];
    limpiezas.push(Fx.seguirSeccion(temas, (i) => {
      const n = Math.max(0, i);
      estado.textContent = FASES[Math.min(n, FASES.length - 1)];
      avance.forEach((li, j) => li.classList.toggle('is-hecho', j <= n));
      panelRaiz.dataset.fase = String(n);
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
