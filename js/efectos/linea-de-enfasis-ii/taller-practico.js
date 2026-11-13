/*
 * Efectos de "Taller práctico: Diagnóstico de una pyme".
 *  - Mapa de la empresa lateral: los cinco activos críticos cambian de
 *    color según la parte del taller (atacados, afectados, protegidos).
 *  - Cadena del ataque de phishing del caso.
 *  - Regla de respaldo 3-2-1.
 *  - Acciones gerenciales como lista que se marca al leer, con la
 *    verificación en dos pasos.
 */
(function () {
  'use strict';

  const CLAVE = 'linea-de-enfasis-ii/taller-practico';
  const Fx = window.Fx;

  // Activos del documento, en círculo alrededor de la empresa (viewBox 220 x 200)
  const ACTIVOS = [
    { id: 'bd', nombre: 'Base de datos', x: 110, y: 26 },
    { id: 'factura', nombre: 'Facturación', x: 192, y: 82 },
    { id: 'tienda', nombre: 'Tienda virtual', x: 160, y: 170 },
    { id: 'nube', nombre: 'Nube', x: 60, y: 170 },
    { id: 'wifi', nombre: 'Wi-Fi', x: 28, y: 82 },
  ];

  // Estado de cada activo por tema: n = normal, a = atacado, f = afectado, p = protegido
  const FASES = [
    { titulo: /activos críticos/i, texto: 'Inventario de activos', estado: 'nnnnn' },
    { titulo: /análisis del incidente/i, texto: 'Credenciales robadas', estado: 'nnnan' },
    { titulo: /evaluación del impacto/i, texto: 'Operación afectada', estado: 'fffan' },
    { titulo: /priorización/i, texto: 'Definiendo medidas', estado: 'fffan' },
    { titulo: /toma de decisiones/i, texto: 'Cuentas protegidas', estado: 'ppppp' },
    { titulo: /información general/i, texto: 'Nueva empresa: diagnóstico', estado: 'nnnnn' },
    { titulo: /identificación de problemas/i, texto: 'Cinco fallas encontradas', estado: 'fnnff' },
    { titulo: /^5\.\s*Diagnóstico inicial/i, texto: 'Medidas iniciales propuestas', estado: 'pppfp' },
    { titulo: /conclusiones/i, texto: 'Negocio más protegido', estado: 'ppppp' },
  ];

  const ATAQUE = [
    ['Llega un correo de un supuesto proveedor', false],
    ['Pide actualizar las credenciales', false],
    ['El empleado escribe sus datos en el enlace', true],
    ['Credenciales comprometidas', true],
    ['Accesos inusuales al correo días después', true],
    ['Problemas para consultar los archivos en la nube', true],
  ];

  function panelHtml() {
    const lineas = ACTIVOS.map((a) => `<line x1="110" y1="100" x2="${a.x}" y2="${a.y}" />`).join('');
    const nodos = ACTIVOS.map((a) => `
      <g class="l2-activo" data-activo="${a.id}" transform="translate(${a.x} ${a.y})">
        <circle r="12" /><path class="l2-activo__marca" d="M-4 0 L-1 3 L5 -4" />
        <text y="${a.y > 100 ? 26 : -18}" text-anchor="middle">${a.nombre}</text>
      </g>`).join('');
    return `
      <div class="fx-panel l2-mapa">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Mapa de la empresa</p>
        <p class="fx-panel__estado">Inventario de activos</p>
        <svg class="l2-mapa__svg" viewBox="0 0 220 200" aria-hidden="true">
          <g class="l2-mapa__lineas">${lineas}</g>
          <g class="l2-centro" transform="translate(110 100)"><rect x="-22" y="-14" width="44" height="28" rx="3" /><text y="4" text-anchor="middle">Empresa</text></g>
          ${nodos}
        </svg>
        <ul class="l2-mapa__leyenda"><li data-e="a">atacado</li><li data-e="f">afectado</li><li data-e="p">protegido</li></ul>
      </div>`;
  }

  function ataqueHtml() {
    return `
      <figure class="fx-figura l2-ataque">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Cómo ocurrió</span>De un correo creíble a la nube bloqueada</figcaption>
        <ol class="fx-cadena">${ATAQUE.map(([texto, alerta], i) => `<li style="--i: ${i}"${alerta ? ' class="is-alerta"' : ''}>${texto}</li>`).join('')}</ol>
      </figure>`;
  }

  function respaldoHtml() {
    const copia = (texto, clase) => `<span class="l2-copia ${clase || ''}">${texto}</span>`;
    return `
      <figure class="fx-figura l2-321">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Regla 3-2-1</span>La mejor defensa contra perder los datos</figcaption>
        <div class="l2-321__columnas">
          <div class="l2-321__col" style="--i: 0"><span class="l2-321__n">3</span><span class="l2-321__t">copias de los datos</span><div class="l2-321__iconos">${copia('Original')}${copia('Copia')}${copia('Copia')}</div></div>
          <div class="l2-321__col" style="--i: 1"><span class="l2-321__n">2</span><span class="l2-321__t">medios distintos</span><div class="l2-321__iconos">${copia('Disco')}${copia('Nube')}</div></div>
          <div class="l2-321__col" style="--i: 2"><span class="l2-321__n">1</span><span class="l2-321__t">fuera de línea</span><div class="l2-321__iconos">${copia('Desconectada', 'l2-copia--fuera')}</div></div>
        </div>
        <p class="fx-nota">Y probar la recuperación: una copia que no se prueba no es una copia confiable.</p>
      </figure>`;
  }

  function mfaHtml() {
    return `
      <figure class="fx-figura l2-mfa">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Verificación en dos pasos</span>Aunque roben la contraseña, falta el segundo factor</figcaption>
        <ol class="l2-mfa__pasos">
          <li style="--i: 0"><span class="l2-mfa__caja">••••••••</span>Contraseña</li>
          <li style="--i: 1"><span class="l2-mfa__caja l2-mfa__codigo">482 913</span>Código en el celular</li>
          <li style="--i: 2"><span class="l2-mfa__caja l2-mfa__ok">✓</span>Acceso</li>
        </ol>
      </figure>`;
  }

  function marcarAcciones(prosa) {
    const inicio = Fx.buscarParrafo(prosa, /^Acciones:/);
    if (!inicio) return [];
    const acciones = [];
    let p = inicio.nextElementSibling;
    while (p && p.tagName === 'P' && !/^La prioridad/i.test(p.textContent)) {
      p.classList.add('l2-accion');
      acciones.push(p);
      p = p.nextElementSibling;
    }
    return acciones;
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('l2');

    const t = (patron) => Fx.buscarTitulo(prosa, patron);
    const tablaIncidente = t(/análisis del incidente/i);
    const ataque = Fx.insertarDespues(tablaIncidente, Fx.crear(ataqueHtml()));
    const respaldo = Fx.insertarDespues(t(/priorización/i), Fx.crear(respaldoHtml()), 1);
    const acciones = marcarAcciones(prosa);
    const mfa = acciones.length ? Fx.insertarDespues(acciones[acciones.length - 1], Fx.crear(mfaHtml())) : null;

    limpiezas.push(Fx.activarAlAparecer([ataque, respaldo, mfa]));
    limpiezas.push(Fx.activarAlAparecer(acciones, null, '-30%'));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    // Mapa lateral
    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    const nodos = [...panelRaiz.querySelectorAll('.l2-activo')];
    const fases = FASES.map((f) => ({ ...f, h: t(f.titulo) })).filter((f) => f.h);
    limpiezas.push(Fx.seguirSeccion(fases.map((f) => f.h), (i) => {
      const fase = fases[Math.max(0, i)];
      estado.textContent = fase.texto;
      nodos.forEach((g, j) => { g.dataset.e = fase.estado[j]; });
      const peor = fase.estado.includes('a') ? 'a' : fase.estado.includes('f') ? 'f' : fase.estado.includes('p') ? 'p' : 'n';
      panelRaiz.dataset.e = peor;
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
