/*
 * Efectos de "Taller práctico: Hardware y rendimiento".
 *  - Pistas de circuito en los bordes que se encienden con el avance de la lectura.
 *  - Ficha técnica lateral: un componente por cada tema.
 *  - 8 núcleos y 16 hilos: un solo hilo frente a un render multihilo.
 *  - 8 GB de RAM que no alcanzan (y la diferencia con 32 GB).
 *  - Generaciones DDR3, DDR4 y DDR5 con su muesca, pines, voltaje y velocidad.
 *  - Bus estrecho frente a bus ancho.
 *  - Memoria compartida de gráficos integrados frente a VRAM dedicada.
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/taller-practico';
  const Fx = window.Fx;

  const FICHA = ['Núcleos e hilos', 'Kernel y procesos', 'Memoria RAM', 'Generaciones DDR', 'Buses', 'Gráficos', 'CPU frente a GPU', 'RAM compartida y VRAM', 'Compatibilidad', 'Diagnóstico integral'];

  const DDR = [
    { nombre: 'DDR3', pines: 240, voltaje: '1,5 V', min: 800, max: 2133, muesca: 0.47 },
    { nombre: 'DDR4', pines: 288, voltaje: '1,2 V', min: 2133, max: 3200, muesca: 0.51 },
    { nombre: 'DDR5', pines: 288, voltaje: '1,1 V', min: 4800, max: 7000, muesca: 0.535 },
  ];
  const MAX_MTS = 7200;

  // Reparto ilustrativo de los 8 GB del diseñador
  const RAM = [
    ['Sistema', 2.5],
    ['Gráficos integrados', 1],
    ['Modelo 3D', 3],
    ['Editor de video', 2.5],
    ['Navegador', 1.5],
  ];

  /* ---------- Plantillas ---------- */

  function circuitoHtml(lado) {
    const caminos = [
      'M20 0 V180 H60 V420 H30 V700 H70 V1000',
      'M50 0 V120 H90 V360 H55 V620 H100 V1000',
      'M85 0 V260 H40 V520 H85 V800 H45 V1000',
    ];
    const nodos = [[60, 180], [90, 360], [40, 520], [30, 700], [100, 620], [85, 800]];
    return `
      <svg class="tp-circuito tp-circuito--${lado}" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true">
        ${caminos.map((d) => `<path class="tp-circuito__base" d="${d}" /><path class="tp-circuito__luz" pathLength="1" d="${d}" />`).join('')}
        ${nodos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" />`).join('')}
      </svg>`;
  }

  function panelHtml() {
    return `
      <div class="fx-panel tp-ficha">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Ficha técnica</p>
        <p class="fx-panel__estado">Revisando el equipo</p>
        <ol class="fx-lista">${FICHA.map((f) => `<li>${f}</li>`).join('')}</ol>
      </div>`;
  }

  function nucleosHtml() {
    const nucleos = Array.from({ length: 8 }, (_, i) => `
      <div class="tp-nucleo" style="--i: ${i}"><span class="tp-nucleo__n">Núcleo ${i + 1}</span><span class="tp-hilo"></span><span class="tp-hilo"></span></div>`).join('');
    return `
      <figure class="fx-figura tp-nucleos" data-modo="uno">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">8 núcleos · 16 hilos</span>No es cuántos núcleos hay, sino cuántos usa el programa</figcaption>
        <div class="tt-gantt__botones" role="group" aria-label="Tipo de tarea">
          <button type="button" class="fx-boton" data-modo="uno" aria-pressed="true">Mover mallas (un hilo)</button>
          <button type="button" class="fx-boton" data-modo="todos" aria-pressed="false">Render final</button>
        </div>
        <div class="tp-nucleos__rejilla">${nucleos}</div>
        <p class="fx-nota tp-nucleos__estado">Un núcleo al 100 % mientras los otros siete esperan.</p>
      </figure>`;
  }

  function ramHtml() {
    const bloques = RAM.map(([nombre, gb], i) => `<span class="tp-ram__bloque" style="--i: ${i}; --gb: ${gb}" title="${nombre}"><span>${nombre}</span></span>`).join('');
    return `
      <figure class="fx-figura tp-ram" data-ram="8">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Reparto ilustrativo</span>Lo que el diseñador abre no cabe en 8 GB</figcaption>
        <div class="tt-gantt__botones" role="group" aria-label="Memoria instalada">
          <button type="button" class="fx-boton" data-ram="8" aria-pressed="true">8 GB</button>
          <button type="button" class="fx-boton" data-ram="32" aria-pressed="false">32 GB</button>
        </div>
        <div class="tp-ram__barra"><div class="tp-ram__uso">${bloques}</div><span class="tp-ram__limite"></span></div>
        <p class="tp-ram__estado fx-nota">10,5 GB pedidos en 8 GB: 2,5 GB se van al disco como memoria virtual.</p>
      </figure>`;
  }

  function ddrHtml() {
    const modulos = DDR.map((m, i) => `
      <div class="tp-ddr" style="--i: ${i}; --muesca: ${m.muesca}; --min: ${m.min / MAX_MTS}; --max: ${m.max / MAX_MTS}">
        <svg class="tp-ddr__modulo" viewBox="0 0 200 44" aria-hidden="true">
          <rect class="tp-ddr__placa" x="0" y="0" width="200" height="36" rx="2" />
          ${[0, 1, 2, 3, 4, 5, 6, 7].map((c) => `<rect class="tp-ddr__chip" x="${10 + c * 23}" y="7" width="18" height="16" rx="1" />`).join('')}
          <rect class="tp-ddr__pines" x="2" y="36" width="196" height="8" />
          <rect class="tp-ddr__corte" x="${m.muesca * 200 - 2.5}" y="34" width="5" height="10" />
        </svg>
        <div class="tp-ddr__datos">
          <span class="tp-ddr__nombre">${m.nombre}</span>
          <span>${m.pines} pines · ${m.voltaje}</span>
          <span class="tp-ddr__rango"><span></span></span>
          <span class="tp-ddr__mts">${m.min.toLocaleString('es-CO')}–${m.max.toLocaleString('es-CO')}${m.nombre === 'DDR5' ? '+' : ''} MT/s</span>
        </div>
      </div>`).join('');
    return `
      <figure class="fx-figura tp-ddrs">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Generaciones de memoria</span>La muesca cambia de sitio para que no se puedan mezclar</figcaption>
        ${modulos}
      </figure>`;
  }

  function busHtml() {
    const cajas = (n) => Array.from({ length: n }, (_, i) => `<span style="--i: ${i}"></span>`).join('');
    return `
      <figure class="fx-figura tp-bus">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Buses de transferencia</span>La CPU es el motor, la RAM la bodega y el bus la avenida</figcaption>
        <div class="tp-bus__via tp-bus__via--estrecha"><span class="tp-bus__rotulo">Un carril lento</span><div class="tp-bus__carril">${cajas(3)}</div></div>
        <div class="tp-bus__via tp-bus__via--ancha"><span class="tp-bus__rotulo">Varios carriles rápidos</span>
          <div class="tp-bus__carril">${cajas(5)}</div><div class="tp-bus__carril">${cajas(5)}</div><div class="tp-bus__carril">${cajas(5)}</div>
        </div>
      </figure>`;
  }

  function vramHtml() {
    return `
      <figure class="fx-figura tp-vram">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Memoria de video</span>Pedir prestado frente a tener memoria propia</figcaption>
        <div class="tp-vram__fila">
          <span class="tp-vram__rotulo">Gráficos integrados<br><small>16 GB compartidos</small></span>
          <div class="tp-vram__barra"><span class="tp-vram__fijo"></span><span class="tp-vram__dinamico"></span></div>
        </div>
        <div class="tp-vram__fila">
          <span class="tp-vram__rotulo">Tarjeta dedicada<br><small>16 GB RAM + 8 GB VRAM</small></span>
          <div class="tp-vram__doble"><div class="tp-vram__barra tp-vram__barra--libre"></div><div class="tp-vram__barra tp-vram__barra--vram"><span></span></div></div>
        </div>
        <p class="fx-nota">Los integrados apartan un bloque fijo (512 MB a 1 GB) y toman más RAM a medida que el programa lo pide.</p>
      </figure>`;
  }

  /* ---------- Comportamiento ---------- */

  function enlazar(figura, atributo, alElegir) {
    figura.querySelectorAll(`button[data-${atributo}]`).forEach((boton) => {
      boton.addEventListener('click', () => {
        figura.querySelectorAll(`button[data-${atributo}]`).forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
        figura.dataset[atributo] = boton.dataset[atributo];
        alElegir(boton.dataset[atributo]);
      });
    });
  }

  function seguirAvance(raiz, prosa) {
    let pendiente = false;
    const actualizar = () => {
      pendiente = false;
      const total = prosa.offsetHeight - window.innerHeight * 0.5;
      const avance = Math.min(1, Math.max(0, (window.scrollY - prosa.offsetTop + window.innerHeight * 0.5) / total));
      raiz.style.setProperty('--avance', avance.toFixed(3));
    };
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    actualizar();
    return () => window.removeEventListener('scroll', alDesplazar);
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('tp');

    raiz.append(Fx.crear(circuitoHtml('izq')), Fx.crear(circuitoHtml('der')));
    limpiezas.push(seguirAvance(raiz, prosa));

    const t = (patron) => Fx.buscarTitulo(prosa, patron);
    const nucleos = Fx.insertarDespues(t(/^1\./), Fx.crear(nucleosHtml()), 1);
    const ram = Fx.insertarDespues(t(/^3\./), Fx.crear(ramHtml()), 1);
    const ddr = Fx.insertarDespues(t(/^4\./), Fx.crear(ddrHtml()), 2);
    const bus = Fx.insertarDespues(t(/^5\./), Fx.crear(busHtml()), 1);
    const vram = Fx.insertarDespues(t(/^8\./), Fx.crear(vramHtml()), 1);

    if (nucleos) {
      enlazar(nucleos, 'modo', (modo) => {
        nucleos.querySelector('.tp-nucleos__estado').textContent = modo === 'uno'
          ? 'Un núcleo al 100 % mientras los otros siete esperan.'
          : 'Los 8 núcleos y sus 16 hilos trabajan a la vez.';
      });
    }
    if (ram) {
      enlazar(ram, 'ram', (gb) => {
        ram.querySelector('.tp-ram__estado').textContent = gb === '8'
          ? '10,5 GB pedidos en 8 GB: 2,5 GB se van al disco como memoria virtual.'
          : 'Con 32 GB todo cabe en RAM y sobra espacio.';
      });
    }

    limpiezas.push(Fx.activarAlAparecer([nucleos, ram, ddr, bus, vram]));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const items = [...panelRaiz.querySelectorAll('.fx-lista li')];
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    limpiezas.push(Fx.seguirSeccion(Fx.titulos(prosa), (i) => {
      items.forEach((li, j) => {
        li.classList.toggle('is-hecho', j < i);
        li.classList.toggle('is-actual', j === i);
      });
      estado.textContent = i >= FICHA.length ? 'Diagnóstico completo' : (FICHA[i] || 'Revisando el equipo');
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
