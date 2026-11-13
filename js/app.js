/*
 * Navegación de la página (portada -> materia -> documento) usando el hash de la URL:
 *   #/                         portada
 *   #/<materia>                sección de la materia
 *   #/<materia>/<documento>    lector del documento
 */
(function () {
  'use strict';

  const { datos, util } = window.Pagina;
  const { escapar, formatoFecha, dosDigitos } = util;

  const COLOR_TEMA = { dia: '#F3EDE2', noche: '#0B0C10' };
  const GIROS = [-1.6, 1.2, -0.8, 1.5, -1.2, 0.9];
  const TITULO_BASE = 'Cuaderno de investigación';

  const cuerpo = document.body;
  const principal = document.getElementById('contenido-principal');
  const velo = document.querySelector('.velo');
  const vistas = {
    portada: document.getElementById('vista-portada'),
    materia: document.getElementById('vista-materia'),
    lector: document.getElementById('vista-lector'),
  };

  let limpiarVista = null;
  let cubierto = false;

  if ('IntersectionObserver' in window) document.documentElement.classList.add('js-revelar');
  // Cada vista decide su posición de scroll (el navegador no la restaura sola)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Rutas ---------- */

  function leerRuta(hash) {
    const partes = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    const materia = datos.materias.find((m) => m.id === partes[0]) || null;
    const indice = materia && partes[1] ? materia.documentos.findIndex((d) => d.id === partes[1]) : -1;
    return {
      materia,
      documento: indice >= 0 ? materia.documentos[indice] : null,
      indice,
      valida: partes.length === 0 || (materia && (partes.length === 1 || indice >= 0)),
    };
  }

  function temaDe(ruta) {
    return ruta.materia ? ruta.materia.tema : 'noche';
  }

  /* ---------- Transiciones ---------- */

  function esperarAnimacion(elemento, maximo) {
    return new Promise((resolver) => {
      const listo = () => {
        clearTimeout(reloj);
        elemento.removeEventListener('animationend', listo);
        resolver();
      };
      const reloj = setTimeout(listo, maximo);
      elemento.addEventListener('animationend', listo);
    });
  }

  async function cubrir(color, origen) {
    velo.className = 'velo';
    velo.style.setProperty('--velo-color', color);
    if (origen) {
      velo.style.setProperty('--velo-x', `${origen.x}px`);
      velo.style.setProperty('--velo-y', `${origen.y}px`);
    }
    void velo.offsetWidth; // reinicia la animación
    velo.classList.add(origen ? 'is-circulo' : 'is-fundido');
    await esperarAnimacion(velo, origen ? 1100 : 500);
    cubierto = true;
  }

  async function descubrir() {
    velo.classList.add('is-saliendo');
    await esperarAnimacion(velo, 700);
    velo.className = 'velo';
    cubierto = false;
  }

  function centroDe(enlace) {
    const astro = enlace.querySelector('.sol, .luna');
    if (!astro) return null;
    const r = astro.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  document.addEventListener('click', async (evento) => {
    const enlace = evento.target.closest('a[href^="#/"]');
    if (!enlace || evento.defaultPrevented || evento.button !== 0) return;
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const destino = enlace.getAttribute('href');
    evento.preventDefault();
    if (destino === location.hash) return;
    await cubrir(COLOR_TEMA[temaDe(leerRuta(destino))], centroDe(enlace));
    location.hash = destino;
  });

  window.addEventListener('hashchange', async () => {
    if (!cubierto) await cubrir(COLOR_TEMA[temaDe(leerRuta(location.hash))]);
    await mostrarRuta();
    descubrir();
  });

  /* ---------- Vistas ---------- */

  function activar(nombre, tema, titulo) {
    Object.entries(vistas).forEach(([clave, vista]) => {
      vista.hidden = clave !== nombre;
    });
    cuerpo.dataset.vista = nombre;
    cuerpo.dataset.tema = tema;
    document.title = titulo ? `${titulo} · ${TITULO_BASE}` : `${TITULO_BASE} · Semestre 8`;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', COLOR_TEMA[tema]);
    window.scrollTo({ top: 0, behavior: 'instant' });
    principal.focus({ preventScroll: true });

    const vista = vistas[nombre];
    vista.classList.remove('is-entrando');
    void vista.offsetWidth;
    vista.classList.add('is-entrando');
  }

  async function mostrarRuta() {
    if (limpiarVista) {
      limpiarVista();
      limpiarVista = null;
    }

    const ruta = leerRuta(location.hash);
    if (!ruta.valida) {
      history.replaceState(null, '', '#/');
      return mostrarRuta();
    }

    if (!ruta.materia) {
      const veniaDeOtraVista = cuerpo.dataset.vista !== 'portada';
      activar('portada', 'noche');
      // Al volver desde una materia se regresa a los astros, no al video
      if (veniaDeOtraVista) window.Pagina.portada.irAAstros(false);
      window.Pagina.portada.actualizar();
      return;
    }

    window.Pagina.portada.pausar();

    if (!ruta.documento) {
      vistas.materia.innerHTML = plantillaMateria(ruta.materia);
      activar('materia', ruta.materia.tema, ruta.materia.nombre);
      limpiarVista = animarFichas(vistas.materia);
      return;
    }

    activar('lector', ruta.materia.tema, ruta.documento.titulo);
    limpiarVista = await window.Pagina.lector.mostrar(vistas.lector, ruta.materia, ruta.indice);
  }

  /* ---------- Portada: el cielo se inclina hacia el astro señalado ---------- */

  const portada = vistas.portada;
  portada.querySelectorAll('.astro').forEach((astro) => {
    const inclinar = () => { portada.dataset.inclina = astro.dataset.astro; };
    const soltar = () => { delete portada.dataset.inclina; };
    astro.addEventListener('pointerenter', inclinar);
    astro.addEventListener('focus', inclinar);
    astro.addEventListener('pointerleave', soltar);
    astro.addEventListener('blur', soltar);
  });

  /* ---------- Plantillas de la sección de materia ---------- */

  function astroHtml(tipo) {
    if (tipo === 'sol') {
      return `<span class="sol" aria-hidden="true"><span class="sol__halo"></span><span class="sol__rayos"></span><span class="sol__rayos sol__rayos--2"></span><span class="sol__nucleo"></span></span>`;
    }
    return `<span class="luna" aria-hidden="true"><span class="luna__halo"></span><span class="luna__disco"></span></span>`;
  }

  function fichaHtml(materia, doc, i) {
    const giro = GIROS[i % GIROS.length];
    // En la ficha solo aparece el autor principal; los coautores se ven dentro del documento
    const autor = `Por ${escapar(datos.sitio.autor)}`;
    return `
      <li class="ficha revelar" style="--giro: ${giro}deg; --retraso: ${i * 90}ms">
        <article class="ficha__papel">
          <header class="ficha__cabeza">
            <span>Ficha N.º ${dosDigitos(i + 1)}</span>
            <time datetime="${doc.fecha}">${formatoFecha(doc.fecha)}</time>
          </header>
          <p class="ficha__tipo">${escapar(doc.tipo)}</p>
          <h2 class="ficha__titulo">${escapar(doc.titulo)}</h2>
          <p class="ficha__resumen">${escapar(doc.resumen)}</p>
          <footer class="ficha__pie">
            <span class="ficha__autores">${autor}</span>
            <a class="ficha__leer" href="#/${materia.id}/${doc.id}">
              Leer más<span class="solo-lector">: ${escapar(doc.tipo)}, ${escapar(doc.titulo)}</span>
              <span class="ficha__flecha" aria-hidden="true">→</span>
            </a>
          </footer>
        </article>
      </li>`;
  }

  function plantillaMateria(materia) {
    const otra = datos.materias.find((m) => m.id !== materia.id);
    const fichas = materia.documentos.map((doc, i) => fichaHtml(materia, doc, i)).join('');
    const cruce = otra.tema === 'noche' ? 'Cruzar a la noche' : 'Volver al día';
    return `
      <div class="materia materia--${materia.tema}">
        <div class="materia__astro">${astroHtml(materia.astro)}</div>

        <nav class="migas" aria-label="Ruta">
          <a href="#/"><span class="flecha" aria-hidden="true">←</span> Volver al cielo</a>
        </nav>

        <header class="materia__cabecera">
          <p class="ceja">Materia ${materia.numero} · ${materia.tema === 'dia' ? 'Día' : 'Noche'}</p>
          <h1 class="materia__titulo">${materia.tituloHtml}</h1>
          <p class="materia__intro">${escapar(materia.intro)}</p>
          <dl class="materia__datos">
            <div><dt>Docente</dt><dd>${escapar(datos.sitio.docente)}</dd></div>
            <div><dt>Documentos</dt><dd>${dosDigitos(materia.documentos.length)}</dd></div>
            <div><dt>Periodo</dt><dd>Octubre y noviembre de 2026</dd></div>
          </dl>
        </header>

        <section class="materia__archivo" aria-labelledby="archivo-titulo">
          <h2 id="archivo-titulo" class="ceja materia__archivo-titulo">El archivo</h2>
          <ol class="fichas">${fichas}</ol>
        </section>

        <footer class="pie">
          <a class="pie__cruce" href="#/${otra.id}">
            <span class="ceja">${cruce}</span>
            <span class="pie__materia">${escapar(otra.nombre)} <span aria-hidden="true">→</span></span>
          </a>
          <p class="pie__creditos">${escapar(datos.sitio.titulo)} · ${escapar(datos.sitio.autor)} · ${escapar(datos.sitio.universidad)} · 2026</p>
        </footer>
      </div>`;
  }

  function animarFichas(raiz) {
    return util.alAparecer([...raiz.querySelectorAll('.revelar')], (el) => el.classList.add('is-visible'));
  }

  /* ---------- Inicio ---------- */
  mostrarRuta();
})();
