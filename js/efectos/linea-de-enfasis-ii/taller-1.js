/*
 * Efectos de "Taller 1: Fundamentos de ciberseguridad".
 *  - Constelación lateral: cada tema enciende una estrella y, al final,
 *    las diez dibujan un escudo.
 *  - Tres amenazas del concepto de ciberseguridad.
 *  - La historia de los reportes olvidados (seguridad de la información).
 *  - La triada CID como constelación.
 *  - Amenaza, vulnerabilidad, riesgo e incidente.
 *  - Los tres impactos de un incidente.
 *  - Correo de phishing simulado con sus señales de alerta.
 */
(function () {
  'use strict';

  const CLAVE = 'linea-de-enfasis-ii/taller-1';
  const Fx = window.Fx;

  // Diez estrellas en forma de escudo (viewBox 200 x 220)
  const ESTRELLAS = [[100, 14], [150, 28], [180, 60], [176, 112], [150, 162], [100, 206], [50, 162], [24, 112], [20, 60], [50, 28]];

  const AMENAZAS = [
    ['Ransomware', 'cifra los archivos y amenaza con publicarlos'],
    ['Fuga de datos', 'expone datos bancarios, contraseñas y registros'],
    ['Ingeniería social', 'se hacen pasar por empresas para ganar confianza'],
  ];

  const HISTORIA = [
    'Se imprimen salarios y proyecciones para una reunión',
    'Los papeles quedan olvidados en el escritorio',
    'En la noche, alguien se los lleva',
    'La competencia contraataca y se lleva clientes clave',
  ];

  /* ---------- Plantillas ---------- */

  function panelHtml() {
    const estrellas = ESTRELLAS.map(([x, y], i) => `<circle class="t1-estrella" data-i="${i}" cx="${x}" cy="${y}" r="3" />`).join('');
    return `
      <div class="fx-panel t1-cielo">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Constelación de la seguridad</p>
        <p class="fx-panel__estado">Primera estrella</p>
        <svg class="t1-constelacion" viewBox="0 0 200 220" aria-hidden="true">
          <polyline class="t1-trazo" points="" />
          ${estrellas}
        </svg>
        <p class="fx-nota">Cada tema leído enciende una estrella.</p>
      </div>`;
  }

  function amenazasHtml() {
    const iconos = [
      '<rect x="6" y="11" width="12" height="9" rx="1.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
      '<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/><path d="M17 15l3 3"/>',
      '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/><path d="M15.5 5.5l3-2"/>',
    ];
    const tarjetas = AMENAZAS.map(([nombre, texto], i) => `
      <li style="--i: ${i}"><svg viewBox="0 0 24 24" aria-hidden="true">${iconos[i]}</svg><strong>${nombre}</strong><span>${texto}</span></li>`).join('');
    return `<ul class="t1-amenazas" aria-label="Ejemplos de amenazas">${tarjetas}</ul>`;
  }

  function historiaHtml() {
    return `
      <figure class="fx-figura t1-historia">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">El ejemplo del documento</span>Una fuga sin hackeo</figcaption>
        <ol class="fx-cadena">${HISTORIA.map((h, i) => `<li style="--i: ${i}"${i === 2 ? ' class="is-alerta"' : ''}>${h}</li>`).join('')}</ol>
        <p class="fx-nota">No se rompió ninguna contraseña ni firewall: la falla fue física y de procesos.</p>
      </figure>`;
  }

  function triadaHtml() {
    return `
      <figure class="fx-figura t1-triada">
        <svg viewBox="0 0 300 210" role="img" aria-label="Triada de la seguridad: confidencialidad, integridad y disponibilidad.">
          <path class="t1-triada__lado" pathLength="1" d="M150 40 L50 170 L250 170 Z" />
          <g class="t1-vertice" style="--i: 0" transform="translate(150 40)"><circle r="7" /><text y="-16" text-anchor="middle">Confidencialidad</text></g>
          <g class="t1-vertice" style="--i: 1" transform="translate(50 170)"><circle r="7" /><text y="28" text-anchor="middle">Integridad</text></g>
          <g class="t1-vertice" style="--i: 2" transform="translate(250 170)"><circle r="7" /><text y="28" text-anchor="middle">Disponibilidad</text></g>
        </svg>
        <figcaption>Solo quien debe ve la información, la información es exacta y está ahí cuando se necesita.</figcaption>
      </figure>`;
  }

  function conceptosHtml() {
    const piezas = [
      ['Amenaza', 'lo que puede causar daño'],
      ['Vulnerabilidad', 'la debilidad que lo permite'],
      ['Riesgo', 'la probabilidad y el impacto'],
      ['Incidente', 'cuando el daño ocurre'],
    ];
    return `
      <figure class="fx-figura t1-conceptos">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Vocabulario ISO/IEC 27000</span>Cuatro palabras que no son lo mismo</figcaption>
        <ol class="t1-conceptos__lista">${piezas.map(([n, d], i) => `<li style="--i: ${i}"><strong>${n}</strong><span>${d}</span></li>`).join('')}</ol>
      </figure>`;
  }

  function impactosHtml() {
    const piezas = [
      ['Económico', 'rescate, ventas perdidas y recuperación'],
      ['Legal', 'Ley 1581 de 2012 sobre datos personales'],
      ['Reputacional', 'la confianza es lo más difícil de recuperar'],
    ];
    return `<ul class="t1-impactos" aria-label="Tipos de impacto">${piezas.map(([n, d], i) => `<li style="--i: ${i}"><strong>${n}</strong><span>${d}</span></li>`).join('')}</ul>`;
  }

  function correo() {
    return Fx.correoHtml({
      rotulo: 'Phishing simulado · ejemplo ilustrativo',
      titulo: 'El tipo de correo que se usa para entrenar al personal',
      de: 'Soporte TI <[[soporte@empresa-seguridad.co]]>',
      asunto: '[[Su contraseña vence HOY]]',
      cuerpo: 'Estimado usuario: detectamos actividad inusual. [[Si no confirma sus datos en 2 horas]], su cuenta será bloqueada.',
      enlace: '[[Confirmar mi cuenta]]',
      senales: ['El dominio no es el de la empresa', 'Asunto alarmista para que no pienses', 'Presión de tiempo', 'Enlace que pide tus credenciales'],
    });
  }

  /* ---------- Comportamiento ---------- */

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('t1');

    const t = (patron) => Fx.buscarTitulo(prosa, patron);
    const amenazas = Fx.insertarDespues(t(/^Concepto de ciberseguridad/i), Fx.crear(amenazasHtml()), 1);
    const historia = Fx.insertarDespues(Fx.buscarParrafo(prosa, /no fue un ataque informático/i) || t(/^Seguridad de la información/i), Fx.crear(historiaHtml()));
    const triada = Fx.insertarDespues(t(/^Principios fundamentales/i), Fx.crear(triadaHtml()));
    const conceptos = Fx.insertarDespues(t(/Amenazas y vulnerabilidades/i), Fx.crear(conceptosHtml()), 1);
    const impactos = Fx.insertarDespues(t(/Impacto de los incidentes/i), Fx.crear(impactosHtml()));
    const phishing = Fx.insertarDespues(Fx.buscarParrafo(prosa, /phishing simulado/i) || t(/Factor humano/i), Fx.crear(correo()));

    limpiezas.push(Fx.activarAlAparecer([amenazas, historia, triada, conceptos, impactos, phishing]));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    // Constelación
    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const estrellas = [...panelRaiz.querySelectorAll('.t1-estrella')];
    const trazo = panelRaiz.querySelector('.t1-trazo');
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    const temas = Fx.titulos(prosa).filter((h) => h.tagName === 'H3');
    limpiezas.push(Fx.seguirSeccion(temas, (i) => {
      const encendidas = Math.min(ESTRELLAS.length, i + 1);
      estrellas.forEach((e, j) => {
        e.classList.toggle('is-encendida', j < encendidas);
        e.classList.toggle('is-actual', j === encendidas - 1);
      });
      const puntos = ESTRELLAS.slice(0, encendidas);
      if (encendidas === ESTRELLAS.length) puntos.push(ESTRELLAS[0]);
      trazo.setAttribute('points', puntos.map((p) => p.join(',')).join(' '));
      panelRaiz.classList.toggle('is-completa', encendidas === ESTRELLAS.length);
      estado.textContent = encendidas === ESTRELLAS.length
        ? 'Escudo completo'
        : (temas[i] ? temas[i].textContent.replace(/^Pregunta \d+\.\s*/, '') : 'Primera estrella');
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
