/*
 * Efectos de "Taller teórico: Procesos y sincronización".
 *  - Diagrama de estados lateral: una ficha se mueve al estado del tema actual.
 *  - Vida del proceso de facturación paso a paso.
 *  - Diagrama de Gantt interactivo FCFS frente a SJF.
 *  - Condición de carrera en la cuenta bancaria (con y sin candado).
 *  - La silla G-15 del cine como sección crítica.
 *  - Semáforo binario y semáforo contador funcionando.
 *  - Interbloqueo y las cuatro condiciones de Coffman.
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/taller-teorico';
  const Fx = window.Fx;

  // Posición de cada estado en el diagrama lateral (viewBox 240 x 190)
  const ESTADOS = {
    nuevo: { nombre: 'Nuevo', x: 30, y: 40 },
    listo: { nombre: 'Listo', x: 95, y: 40 },
    ejecucion: { nombre: 'En ejecución', x: 170, y: 40 },
    bloqueado: { nombre: 'Bloqueado', x: 132, y: 140 },
    terminado: { nombre: 'Terminado', x: 215, y: 140 },
  };
  // Estado que ilustra cada uno de los diez temas del documento
  const ESTADO_POR_TEMA = ['nuevo', 'listo', 'ejecucion', 'listo', 'ejecucion', 'bloqueado', 'bloqueado', 'ejecucion', 'listo', 'terminado', 'terminado'];

  const VIDA = [
    ['Doble clic al icono', 'Nuevo'],
    ['Hace fila por la CPU', 'Listo'],
    ['El planificador le da turno', 'En ejecución'],
    ['Guarda la factura en PDF (E/S)', 'Bloqueado'],
    ['El disco termina de grabar', 'Listo'],
    ['Se cierra la ventana', 'Terminado'],
  ];

  // Ejemplo ilustrativo: cinco procesos del servidor en orden de llegada (unidades de CPU)
  const TRABAJOS = [
    ['Balance contable', 8],
    ['Revisar clave', 1],
    ['Comprimir backup', 6],
    ['Precio de artículo', 1],
    ['Reporte de ventas', 3],
  ];

  const CARRERA = {
    // Mismo orden que el documento: la operación 1 pierde la CPU y escribe de última
    sin: [
      ['Op. 1', 'lee el saldo y pierde la CPU', '100.000'],
      ['Op. 2', 'lee el saldo', '100.000'],
      ['Op. 2', 'calcula 100.000 + 50.000', '150.000'],
      ['Op. 2', 'escribe', '150.000'],
      ['Op. 1', 'calcula 100.000 − 20.000', '80.000'],
      ['Op. 1', 'escribe encima', '80.000'],
    ],
    con: [
      ['Op. 1', 'toma el candado y lee', '100.000'],
      ['Op. 1', 'calcula 100.000 − 20.000', '80.000'],
      ['Op. 1', 'escribe y suelta el candado', '80.000'],
      ['Op. 2', 'toma el candado y lee', '80.000'],
      ['Op. 2', 'calcula 80.000 + 50.000', '130.000'],
      ['Op. 2', 'escribe y suelta el candado', '130.000'],
    ],
  };

  /* ---------- Panel: diagrama de estados ---------- */

  function panelHtml() {
    const nodos = Object.entries(ESTADOS).map(([clave, e]) => `
      <g class="tt-estado" data-estado="${clave}" transform="translate(${e.x} ${e.y})">
        <circle r="17" />
        <text y="34" text-anchor="middle">${e.nombre}</text>
      </g>`).join('');
    return `
      <div class="fx-panel tt-panel">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Estados del proceso</p>
        <p class="fx-panel__estado">Nuevo</p>
        <svg class="tt-diagrama" viewBox="0 0 240 190" aria-hidden="true">
          <defs><marker id="tt-flecha" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 Z" /></marker></defs>
          <path class="tt-arista" d="M48 40 H76" marker-end="url(#tt-flecha)" />
          <path class="tt-arista" d="M113 34 H151" marker-end="url(#tt-flecha)" />
          <path class="tt-arista" d="M151 48 H113" marker-end="url(#tt-flecha)" />
          <path class="tt-arista" d="M163 56 L140 123" marker-end="url(#tt-flecha)" />
          <path class="tt-arista" d="M124 124 L102 57" marker-end="url(#tt-flecha)" />
          <path class="tt-arista" d="M180 55 L205 124" marker-end="url(#tt-flecha)" />
          ${nodos}
          <circle class="tt-ficha" r="6" />
        </svg>
        <p class="fx-nota">La ficha muestra el estado que explica cada tema.</p>
      </div>`;
  }

  /* ---------- Figuras ---------- */

  function vidaHtml() {
    const pasos = VIDA.map(([accion, estado], i) => `<li style="--i: ${i}"${estado === 'Bloqueado' ? ' class="is-alerta"' : ''}><strong>${estado}</strong><br>${accion}</li>`).join('');
    return `
      <figure class="fx-figura tt-vida">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Ejemplo del documento</span>La vida del proceso de facturación</figcaption>
        <ol class="fx-cadena">${pasos}</ol>
      </figure>`;
  }

  function ganttHtml() {
    return `
      <figure class="fx-figura tt-gantt" data-algoritmo="fcfs">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Diagrama de Gantt · ejemplo ilustrativo</span>Los mismos cinco procesos, dos formas de hacer fila</figcaption>
        <div class="tt-gantt__botones" role="group" aria-label="Algoritmo">
          <button type="button" class="fx-boton" data-algoritmo="fcfs" aria-pressed="true">FCFS</button>
          <button type="button" class="fx-boton" data-algoritmo="sjf" aria-pressed="false">SJF</button>
        </div>
        <ol class="tt-gantt__filas"></ol>
        <p class="tt-gantt__promedio">Espera promedio: <strong>0</strong> unidades</p>
        <p class="fx-nota">Tiempos de CPU inventados para comparar; el orden de llegada es el mismo en ambos.</p>
      </figure>`;
  }

  function carreraHtml() {
    return `
      <figure class="fx-figura tt-carrera" data-modo="sin">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Condición de carrera</span>Saldo inicial 100.000 · retiro de 20.000 · consignación de 50.000</figcaption>
        <div class="tt-gantt__botones" role="group" aria-label="Modo">
          <button type="button" class="fx-boton" data-modo="sin" aria-pressed="true">Sin candado</button>
          <button type="button" class="fx-boton" data-modo="con" aria-pressed="false">Con candado</button>
        </div>
        <ol class="tt-carrera__pasos"></ol>
        <p class="tt-carrera__final">Saldo final: <strong>—</strong></p>
      </figure>`;
  }

  function sillasHtml() {
    const sillas = Array.from({ length: 10 }, (_, i) => {
      const n = 10 + i;
      return `<span class="tt-silla${n === 15 ? ' tt-silla--libre' : ''}">G-${n}</span>`;
    }).join('');
    return `
      <figure class="fx-figura tt-sillas">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Sección crítica</span>Dos compradores, una sola silla libre</figcaption>
        <div class="tt-sillas__fila">${sillas}</div>
        <ul class="tt-sillas__compradores">
          <li class="tt-comprador" data-p="1">Proceso 1 <span>pide la G-15…</span></li>
          <li class="tt-comprador" data-p="2">Proceso 2 <span>pide la G-15…</span></li>
        </ul>
      </figure>`;
  }

  function semaforosHtml() {
    return `
      <figure class="fx-figura tt-semaforos">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Semáforos</span>Binario para una impresora, contador para un grupo de conexiones</figcaption>
        <div class="tt-semaforos__par">
          <div class="tt-sem tt-sem--binario">
            <div class="tt-luz" aria-hidden="true"><span class="tt-luz__roja"></span><span class="tt-luz__verde"></span></div>
            <p class="tt-sem__valor">S = <strong>1</strong></p>
            <p class="tt-sem__texto">Impresora de etiquetas libre</p>
          </div>
          <div class="tt-sem tt-sem--contador">
            <div class="tt-fichas" aria-hidden="true"><span></span><span></span><span></span></div>
            <p class="tt-sem__valor">S = <strong>3</strong></p>
            <p class="tt-sem__texto">Conexiones disponibles (ejemplo con 3)</p>
          </div>
        </div>
      </figure>`;
  }

  function bloqueoHtml() {
    const reglas = ['Exclusión mutua', 'Retener y esperar', 'Sin expropiación', 'Espera circular'];
    return `
      <figure class="fx-figura tt-bloqueo">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Interbloqueo</span>Cada proceso tiene lo que el otro necesita</figcaption>
        <svg class="tt-bloqueo__ciclo" viewBox="0 0 300 150" role="img" aria-label="Proceso A tiene la tabla 1 y espera la tabla 2; proceso B tiene la tabla 2 y espera la tabla 1.">
          <g class="tt-b-nodo tt-b-nodo--p" transform="translate(60 40)"><rect x="-44" y="-18" width="88" height="36" rx="18" /><text y="5" text-anchor="middle">Proceso A</text></g>
          <g class="tt-b-nodo tt-b-nodo--p" transform="translate(240 110)"><rect x="-44" y="-18" width="88" height="36" rx="18" /><text y="5" text-anchor="middle">Proceso B</text></g>
          <g class="tt-b-nodo" transform="translate(240 40)"><rect x="-40" y="-18" width="80" height="36" rx="4" /><text y="5" text-anchor="middle">Tabla 2</text></g>
          <g class="tt-b-nodo" transform="translate(60 110)"><rect x="-40" y="-18" width="80" height="36" rx="4" /><text y="5" text-anchor="middle">Tabla 1</text></g>
          <path class="tt-b-arco" pathLength="1" d="M104 40 H198" /><text class="tt-b-rotulo" x="150" y="30" text-anchor="middle">espera</text>
          <path class="tt-b-arco" pathLength="1" d="M240 58 V90" /><text class="tt-b-rotulo" x="250" y="78">tiene</text>
          <path class="tt-b-arco" pathLength="1" d="M196 110 H102" /><text class="tt-b-rotulo" x="150" y="128" text-anchor="middle">espera</text>
          <path class="tt-b-arco" pathLength="1" d="M60 92 V60" /><text class="tt-b-rotulo" x="20" y="80">tiene</text>
        </svg>
        <ul class="tt-bloqueo__reglas">${reglas.map((r, i) => `<li style="--i: ${i}">${r}</li>`).join('')}</ul>
      </figure>`;
  }

  /* ---------- Comportamiento ---------- */

  function dibujarGantt(figura, algoritmo) {
    const orden = algoritmo === 'sjf'
      ? [...TRABAJOS].map((t, i) => [...t, i]).sort((a, b) => a[1] - b[1] || a[2] - b[2])
      : TRABAJOS.map((t, i) => [...t, i]);
    const total = TRABAJOS.reduce((s, t) => s + t[1], 0);
    let reloj = 0;
    let esperas = 0;
    const filas = orden.map(([nombre, duracion], i) => {
      const inicio = reloj;
      esperas += inicio;
      reloj += duracion;
      return `<li style="--i: ${i}; --inicio: ${inicio / total}; --largo: ${duracion / total}">
        <span class="tt-gantt__nombre">${nombre}</span>
        <span class="tt-gantt__pista"><span class="tt-gantt__barra">${duracion}</span></span>
        <span class="tt-gantt__espera">espera ${inicio}</span>
      </li>`;
    }).join('');
    figura.querySelector('.tt-gantt__filas').innerHTML = filas;
    figura.querySelector('.tt-gantt__promedio strong').textContent = (esperas / orden.length).toLocaleString('es-CO', { maximumFractionDigits: 1 });
    figura.dataset.algoritmo = algoritmo;
  }

  function correrCarrera(figura, modo, anim) {
    const lista = figura.querySelector('.tt-carrera__pasos');
    const final = figura.querySelector('.tt-carrera__final strong');
    lista.innerHTML = CARRERA[modo].map(([op, accion, valor], i) => `
      <li class="tt-paso" data-op="${op === 'Op. 1' ? 1 : 2}" style="--i: ${i}"><span class="tt-paso__op">${op}</span>${accion}<span class="tt-paso__valor">${valor}</span></li>`).join('');
    final.textContent = '—';
    figura.dataset.modo = modo;
    figura.classList.remove('is-mal', 'is-bien');
    const pasos = [...lista.children];
    const turno = Number(figura.dataset.turno || 0) + 1;
    figura.dataset.turno = String(turno);
    const vigente = () => figura.dataset.turno === String(turno);
    anim.secuencia([
      ...pasos.map((p) => [550, () => p.classList.add('is-hecho')]),
      [500, () => {
        if (!vigente()) return;
        final.textContent = modo === 'sin' ? '80.000 · debían quedar 130.000 (se perdió la consignación)' : '130.000 · correcto';
        figura.classList.add(modo === 'sin' ? 'is-mal' : 'is-bien');
      }],
    ]);
  }

  function correrSillas(figura, anim) {
    const libre = figura.querySelector('.tt-silla--libre');
    const [p1, p2] = figura.querySelectorAll('.tt-comprador');
    anim.secuencia([
      [400, () => { p1.classList.add('is-pide'); p2.classList.add('is-pide'); libre.classList.add('is-disputada'); }],
      [1100, () => { libre.classList.add('is-candado'); p1.querySelector('span').textContent = 'toma el candado'; p2.querySelector('span').textContent = 'espera…'; }],
      [1000, () => { libre.classList.add('is-ocupada'); p1.querySelector('span').textContent = 'boleta emitida'; p1.classList.add('is-gana'); }],
      [800, () => { p2.querySelector('span').textContent = 'la silla ya no está libre'; p2.classList.add('is-pierde'); }],
    ]);
  }

  function correrSemaforos(figura, anim) {
    const binario = figura.querySelector('.tt-sem--binario');
    const contador = figura.querySelector('.tt-sem--contador');
    const fichas = [...contador.querySelectorAll('.tt-fichas span')];
    let ocupado = false;
    let libres = 3;
    let bajando = true;
    const ciclo = () => {
      ocupado = !ocupado;
      binario.classList.toggle('is-ocupado', ocupado);
      binario.querySelector('strong').textContent = ocupado ? '0' : '1';
      binario.querySelector('.tt-sem__texto').textContent = ocupado ? 'Proceso A imprime · B espera' : 'Impresora de etiquetas libre';
      libres += bajando ? -1 : 1;
      if (libres <= 0) bajando = false;
      if (libres >= 3) bajando = true;
      fichas.forEach((f, i) => f.classList.toggle('is-usada', i >= libres));
      contador.querySelector('strong').textContent = String(libres);
    };
    ciclo();
    anim.repetir(1500, ciclo);
  }

  function enlazarBotones(figura, atributo, alElegir) {
    figura.querySelectorAll(`button[data-${atributo}]`).forEach((boton) => {
      boton.addEventListener('click', () => {
        figura.querySelectorAll(`button[data-${atributo}]`).forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
        alElegir(boton.dataset[atributo]);
      });
    });
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('tt');

    const t = (patron) => Fx.buscarTitulo(prosa, patron);
    const vida = Fx.insertarDespues(t(/^3\./), Fx.crear(vidaHtml()), 2);
    const gantt = Fx.insertarDespues(t(/^5\./), Fx.crear(ganttHtml()), 1);
    const carrera = Fx.insertarDespues(t(/^7\./), Fx.crear(carreraHtml()), 1);
    const sillas = Fx.insertarDespues(t(/^8\./), Fx.crear(sillasHtml()), 1);
    const semaforos = Fx.insertarDespues(t(/^9\./), Fx.crear(semaforosHtml()), 2);
    const bloqueo = Fx.insertarDespues(t(/^10\./), Fx.crear(bloqueoHtml()), 1);

    if (gantt) {
      dibujarGantt(gantt, 'fcfs');
      enlazarBotones(gantt, 'algoritmo', (alg) => dibujarGantt(gantt, alg));
    }
    if (carrera) enlazarBotones(carrera, 'modo', (modo) => correrCarrera(carrera, modo, anim));

    limpiezas.push(Fx.activarAlAparecer([vida, gantt, carrera, sillas, semaforos, bloqueo], (el) => {
      if (el === carrera) correrCarrera(carrera, 'sin', anim);
      if (el === sillas) correrSillas(sillas, anim);
      if (el === semaforos) correrSemaforos(semaforos, anim);
    }));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    // Panel de estados
    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const ficha = panelRaiz.querySelector('.tt-ficha');
    const estadoTexto = panelRaiz.querySelector('.fx-panel__estado');
    limpiezas.push(Fx.seguirSeccion(Fx.titulos(prosa), (i) => {
      const clave = ESTADO_POR_TEMA[Math.min(Math.max(i, 0), ESTADO_POR_TEMA.length - 1)];
      const e = ESTADOS[clave];
      ficha.style.transform = `translate(${e.x}px, ${e.y}px)`;
      estadoTexto.textContent = e.nombre;
      panelRaiz.querySelectorAll('.tt-estado').forEach((g) => g.classList.toggle('is-actual', g.dataset.estado === clave));
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
