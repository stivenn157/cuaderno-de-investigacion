/*
 * Efectos del "Análisis de caso: Ransomware en Ecopetrol".
 * Se carga solo cuando se abre este documento.
 *
 *  - Monitor del incidente (columna derecha): fase, escudo de 5 defensas y registro.
 *  - Títulos que aparecen palabra por palabra (animación común).
 *  - Alerta del 17 de julio, simulación de ransomware, contador de 3.300 cuentas,
 *    triada CID, mapa de debilidades y marcas de estrategias dentro del texto.
 *  - Lluvia hexadecimal en los bordes de pantallas anchas.
 */
(function () {
  'use strict';

  const CLAVE = 'linea-de-enfasis-ii/analisis-de-caso';
  const SIMBOLOS = '0123456789ABCDEF#$%&@<>/{}[]';
  const { escapar, alAparecer } = window.Pagina.util;

  const FASES = {
    inicio: { estado: 'Expediente abierto', nivel: 'calma' },
    I: { estado: 'Intrusión detectada', nivel: 'rojo' },
    II: { estado: 'Analizando vulnerabilidades', nivel: 'ambar' },
    III: { estado: 'Desplegando defensas', nivel: 'oro' },
    IV: { estado: 'Infraestructura reforzada', nivel: 'verde' },
  };

  // Línea del registro que se escribe al llegar a cada pregunta del documento
  const REGISTRO = [
    [/actividad económica/i, 'Objetivo: Grupo Ecopetrol, 15 compañías'],
    [/descripción del incidente/i, '17/07/2026 · acceso no autorizado a la nube'],
    [/descarga de información/i, 'Exfiltración de archivos almacenados en la nube'],
    [/ataque de ransomware/i, 'Carga de ransomware bloqueada a tiempo'],
    [/3\.300 cuentas/i, '3.300 cuentas de usuario involucradas'],
    [/objetivo de los ciberdelincuentes/i, 'Información corporativa como botín'],
    [/consecuencias económicas/i, 'Divulgación ilegal de la información'],
    [/medidas implementadas/i, 'Protocolos de contención activados'],
    [/confidencialidad, integridad/i, 'Evaluando la triada CID'],
    [/cinco posibles debilidades/i, '5 debilidades identificadas'],
    [/cinco estrategias/i, 'Plan de 5 estrategias en marcha'],
    [/propuesta comercial/i, 'Propuesta de servicio lista'],
    [/sin que sus operaciones/i, 'Lección: robar no siempre es detener'],
    [/usuarios y permisos/i, 'Prioridad: identidades y permisos'],
    [/menor tamaño/i, 'Riesgo extendido a las pymes'],
  ];

  const DEBILIDADES = [
    'Sin límites de descarga ni vigilancia de la salida de datos',
    'Exceso de permisos entre las nubes de las filiales',
    'VPN y accesos remotos sin actualizar',
    'Robo de tokens de sesión',
    'Documentos sin clasificar ni cifrar',
  ];

  const ESTRATEGIAS = [
    'Prevención de exfiltración con CASB y DLP',
    'Confianza cero y microsegmentación',
    'Cifrado persistente de documentos',
    'Identidades con llaves FIDO2',
    'Anti-ransomware y caza de amenazas 24/7',
  ];

  const ARCHIVOS = [
    'contratos_2026.pdf',
    'nomina_julio.xlsx',
    'balance_financiero.docx',
    'proveedores.csv',
    'plan_operativo.pptx',
    'actas_junta.pdf',
  ];

  /* ---------- Ayudas ---------- */

  function crear(html) {
    const plantilla = document.createElement('template');
    plantilla.innerHTML = html.trim();
    return plantilla.content.firstElementChild;
  }

  function aleatorio(texto) {
    return [...texto].map((c) => (c === ' ' ? c : SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)])).join('');
  }

  function buscarTitulo(prosa, patron) {
    return [...prosa.querySelectorAll('h3')].find((h) => patron.test(h.textContent)) || null;
  }

  /* ---------- Componentes dentro del texto ---------- */

  function alertaHtml() {
    return `
      <div class="ac-alerta" role="note">
        <span class="ac-alerta__luz" aria-hidden="true"></span>
        <div>
          <p class="ac-alerta__titulo">Alerta de seguridad · 17 de julio de 2026</p>
          <p class="ac-alerta__texto">Acceso no autorizado a recursos almacenados en la nube del Grupo Ecopetrol.</p>
        </div>
      </div>`;
  }

  function simulacionHtml() {
    const filas = ARCHIVOS.map((nombre) => `
      <li class="ac-archivo">
        <span class="ac-archivo__icono" aria-hidden="true"></span>
        <span class="ac-archivo__nombre">${nombre}</span>
        <span class="ac-archivo__estado">intacto</span>
      </li>`).join('');
    return `
      <figure class="ac-sim">
        <figcaption class="ac-sim__cabeza">
          <span class="ac-sim__rotulo">Simulación ilustrativa</span>
          Así avanza un ransomware, y así se ve cuando lo detienen a tiempo
        </figcaption>
        <ul class="ac-sim__archivos">${filas}</ul>
        <div class="ac-sim__barra" aria-hidden="true"><span></span></div>
        <div class="ac-sim__pie">
          <p class="ac-sim__estado" aria-live="polite">En espera</p>
          <button type="button" class="ac-sim__repetir">Repetir</button>
        </div>
        <p class="ac-sim__sello" aria-hidden="true">Ejecución bloqueada</p>
      </figure>`;
  }

  function cifraHtml() {
    const puntos = Array.from({ length: 33 }, (_, i) => `<span style="--i: ${i}"></span>`).join('');
    return `
      <figure class="ac-cifra">
        <p class="ac-cifra__num" aria-hidden="true">0</p>
        <figcaption class="ac-cifra__texto">
          <span class="solo-lector">3.300</span> cuentas de usuario involucradas en el incidente
        </figcaption>
        <div class="ac-cifra__puntos" aria-hidden="true">${puntos}</div>
        <p class="ac-cifra__leyenda" aria-hidden="true">Cada punto representa 100 cuentas</p>
      </figure>`;
  }

  function triadaHtml() {
    return `
      <figure class="ac-triada">
        <svg viewBox="0 0 320 300" role="img" aria-labelledby="ac-triada-desc">
          <desc id="ac-triada-desc">Triángulo de la triada de seguridad: la confidencialidad fue vulnerada, la integridad quedó intacta y la disponibilidad resistió el ataque.</desc>
          <path class="ac-triada__lado" pathLength="1" d="M160 70 L44 232 L276 232 Z" />
          <g class="ac-vertice ac-vertice--golpe" transform="translate(160 70)">
            <circle class="ac-vertice__onda" r="16" />
            <circle r="9" />
            <text y="-42" text-anchor="middle">Confidencialidad</text>
            <text class="ac-vertice__estado" y="-24" text-anchor="middle">vulnerada</text>
          </g>
          <g class="ac-vertice" transform="translate(44 232)">
            <circle r="9" />
            <text y="32" text-anchor="middle">Integridad</text>
            <text class="ac-vertice__estado" y="50" text-anchor="middle">intacta</text>
          </g>
          <g class="ac-vertice" transform="translate(276 232)">
            <circle r="9" />
            <text y="32" text-anchor="middle">Disponibilidad</text>
            <text class="ac-vertice__estado" y="50" text-anchor="middle">resistió</text>
          </g>
        </svg>
        <figcaption>Dos de los tres pilares salieron bien librados: los archivos se copiaron, pero no se alteraron y la operación siguió al cien por ciento.</figcaption>
      </figure>`;
  }

  function grietasHtml() {
    const items = DEBILIDADES.map((texto, i) => `
      <li data-n="${i + 1}"><span class="ac-grietas__n">0${i + 1}</span><span>${escapar(texto)}</span></li>`).join('');
    return `<ol class="ac-grietas" aria-label="Las cinco debilidades">${items}</ol>`;
  }

  function monitorHtml() {
    return `
      <div class="ac-monitor" data-nivel="calma">
        <p class="ac-monitor__cabeza"><span class="ac-led" aria-hidden="true"></span>Monitor del incidente</p>
        <p class="ac-monitor__estado">Expediente abierto</p>
        <svg class="ac-escudo" viewBox="0 0 120 140" aria-hidden="true">
          <defs><clipPath id="ac-escudo-forma"><path d="M60 6 L108 22 V64 C108 98 86 122 60 134 C34 122 12 98 12 64 V22 Z" /></clipPath></defs>
          <g clip-path="url(#ac-escudo-forma)">
            ${[0, 1, 2, 3, 4].map((i) => `<rect class="ac-escudo__capa" x="0" y="${108 - i * 25.6}" width="120" height="26.6" />`).join('')}
          </g>
          <path class="ac-escudo__borde" d="M60 6 L108 22 V64 C108 98 86 122 60 134 C34 122 12 98 12 64 V22 Z" />
        </svg>
        <p class="ac-escudo__texto"><span class="ac-escudo__n">0</span> de 5 defensas</p>
        <dl class="ac-monitor__datos">
          <div><dt>Cuentas</dt><dd class="ac-monitor__cuentas">—</dd></div>
          <div><dt>Compañías</dt><dd>15</dd></div>
        </dl>
        <p class="ac-monitor__sub">Registro</p>
        <ol class="ac-registro"></ol>
      </div>`;
  }

  /* ---------- Animaciones ---------- */

  function crearAnimador(reducido) {
    const marcos = new Set();
    const relojes = new Set();

    function marco(fn) {
      const id = requestAnimationFrame((t) => { marcos.delete(id); fn(t); });
      marcos.add(id);
    }

    function esperar(ms, fn) {
      const id = setTimeout(() => { relojes.delete(id); fn(); }, reducido ? 0 : ms);
      relojes.add(id);
    }

    function contar(elemento, hasta, duracion) {
      const formato = (n) => Math.round(n).toLocaleString('es-CO');
      if (reducido) { elemento.textContent = formato(hasta); return; }
      const inicio = performance.now();
      const paso = (t) => {
        const avance = Math.min(1, (t - inicio) / duracion);
        const suave = 1 - Math.pow(1 - avance, 3);
        elemento.textContent = formato(hasta * suave);
        if (avance < 1) marco(paso);
      };
      marco(paso);
    }

    function detener() {
      marcos.forEach(cancelAnimationFrame);
      relojes.forEach(clearTimeout);
      marcos.clear();
      relojes.clear();
    }

    return { contar, esperar, detener };
  }

  function lluviaHtml() {
    const lineas = Array.from({ length: 70 }, () => {
      let linea = '';
      for (let i = 0; i < 12; i += 1) linea += SIMBOLOS[Math.floor(Math.random() * 16)];
      return linea;
    }).join('\n');
    return `<div class="ac-lluvia" aria-hidden="true"><pre>${lineas}\n${lineas}</pre></div>`;
  }

  /* ---------- Simulación de ransomware ---------- */

  function correrSimulacion(sim, anim) {
    const filas = [...sim.querySelectorAll('.ac-archivo')];
    const estado = sim.querySelector('.ac-sim__estado');
    const barra = sim.querySelector('.ac-sim__barra span');

    sim.classList.remove('is-bloqueada');
    filas.forEach((f, i) => {
      f.className = 'ac-archivo';
      f.querySelector('.ac-archivo__nombre').textContent = ARCHIVOS[i];
      f.querySelector('.ac-archivo__estado').textContent = 'intacto';
    });
    barra.style.transform = 'scaleX(0)';
    estado.textContent = 'Cifrando archivos…';

    [0, 1, 2].forEach((i) => {
      anim.esperar(500 + i * 520, () => {
        const nombre = filas[i].querySelector('.ac-archivo__nombre');
        filas[i].classList.add('is-cifrado');
        nombre.textContent = `${aleatorio(ARCHIVOS[i].split('.')[0])}.locked`;
        filas[i].querySelector('.ac-archivo__estado').textContent = 'cifrado';
        barra.style.transform = `scaleX(${(i + 1) / 6})`;
      });
    });

    anim.esperar(2300, () => {
      sim.classList.add('is-bloqueada');
      estado.textContent = 'Ejecución bloqueada · 3 de 6 archivos a salvo';
      filas.slice(3).forEach((f) => {
        f.classList.add('is-salvo');
        f.querySelector('.ac-archivo__estado').textContent = 'a salvo';
      });
    });
  }

  /* ---------- Inicio ---------- */

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = crearAnimador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('ac');

    // Monitor lateral
    panel.innerHTML = monitorHtml();
    const monitor = panel.querySelector('.ac-monitor');
    const estadoMonitor = monitor.querySelector('.ac-monitor__estado');
    const registro = monitor.querySelector('.ac-registro');
    const capas = [...monitor.querySelectorAll('.ac-escudo__capa')];
    const contadorEscudo = monitor.querySelector('.ac-escudo__n');
    const cuentasMonitor = monitor.querySelector('.ac-monitor__cuentas');

    let lineas = 0;
    function escribir(texto) {
      lineas += 1;
      const linea = crear(`<li><span>${String(lineas).padStart(2, '0')}</span>${escapar(texto)}</li>`);
      registro.prepend(linea);
      while (registro.children.length > 6) registro.lastElementChild.remove();
    }

    // Componentes dentro del texto
    const hIncidente = buscarTitulo(prosa, /descripción del incidente/i);
    if (hIncidente) hIncidente.after(crear(alertaHtml()));

    const hRansom = buscarTitulo(prosa, /ataque de ransomware/i);
    const sim = hRansom && hRansom.nextElementSibling ? crear(simulacionHtml()) : null;
    if (sim) {
      hRansom.nextElementSibling.after(sim);
      const repetir = () => correrSimulacion(sim, anim);
      sim.querySelector('.ac-sim__repetir').addEventListener('click', repetir);
    }

    const hCuentas = buscarTitulo(prosa, /3\.300 cuentas/i);
    const cifra = hCuentas ? crear(cifraHtml()) : null;
    if (cifra) hCuentas.after(cifra);

    const hCid = buscarTitulo(prosa, /confidencialidad, integridad/i);
    const triada = hCid ? crear(triadaHtml()) : null;
    if (triada) {
      const segundo = hCid.nextElementSibling && hCid.nextElementSibling.nextElementSibling;
      (segundo || hCid).after(triada);
    }

    const hDebil = buscarTitulo(prosa, /cinco posibles debilidades/i);
    const grietas = hDebil ? crear(grietasHtml()) : null;
    if (grietas) hDebil.after(grietas);

    const parrafos = [...prosa.querySelectorAll(':scope > p')];
    const parrafosDebilidad = DEBILIDADES.map((_, i) => parrafos.find((p) => p.textContent.includes(`Debilidad ${i + 1}`)));
    ESTRATEGIAS.forEach((nombre, i) => {
      const p = parrafos.find((x) => x.textContent.includes(`Estrategia ${i + 1}`));
      if (p) {
        p.before(crear(`<p class="ac-estrategia" data-n="${i + 1}"><span class="ac-estrategia__escudo" aria-hidden="true"></span>Estrategia ${i + 1} de 5 · ${escapar(nombre)}</p>`));
      }
    });

    // Lluvia hexadecimal en los bordes (solo pantallas anchas, sin movimiento reducido)
    if (!reducido) {
      const izq = crear(lluviaHtml());
      const der = crear(lluviaHtml());
      der.classList.add('ac-lluvia--der');
      raiz.append(izq, der);
    }

    // Títulos internos: aparecen palabra por palabra (animación común a todos los documentos)
    limpiezas.push(window.Fx.revelarTitulos(prosa));

    // Registro: una línea por pregunta
    const titulosRegistro = REGISTRO
      .map(([patron, texto]) => ({ h: buscarTitulo(prosa, patron), texto }))
      .filter((x) => x.h);
    limpiezas.push(alAparecer(titulosRegistro.map((x) => x.h), (h) => {
      const item = titulosRegistro.find((x) => x.h === h);
      if (item) escribir(item.texto);
    }));

    // Componentes que se activan al aparecer
    const activables = [prosa.querySelector('.ac-alerta'), sim, cifra, triada, grietas].filter(Boolean);
    limpiezas.push(alAparecer(activables, (el) => {
      el.classList.add('is-activa');
      if (el === sim) correrSimulacion(sim, anim);
      if (el === cifra) {
        anim.contar(cifra.querySelector('.ac-cifra__num'), 3300, 1800);
        anim.contar(cuentasMonitor, 3300, 1800);
      }
    }, { rootMargin: '0px 0px -25% 0px' }));

    // Debilidades: se abre una grieta por cada párrafo leído (y las anteriores, si se saltó)
    const marcasDebilidad = parrafosDebilidad.filter(Boolean);
    limpiezas.push(alAparecer(marcasDebilidad, (p) => {
      const n = parrafosDebilidad.indexOf(p) + 1;
      if (!grietas) return;
      [...grietas.children].slice(0, n).forEach((li) => li.classList.add('is-abierta'));
    }, { rootMargin: '0px 0px -35% 0px' }));

    // Estrategias: cada una llena una capa del escudo (y las anteriores, si se saltó)
    let defensas = 0;
    const marcasEstrategia = [...prosa.querySelectorAll('.ac-estrategia')];
    limpiezas.push(alAparecer(marcasEstrategia, (marca) => {
      const n = Number(marca.dataset.n);
      if (n <= defensas) return;
      for (let i = defensas; i < n; i += 1) {
        if (capas[i]) capas[i].classList.add('is-llena');
        if (marcasEstrategia[i]) marcasEstrategia[i].classList.add('is-activa');
      }
      defensas = n;
      contadorEscudo.textContent = String(defensas);
      escribir(`Defensa ${n} activa`);
    }, { rootMargin: '0px 0px -35% 0px' }));

    // Fase actual según la parte del documento que se está leyendo
    const partes = [...prosa.querySelectorAll('h2[data-parte]')];
    let faseActual = 'inicio';
    let pendiente = false;
    const revisarFase = () => {
      pendiente = false;
      const limite = window.innerHeight * 0.45;
      const leida = partes.filter((h) => h.getBoundingClientRect().top < limite).pop();
      const fase = leida ? leida.dataset.parte : 'inicio';
      if (fase === faseActual || !FASES[fase]) return;
      faseActual = fase;
      monitor.dataset.nivel = FASES[fase].nivel;
      raiz.dataset.fase = FASES[fase].nivel;
      estadoMonitor.textContent = FASES[fase].estado;
    };
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(revisarFase);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    limpiezas.push(() => window.removeEventListener('scroll', alDesplazar));
    revisarFase();

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
