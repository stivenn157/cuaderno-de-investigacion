/*
 * Plantillas de cada materia: barra superior y las secciones
 * Inicio, Temas, Conceptos, Casos prácticos y Proyecto - Video Tutorial.
 * Los resúmenes de cada tema o caso los muestra js/lector.js.
 */
(function () {
  'use strict';

  const { datos, secciones, util } = window.Pagina;
  const { escapar, formatoFecha, dosDigitos } = util;

  const GIROS = [-1.6, 1.2, -0.8, 1.5, -1.2, 0.9];
  const MENU = [
    { seccion: 'inicio', icono: '⌂', texto: 'Inicio' },
    { seccion: 'temas', icono: '▤', texto: 'Temas' },
    { seccion: 'conceptos', icono: '◇', texto: 'Conceptos' },
    { seccion: 'casos', icono: '▣', texto: 'Casos prácticos' },
    { seccion: 'proyecto', icono: '▶', texto: 'Proyecto - Video Tutorial', corto: 'Proyecto' },
  ];
  const PASOS = [
    ['contexto', 'Contexto y problema'],
    ['analisis', 'Análisis de evidencias'],
    ['solucion', 'Propuesta de solución'],
  ];

  /* ---------- Ayudas ---------- */

  const ruta = (materia, ...partes) => `#/${[materia.id, ...partes].join('/')}`;
  const documentoDe = (materia, id) => materia.documentos.find((d) => d.id === id);
  const enlaceDescarga = (materia, doc) => `documentos/${materia.id}/${encodeURIComponent(doc.archivo)}`;
  const otraMateria = (materia) => datos.materias.find((m) => m.id !== materia.id);

  function astroHtml(tipo) {
    if (tipo === 'sol') {
      return '<span class="sol" aria-hidden="true"><span class="sol__halo"></span><span class="sol__rayos"></span><span class="sol__rayos sol__rayos--2"></span><span class="sol__nucleo"></span></span>';
    }
    return '<span class="luna" aria-hidden="true"><span class="luna__halo"></span><span class="luna__disco"></span></span>';
  }

  function cabecera({ ceja, titulo, texto, acciones = '' }) {
    return `
      <header class="aula-hero revelar">
        <p class="ceja">${ceja}</p>
        <h1 class="aula-hero__titulo">${titulo}</h1>
        <p class="aula-hero__texto">${texto}</p>
        ${acciones ? `<div class="aula-hero__acciones">${acciones}</div>` : ''}
      </header>`;
  }

  function encabezado(titulo, texto) {
    return `<div class="aula-encabezado revelar"><h2>${titulo}</h2><p>${texto}</p></div>`;
  }

  function panel(titulo, cuerpo, nota) {
    return `
      <section class="aula-panel revelar">
        <h2>${titulo}</h2>
        ${cuerpo}
        ${nota ? `<p class="aula-nota">${nota}</p>` : ''}
      </section>`;
  }

  function pie(materia) {
    const otra = otraMateria(materia);
    const cruce = otra.tema === 'noche' ? 'Cruzar a la noche' : 'Volver al día';
    return `
      <footer class="pie">
        <a class="pie__cruce" href="${ruta(otra)}">
          <span class="ceja">${cruce}</span>
          <span class="pie__materia">${escapar(otra.nombre)} <span aria-hidden="true">→</span></span>
        </a>
        <p class="pie__creditos">${escapar(datos.sitio.titulo)} · ${escapar(datos.sitio.autor)} · ${escapar(datos.sitio.universidad)} · 2026</p>
      </footer>`;
  }

  function envolver(materia, contenido) {
    return `
      <div class="materia materia--${materia.tema} aula">
        <div class="materia__astro" aria-hidden="true">${astroHtml(materia.astro)}</div>
        ${contenido}
        ${pie(materia)}
      </div>`;
  }

  /* ---------- Barra superior ---------- */

  function marca(materia) {
    const otra = otraMateria(materia);
    return `
      <div class="aula-marca__fila">
        <a class="aula-marca__cielo" href="#/" aria-label="Volver al cielo">${astroHtml(materia.astro)}</a>
        <div class="aula-marca__texto">
          <p class="ceja">Aula digital · Materia ${materia.numero}</p>
          <p class="aula-marca__titulo">${escapar(materia.nombre)}</p>
          <p class="aula-marca__sub">Aprendizaje · Tecnología · Semestre 8</p>
        </div>
        <a class="aula-marca__cruce" href="${ruta(otra)}">
          <span class="aula-marca__mini" aria-hidden="true">${astroHtml(otra.astro)}</span>
          <span>${escapar(otra.nombre)}</span>
        </a>
      </div>`;
  }

  function menu(materia) {
    const items = MENU.map((m) => {
      const href = m.seccion === 'inicio' ? ruta(materia) : ruta(materia, m.seccion);
      const texto = m.corto
        ? `<span class="aula-nav__largo">${m.texto}</span><span class="aula-nav__corto">${m.corto}</span>`
        : `<span>${m.texto}</span>`;
      return `<li><a href="${href}" data-seccion="${m.seccion}"><span class="aula-nav__icono" aria-hidden="true">${m.icono}</span>${texto}</a></li>`;
    }).join('');
    return `<nav class="aula-nav__marco" aria-label="Secciones de ${escapar(materia.nombre)}"><ul class="aula-nav__lista">${items}</ul></nav>`;
  }

  /* ---------- Inicio ---------- */

  function inicio(materia) {
    const c = secciones[materia.id];
    const tarjetas = [
      { s: 'temas', icono: '▤', titulo: 'Temas', texto: 'Resúmenes de cada eje temático, con animaciones y el documento completo para descargar.', dato: `${dosDigitos(c.temas.length)} temas`, accion: 'Entrar a Temas' },
      { s: 'conceptos', icono: '◇', titulo: 'Conceptos', texto: 'Glosario con las definiciones clave de la materia, cada una con un ejemplo.', dato: `${dosDigitos(c.conceptos.length)} conceptos`, accion: 'Entrar a Conceptos' },
      { s: 'casos', icono: '▣', titulo: 'Casos prácticos', texto: 'Casos reales analizados en tres pasos: contexto, análisis y propuesta de solución.', dato: `${dosDigitos(c.casos.length)} casos`, accion: 'Ver casos' },
      { s: 'proyecto', icono: '▶', titulo: 'Proyecto - Video Tutorial', texto: 'El video que explica cómo funciona este cuaderno y los documentos completos.', dato: 'Video', accion: 'Ver el proyecto' },
    ].map((t, i) => `
      <li class="aula-tarjeta revelar" style="--retraso: ${i * 90}ms">
        <span class="aula-tarjeta__icono" aria-hidden="true">${t.icono}</span>
        <span class="aula-tarjeta__dato">${t.dato}</span>
        <h3>${t.titulo}</h3>
        <p>${t.texto}</p>
        <a class="aula-tarjeta__enlace" href="${ruta(materia, t.s)}">${t.accion} <span aria-hidden="true">→</span></a>
      </li>`).join('');

    return envolver(materia, `
      <header class="materia__cabecera">
        <p class="ceja">Bienvenido/a al espacio académico · Materia ${materia.numero}</p>
        <h1 class="materia__titulo">${materia.tituloHtml}</h1>
        <p class="materia__intro">${escapar(materia.intro)}</p>
        <div class="aula-hero__acciones">
          <a class="boton boton--lleno" href="${ruta(materia, 'temas')}">Explorar los temas <span aria-hidden="true">→</span></a>
          <a class="boton" href="${ruta(materia, 'proyecto')}">Ver el video tutorial</a>
        </div>
        <dl class="materia__datos">
          <div><dt>Autor</dt><dd>${escapar(datos.sitio.autor)}</dd></div>
          <div><dt>Docente</dt><dd>${escapar(datos.sitio.docente)}</dd></div>
          <div><dt>Periodo</dt><dd>Octubre y noviembre de 2026</dd></div>
        </dl>
      </header>

      ${encabezado('Recorre el sitio', 'Accede a cada sección desde el menú superior o desde estas tarjetas.')}
      <ul class="aula-tarjetas">${tarjetas}</ul>

      ${panel('¿Cómo utilizar este espacio?', `
        <ul class="aula-lista">
          <li>Usa el menú superior para moverte entre Inicio, Temas, Conceptos, Casos prácticos y Proyecto.</li>
          <li>En cada tema y caso encontrarás un resumen con lo más importante y animaciones que explican las ideas.</li>
          <li>Si quieres el trabajo completo, usa el botón <strong>Descargar el documento completo</strong>.</li>
          <li>En "Proyecto - Video Tutorial" está el video que explica cómo recorrer este cuaderno.</li>
        </ul>`, 'Toca el astro de la barra superior para volver al cielo y elegir la otra materia.')}`);
  }

  /* ---------- Temas ---------- */

  function fichaTema(materia, tema, i) {
    const doc = documentoDe(materia, tema.documento);
    const etiquetas = tema.etiquetas.map((e) => `<span class="aula-etiqueta">${escapar(e)}</span>`).join('');
    return `
      <li class="ficha revelar" style="--giro: ${GIROS[i % GIROS.length]}deg; --retraso: ${i * 90}ms">
        <article class="ficha__papel">
          <header class="ficha__cabeza">
            <span>Tema ${dosDigitos(i + 1)}</span>
            <span>${escapar(doc.tipo)}</span>
          </header>
          <p class="ficha__tipo">${etiquetas}</p>
          <h2 class="ficha__titulo">${escapar(tema.titulo)}</h2>
          <p class="ficha__resumen">${escapar(tema.resumen)}</p>
          <footer class="ficha__pie">
            <span class="ficha__autores">Por ${escapar(datos.sitio.autor)}</span>
            <a class="ficha__leer" href="${ruta(materia, 'temas', tema.id)}">
              Leer resumen<span class="solo-lector">: ${escapar(tema.titulo)}</span>
              <span class="ficha__flecha" aria-hidden="true">→</span>
            </a>
          </footer>
        </article>
      </li>`;
  }

  function temas(materia) {
    const lista = secciones[materia.id].temas.map((t, i) => fichaTema(materia, t, i)).join('');
    return envolver(materia, `
      ${cabecera({
        ceja: 'Ruta de aprendizaje',
        titulo: 'Temas de la <em>asignatura</em>',
        texto: `Los ejes temáticos de ${escapar(materia.nombre)}, resumidos a partir de los trabajos del semestre. Cada tema incluye lo esencial, animaciones y el documento completo para descargar.`,
      })}
      ${encabezado('Organización temática', 'Elige un tema para leer su resumen.')}
      <ol class="fichas aula-fichas">${lista}</ol>
      ${panel('Orientaciones de estudio', `
        <ul class="aula-lista">
          <li>Empieza por el primer tema: cada uno se apoya en las ideas del anterior.</li>
          <li>Lee primero el bloque "Lo esencial" y luego recorre el resumen con sus animaciones.</li>
          <li>Busca los términos que no conozcas en la sección Conceptos.</li>
          <li>Relaciona cada tema con los casos prácticos para verlo aplicado en empresas reales.</li>
        </ul>`)}`);
  }

  /* ---------- Conceptos ---------- */

  function tarjetaConcepto(materia, c, i, temasMateria) {
    const tema = temasMateria.find((t) => t.id === c.tema);
    const caso = c.caso && secciones[materia.id].casos.find((x) => x.id === c.caso);
    const enlaces = [
      tema && `<a href="${ruta(materia, 'temas', tema.id)}">Tema: ${escapar(tema.titulo)}</a>`,
      caso && `<a href="${ruta(materia, 'casos', caso.id)}">Caso: ${escapar(caso.titulo)}</a>`,
    ].filter(Boolean).join('');
    return `
      <li class="concepto revelar" data-tema="${escapar(c.tema)}" data-texto="${escapar(`${c.termino} ${c.definicion}`.toLowerCase())}" style="--retraso: ${(i % 6) * 60}ms">
        <span class="concepto__letra" aria-hidden="true">${escapar(c.termino.charAt(0))}</span>
        <h3 class="concepto__termino">${escapar(c.termino)}</h3>
        <p class="concepto__definicion">${escapar(c.definicion)}</p>
        <details class="concepto__ejemplo">
          <summary>Ver ejemplo</summary>
          <p>${escapar(c.ejemplo)}</p>
        </details>
        <p class="concepto__enlaces">${enlaces}</p>
      </li>`;
  }

  function conceptos(materia) {
    const c = secciones[materia.id];
    const filtros = [`<button type="button" class="fx-boton" data-filtro="todos" aria-pressed="true">Todos</button>`]
      .concat(c.temas.map((t) => `<button type="button" class="fx-boton" data-filtro="${t.id}" aria-pressed="false">${escapar(t.titulo)}</button>`))
      .join('');
    const tarjetas = c.conceptos
      .slice()
      .sort((a, b) => a.termino.localeCompare(b.termino, 'es'))
      .map((x, i) => tarjetaConcepto(materia, x, i, c.temas))
      .join('');
    return envolver(materia, `
      ${cabecera({
        ceja: 'Glosario académico',
        titulo: 'Conceptos <em>clave</em>',
        texto: 'Las definiciones esenciales de la materia, explicadas con palabras sencillas, con un ejemplo y un enlace al tema donde se profundizan.',
      })}
      <div class="destacado revelar" data-destacado="${c.destacado}"></div>
      ${encabezado(`${dosDigitos(c.conceptos.length)} conceptos`, 'Filtra por tema o escribe para buscar.')}
      <div class="glosario__controles revelar">
        <div class="tt-gantt__botones" role="group" aria-label="Filtrar por tema">${filtros}</div>
        <label class="glosario__buscar">
          <span class="solo-lector">Buscar un concepto</span>
          <input type="search" placeholder="Buscar, por ejemplo: ${c.destacado === 'triada' ? 'phishing' : 'semáforo'}" autocomplete="off">
        </label>
      </div>
      <ul class="glosario">${tarjetas}</ul>
      <p class="glosario__vacio" hidden>No hay conceptos con ese nombre. Prueba con otra palabra.</p>
      ${panel('Cómo aprovechar el glosario', `
        <ol class="aula-lista">
          <li>Lee la definición y luego abre el ejemplo para verla aplicada.</li>
          <li>Usa el enlace del tema para estudiar el concepto en contexto.</li>
          <li>Repasa los conceptos antes de leer los casos prácticos.</li>
        </ol>`, 'Las definiciones se basan en los trabajos del semestre y en las fuentes que se citan en cada documento.')}`);
  }

  /* ---------- Casos prácticos ---------- */

  function tarjetaCaso(materia, caso, i) {
    const doc = documentoDe(materia, caso.documento);
    const pasos = PASOS.map(([clave, nombre], j) => `
      <li><span class="caso-paso__n">0${j + 1}</span><strong>${nombre}</strong><span>${escapar(caso.pasos[clave])}</span></li>`).join('');
    return `
      <li class="caso revelar" style="--retraso: ${i * 100}ms">
        <article>
          <header class="caso__cabeza">
            <span class="caso__numero">Caso ${dosDigitos(i + 1)}</span>
            <span class="caso__fuente">${escapar(doc.tipo)}</span>
          </header>
          <p class="caso__empresa">${escapar(caso.empresa)}</p>
          <h2 class="caso__titulo">${escapar(caso.titulo)}</h2>
          <p class="caso__resumen">${escapar(caso.resumen)}</p>
          <ol class="caso-pasos">${pasos}</ol>
          <a class="boton boton--lleno caso__ir" href="${ruta(materia, 'casos', caso.id)}">Ver el caso completo <span aria-hidden="true">→</span></a>
        </article>
      </li>`;
  }

  function casos(materia) {
    const lista = secciones[materia.id].casos.map((x, i) => tarjetaCaso(materia, x, i)).join('');
    const estructura = PASOS.map(([, nombre], i) => `<li style="--i: ${i}"><span>0${i + 1}</span>${nombre}</li>`).join('');
    return envolver(materia, `
      ${cabecera({
        ceja: 'Aprendizaje aplicado',
        titulo: 'Casos <em>prácticos</em>',
        texto: 'Situaciones reales y empresariales analizadas con los conceptos de la materia: qué pasó, por qué pasó y cómo se resuelve.',
      })}
      ${encabezado('Estructura de análisis', 'Todos los casos se recorren en los mismos tres pasos.')}
      <ol class="estructura revelar">${estructura}</ol>
      <ol class="casos">${lista}</ol>
      ${panel('Preguntas orientadoras', `
        <ul class="aula-lista">
          <li>¿Cuál es el problema principal y qué evidencias permiten identificarlo?</li>
          <li>¿Qué conceptos de la materia ayudan a comprender la situación?</li>
          <li>¿Qué alternativas se pueden implementar y cuáles son sus ventajas y limitaciones?</li>
          <li>¿Qué recursos, riesgos y criterios permiten evaluar la solución?</li>
        </ul>`)}`);
  }

  /* ---------- Proyecto - Video Tutorial ---------- */

  function proyecto(materia) {
    const documentos = materia.documentos.map((doc, i) => `
      <li class="descarga revelar" style="--retraso: ${i * 60}ms">
        <span class="descarga__icono" aria-hidden="true">.docx</span>
        <span class="descarga__texto">
          <span class="descarga__tipo">${escapar(doc.tipo)} · <time datetime="${doc.fecha}">${formatoFecha(doc.fecha)}</time></span>
          <span class="descarga__titulo">${escapar(doc.titulo)}</span>
        </span>
        <a class="boton descarga__boton" href="${enlaceDescarga(materia, doc)}" download>
          <span aria-hidden="true">↓</span> Descargar<span class="solo-lector"> ${escapar(doc.titulo)}</span>
        </a>
      </li>`).join('');

    return envolver(materia, `
      ${cabecera({
        ceja: 'Entrega y sustentación',
        titulo: 'Proyecto - Video <em>Tutorial</em>',
        texto: 'El proyecto final es este cuaderno de investigación. Aquí está el video que explica su estructura y su funcionamiento, junto con los documentos completos de la materia.',
        acciones: `<button type="button" class="boton boton--lleno" data-ir-video>Ir al video <span aria-hidden="true">↓</span></button>
                   <a class="boton" href="${ruta(materia)}">Volver al inicio</a>`,
      })}

      ${panel('Información del proyecto', `
        <p>El proyecto reúne en un sitio web los trabajos del octavo semestre de ${escapar(materia.nombre)}. Cada documento se resumió y se organizó en temas, conceptos y casos prácticos, con animaciones que explican las ideas de forma visual.</p>
        <ul class="aula-lista">
          <li><strong>Inicio:</strong> la presentación de la materia y el acceso a cada sección.</li>
          <li><strong>Temas:</strong> los ejes temáticos con sus resúmenes.</li>
          <li><strong>Conceptos:</strong> el glosario de la materia.</li>
          <li><strong>Casos prácticos:</strong> casos reales en tres pasos.</li>
        </ul>`)}

      <section class="aula-panel aula-video revelar" id="video-tutorial" tabindex="-1">
        <h2>Video explicativo del proyecto</h2>
        <figure class="presentacion">
          <div class="presentacion__pantalla"></div>
          <figcaption class="presentacion__pie">
            <span class="ceja">Video tutorial</span>
            <span class="presentacion__titulo">Cómo recorrer este cuaderno</span>
          </figcaption>
        </figure>
      </section>

      ${panel('Orientación del video tutorial', `
        <ul class="aula-lista">
          <li>Presenta el nombre y el objetivo del proyecto.</li>
          <li>Muestra el sitio en funcionamiento: la portada, las dos materias y sus secciones.</li>
          <li>Explica cómo están organizados los temas, los conceptos y los casos.</li>
          <li>Comparte conclusiones y posibles mejoras.</li>
        </ul>`, 'El video es el mismo para las dos materias.')}

      ${encabezado('Documentos completos', `Los ${materia.documentos.length} trabajos originales de ${escapar(materia.nombre)}, listos para descargar.`)}
      <ul class="descargas">${documentos}</ul>`);
  }

  /* ---------- Comportamiento ---------- */

  function activarGlosario(raiz) {
    const glosario = raiz.querySelector('.glosario');
    if (!glosario) return () => {};
    const tarjetas = [...glosario.children];
    const botones = [...raiz.querySelectorAll('[data-filtro]')];
    const buscador = raiz.querySelector('.glosario__buscar input');
    const vacio = raiz.querySelector('.glosario__vacio');
    let filtro = 'todos';

    const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const aplicar = () => {
      const texto = normalizar(buscador.value.trim());
      let visibles = 0;
      tarjetas.forEach((t) => {
        const ok = (filtro === 'todos' || t.dataset.tema === filtro) && (!texto || normalizar(t.dataset.texto).includes(texto));
        t.hidden = !ok;
        if (ok) {
          visibles += 1;
          t.classList.add('is-visible');
        }
      });
      vacio.hidden = visibles > 0;
    };

    botones.forEach((b) => b.addEventListener('click', () => {
      filtro = b.dataset.filtro;
      botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      aplicar();
    }));
    buscador.addEventListener('input', aplicar);
    return () => {};
  }

  function animar(raiz, materia, seccion) {
    const limpiezas = [];
    const titulo = raiz.querySelector('h1');
    if (titulo) {
      util.partirPalabras(titulo);
      requestAnimationFrame(() => requestAnimationFrame(() => titulo.classList.add('titulo-visible')));
    }
    limpiezas.push(util.alAparecer([...raiz.querySelectorAll('.revelar')], (el) => el.classList.add('is-visible')));

    if (seccion === 'conceptos') {
      limpiezas.push(activarGlosario(raiz));
      const destacado = raiz.querySelector('.destacado');
      if (destacado && window.Pagina.destacados) limpiezas.push(window.Pagina.destacados.montar(destacado));
    }
    if (seccion === 'proyecto') {
      window.Pagina.video.montar(raiz.querySelector('.presentacion__pantalla'));
      const boton = raiz.querySelector('[data-ir-video]');
      const video = raiz.querySelector('#video-tutorial');
      boton.addEventListener('click', () => {
        video.scrollIntoView({ behavior: util.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
        video.focus({ preventScroll: true });
      });
      limpiezas.push(() => window.Pagina.video.pausar(raiz));
    }
    return () => limpiezas.forEach((fn) => fn && fn());
  }

  function seccion(materia, nombre) {
    const plantillas = { inicio, temas, conceptos, casos, proyecto };
    return (plantillas[nombre] || inicio)(materia);
  }

  window.Pagina.vistas = Object.freeze({ marca, menu, seccion, animar, astroHtml, documentoDe, enlaceDescarga, PASOS });
})();
