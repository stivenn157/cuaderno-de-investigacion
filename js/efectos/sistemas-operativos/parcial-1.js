/*
 * Efectos de "Parcial 1: Caso TecnoGestión".
 *  - Ticket de soporte lateral: su estado avanza con cada punto y los
 *    síntomas se marcan como resueltos al leer las acciones del plan.
 *  - Ventana de facturación "No responde".
 *  - Umbrales de inspección (CPU, disco, tiempos de respuesta).
 *  - Recorrido de una impresión hasta la impresora de red.
 *  - Criterios de cierre tras 72 horas de seguimiento.
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/parcial-1';
  const Fx = window.Fx;

  const ESTADOS = ['Abierto', 'En diagnóstico', 'Inspección de recursos', 'Revisando la impresora', 'Aplicando solución', 'En seguimiento · 72 h'];

  // Síntoma -> párrafo del punto 4 que lo resuelve
  const SINTOMAS = [
    ['Facturación congelada', /No responde/],
    ['RAM casi al límite', /limpieza del arranque/i],
    ['Disco C casi lleno', /respaldo y liberar espacio/i],
    ['Impresora desaparece', /cola de impresión y el puerto/i],
  ];

  const RUTA = [
    ['Documento', 'facturación'],
    ['Controlador', 'traduce a PCL'],
    ['Spooler', 'cola en el disco'],
    ['Red', 'IP por DHCP'],
    ['Impresora', 'puerto TCP/IP'],
  ];

  function panelHtml() {
    const sintomas = SINTOMAS.map(([texto]) => `<li>${texto}</li>`).join('');
    return `
      <div class="fx-panel p1-ticket">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Ticket de soporte</p>
        <p class="p1-ticket__id">TecnoGestión · Equipo de facturación</p>
        <p class="fx-panel__estado">Abierto</p>
        <ol class="p1-ticket__avance" aria-hidden="true">${ESTADOS.map(() => '<li></li>').join('')}</ol>
        <p class="fx-panel__sub">Síntomas reportados</p>
        <ul class="fx-lista p1-ticket__sintomas">${sintomas}</ul>
      </div>`;
  }

  function ventanaHtml() {
    const filas = Array.from({ length: 4 }, (_, i) => `<span style="--i: ${i}"></span>`).join('');
    return `
      <figure class="fx-figura p1-ventana">
        <div class="p1-ventana__barra">
          <span class="p1-ventana__titulo">Facturación TecnoGestión <span class="p1-ventana__nr">(No responde)</span></span>
          <span class="p1-ventana__botones" aria-hidden="true"><i></i><i></i><i></i></span>
        </div>
        <div class="p1-ventana__cuerpo" aria-hidden="true">
          <div class="p1-ventana__filas">${filas}</div>
          <span class="p1-ventana__espera"></span>
        </div>
        <figcaption class="fx-nota">Lo que ve el usuario. Debajo, el sistema operativo está sin recursos.</figcaption>
      </figure>`;
  }

  function umbralesHtml() {
    const datos = [
      ['CPU', 'más del 85–90 %', 'sostenido', 0.88],
      ['Disco C libre', 'menos del 10 %', 'sin margen', 0.1],
      ['Respuesta del disco', 'más de 50–100 ms', 'saturado', 0.75],
    ];
    const tarjetas = datos.map(([nombre, limite, nota, valor], i) => `
      <li class="p1-umbral" style="--i: ${i}; --valor: ${valor}">
        <span class="p1-umbral__nombre">${nombre}</span>
        <span class="p1-umbral__limite">${limite}</span>
        <span class="fx-barra"><span></span></span>
        <span class="p1-umbral__nota">${nota}</span>
      </li>`).join('');
    return `
      <figure class="fx-figura p1-umbrales">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Monitor de recursos · resmon</span>Señales de que el equipo está saturado</figcaption>
        <ul class="p1-umbrales__lista">${tarjetas}</ul>
      </figure>`;
  }

  function rutaHtml() {
    const nodos = RUTA.map(([nombre, detalle], i) => `
      <li class="p1-nodo${i === 3 ? ' p1-nodo--falla' : ''}" style="--i: ${i}"><span class="p1-nodo__nombre">${nombre}</span><span class="p1-nodo__detalle">${detalle}</span></li>`).join('');
    return `
      <figure class="fx-figura p1-ruta">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Recorrido de una impresión</span>Si la IP cambia tras el reinicio, el trabajo se pierde en el camino</figcaption>
        <div class="p1-ruta__via"><ol class="p1-ruta__nodos">${nodos}</ol><span class="p1-ruta__trabajo" aria-hidden="true"></span></div>
        <p class="fx-nota">Prueba rápida: un ping a la IP de la impresora desde la consola.</p>
      </figure>`;
  }

  function cierreHtml() {
    const criterios = ['RAM por debajo del 80 %', 'Cola de disco menor a 1.0', 'Disco C con más del 20 % libre'];
    return `
      <figure class="fx-figura p1-cierre">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Criterios de cierre</span>Prueba de carga durante el seguimiento</figcaption>
        <div class="p1-cierre__cuerpo">
          <p class="p1-cierre__horas"><span class="p1-cierre__n">0</span><span>horas de seguimiento</span></p>
          <ul class="p1-cierre__lista">${criterios.map((c, i) => `<li style="--i: ${i}">${c}</li>`).join('')}</ul>
        </div>
      </figure>`;
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('p1');
    Fx.realzarComandos(prosa);

    const puntos = Fx.titulos(prosa);
    const [h1, h2, h3, h4, h5] = puntos;

    const ventana = Fx.crear(ventanaHtml());
    Fx.insertarDespues(Fx.buscarParrafo(prosa, /se queda congelado/i) || h1, ventana);

    const umbrales = Fx.crear(umbralesHtml());
    Fx.insertarDespues(Fx.buscarParrafo(prosa, /85% o 90%/) || h2, umbrales);

    const ruta = Fx.crear(rutaHtml());
    Fx.insertarDespues(h3, ruta, 1);

    const cierre = Fx.crear(cierreHtml());
    const pCierre = Fx.buscarParrafo(prosa, /seguimiento de 72 horas/i);
    if (pCierre) pCierre.after(cierre);

    // Panel
    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    const avance = [...panelRaiz.querySelectorAll('.p1-ticket__avance li')];
    const sintomas = [...panelRaiz.querySelectorAll('.p1-ticket__sintomas li')];

    limpiezas.push(Fx.seguirSeccion([h1, h2, h3, h4, h5].filter(Boolean), (i) => {
      const n = Math.max(0, i + 1);
      estado.textContent = ESTADOS[Math.min(n, ESTADOS.length - 1)];
      avance.forEach((li, j) => li.classList.toggle('is-hecho', j <= n));
      panelRaiz.classList.toggle('is-resuelto', n >= 5);
    }));

    const soluciones = SINTOMAS.map(([, patron]) => Fx.buscarParrafo(prosa, patron, h4));
    limpiezas.push(Fx.alAparecer(soluciones.filter(Boolean), (p) => {
      const n = soluciones.indexOf(p);
      if (sintomas[n]) sintomas[n].classList.add('is-hecho');
    }, { rootMargin: '0px 0px -40% 0px' }));

    limpiezas.push(Fx.activarAlAparecer([ventana, umbrales, ruta, cierre], (el) => {
      if (el === cierre) anim.contar(cierre.querySelector('.p1-cierre__n'), 0, 72, 2200);
      if (el === ruta) {
        const via = ruta.querySelector('.p1-ruta__via');
        via.style.setProperty('--ancho-via', `${via.offsetWidth}px`);
      }
    }));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
