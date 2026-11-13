/*
 * Efectos de "Actividad práctica: Diagnóstico de un equipo lento".
 *  - Administrador de tareas lateral: CPU 90 %, RAM 97 % y disco 100 % que
 *    bajan a medida que se leen las cinco acciones de solución.
 *  - Lista de procesos con los consumos reales del caso.
 *  - Esquema de RAM y memoria virtual.
 *  - Pasos, acciones y plan preventivo con casillas que se marcan al leer.
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/actividad-practica';
  const Fx = window.Fx;

  // Valores del caso (inicio) y valores ilustrativos tras cada acción
  const ESTADOS = [
    { cpu: 90, ram: 97, disco: 100, procesos: 91, texto: 'Equipo al límite' },
    { cpu: 60, ram: 70, disco: 65, procesos: 91, texto: 'Acción 1 aplicada' },
    { cpu: 48, ram: 62, disco: 45, procesos: 72, texto: 'Acción 2 aplicada' },
    { cpu: 40, ram: 57, disco: 32, procesos: 66, texto: 'Acción 3 aplicada' },
    { cpu: 34, ram: 52, disco: 20, procesos: 66, texto: 'Acción 4 aplicada' },
    { cpu: 30, ram: 50, disco: 15, procesos: 66, texto: 'Equipo estable' },
  ];

  const PROCESOS = [
    ['MATLAB R2019b', 30.2, true],
    ['Chrome', 13.5, false],
    ['Spotify', 7.9, true],
    ['Edge', 6.9, true],
  ];

  function color(valor) {
    if (valor >= 85) return 'var(--fx-rojo)';
    if (valor >= 60) return 'var(--fx-ambar)';
    return 'var(--fx-verde)';
  }

  function medidorHtml(nombre, clave) {
    return `
      <div class="fx-medidor" data-medidor="${clave}">
        <div class="fx-medidor__fila"><span>${nombre}</span><span class="fx-medidor__valor">0 %</span></div>
        <div class="fx-barra"><span></span></div>
      </div>`;
  }

  function panelHtml() {
    return `
      <div class="fx-panel ap-monitor">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Administrador de tareas</p>
        <p class="fx-panel__estado">Equipo al límite</p>
        ${medidorHtml('CPU', 'cpu')}
        ${medidorHtml('Memoria', 'ram')}
        ${medidorHtml('Disco', 'disco')}
        <p class="fx-panel__sub">Procesos en segundo plano</p>
        <p class="ap-monitor__procesos"><span class="ap-monitor__n">91</span></p>
        <p class="fx-nota">Inicio: valores del caso. Después: estimación tras cada acción.</p>
      </div>`;
  }

  function procesosHtml() {
    const max = PROCESOS[0][1];
    const filas = PROCESOS.map(([nombre, uso, cerrar], i) => `
      <li class="ap-proceso${cerrar ? ' ap-proceso--cerrar' : ''}" style="--i: ${i}; --uso: ${uso / max}">
        <span class="ap-proceso__nombre">${nombre}</span>
        <span class="ap-proceso__barra"><span></span></span>
        <span class="ap-proceso__uso">${uso.toLocaleString('es-CO')} %</span>
      </li>`).join('');
    return `
      <figure class="fx-figura ap-procesos">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Procesos · ordenados por memoria</span>Lo que estaba llenando la RAM al 97 %</figcaption>
        <ol class="ap-procesos__lista">${filas}</ol>
        <p class="fx-nota ap-procesos__nota">7 aplicaciones abiertas · 91 procesos en segundo plano</p>
      </figure>`;
  }

  function virtualHtml() {
    const paginas = Array.from({ length: 6 }, (_, i) => `<span style="--i: ${i}"></span>`).join('');
    return `
      <figure class="fx-figura ap-virtual">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Memoria virtual</span>Cuando la RAM se llena, Windows presta un pedazo del disco</figcaption>
        <div class="ap-virtual__esquema">
          <div class="ap-virtual__caja"><span class="ap-virtual__nombre">RAM</span><span class="ap-virtual__dato">rápida</span><div class="ap-virtual__paginas">${paginas}</div></div>
          <div class="ap-virtual__flecha" aria-hidden="true"><span></span></div>
          <div class="ap-virtual__caja ap-virtual__caja--disco"><span class="ap-virtual__nombre">Disco</span><span class="ap-virtual__dato">archivo de paginación · lento</span><div class="ap-virtual__paginas ap-virtual__paginas--disco">${paginas}</div></div>
        </div>
      </figure>`;
  }

  function aplicar(panelRaiz, estado) {
    panelRaiz.querySelector('.fx-panel__estado').textContent = estado.texto;
    ['cpu', 'ram', 'disco'].forEach((clave) => {
      const medidor = panelRaiz.querySelector(`[data-medidor="${clave}"]`);
      const valor = estado[clave];
      medidor.querySelector('.fx-medidor__valor').textContent = `${valor} %`;
      const barra = medidor.querySelector('.fx-barra > span');
      barra.style.setProperty('--fx-valor', valor / 100);
      barra.style.setProperty('--fx-color', color(valor));
    });
    panelRaiz.querySelector('.ap-monitor__n').textContent = String(estado.procesos);
    panelRaiz.style.setProperty('--fx-led', color(Math.max(estado.cpu, estado.ram, estado.disco)));
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('ap');

    Fx.realzarComandos(prosa);
    const pasos = Fx.marcarPasos(prosa, /^(Paso|Acción) \d+ \([^)]*\):/);

    // Resalta las partes de cada acción: Problema, Procedimiento, Concepto y Resultado
    pasos.forEach((p) => {
      p.innerHTML = p.innerHTML.replace(
        /(Problema|Procedimiento|Concepto S\.O\.|Resultado y comprobación):/g,
        '<strong class="ap-etiqueta">$1:</strong>',
      );
    });
    const plan = Fx.marcarPasos(prosa, /^\d\. [^:<]{3,70}:/);

    const procesos = Fx.crear(procesosHtml());
    Fx.insertarDespues(Fx.buscarParrafo(prosa, /Síntomas principales/i), procesos);

    const virtual = Fx.crear(virtualHtml());
    Fx.insertarDespues(Fx.buscarParrafo(prosa, /Memoria RAM y memoria virtual/i), virtual);

    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    aplicar(panelRaiz, ESTADOS[0]);

    // Cada acción leída mejora el equipo; la acción 1 cierra los procesos que sobran
    const acciones = pasos.filter((p) => /^Acción/.test(p.textContent.trim()));
    limpiezas.push(Fx.seguirSeccion(acciones, (i) => {
      aplicar(panelRaiz, ESTADOS[i + 1] || ESTADOS[0]);
      procesos.classList.toggle('is-limpio', i >= 0);
    }, 0.6));

    limpiezas.push(Fx.activarAlAparecer([...pasos, ...plan], null, '-30%'));
    limpiezas.push(Fx.activarAlAparecer([procesos, virtual]));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
