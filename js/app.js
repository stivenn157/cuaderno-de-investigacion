/*
 * Navegación de la página usando el hash de la URL:
 *   #/                               portada (sol y luna)
 *   #/<materia>                      inicio de la materia
 *   #/<materia>/temas                lista de temas
 *   #/<materia>/temas/<id>           resumen de un tema
 *   #/<materia>/conceptos            glosario
 *   #/<materia>/casos                lista de casos prácticos
 *   #/<materia>/casos/<id>           resumen de un caso
 *   #/<materia>/proyecto             proyecto y video tutorial
 * Las rutas antiguas (#/<materia>/<documento>) llevan al tema o caso de ese documento.
 */
(function () {
  'use strict';

  const { datos, secciones, util, vistas: plantillas } = window.Pagina;

  const COLOR_TEMA = { dia: '#F3EDE2', noche: '#0B0C10' };
  const TITULO_BASE = 'Cuaderno de investigación';
  const SECCIONES = ['temas', 'conceptos', 'casos', 'proyecto'];
  const CON_DETALLE = ['temas', 'casos'];

  const cuerpo = document.body;
  const principal = document.getElementById('contenido-principal');
  const velo = document.querySelector('.velo');
  const barra = { marca: document.getElementById('aula-marca'), nav: document.getElementById('aula-nav') };
  const vistas = {
    portada: document.getElementById('vista-portada'),
    materia: document.getElementById('vista-materia'),
    lector: document.getElementById('vista-lector'),
  };

  let limpiarVista = null;
  let cubierto = false;
  let materiaActual = null;

  if ('IntersectionObserver' in window) document.documentElement.classList.add('js-revelar');
  // Cada vista decide su posición de scroll (el navegador no la restaura sola)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Rutas ---------- */

  function leerRuta(hash) {
    const partes = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    const materia = datos.materias.find((m) => m.id === partes[0]) || null;
    const ruta = { materia, seccion: 'inicio', entrada: null, indice: -1, valida: partes.length === 0 };
    if (!materia) return ruta;

    const contenido = secciones[materia.id];
    const [, seccion, id] = partes;
    if (!seccion) return { ...ruta, valida: true };

    if (SECCIONES.includes(seccion)) {
      if (!id) return { ...ruta, seccion, valida: true };
      if (!CON_DETALLE.includes(seccion)) return ruta;
      const indice = contenido[seccion].findIndex((e) => e.id === id);
      return indice < 0 ? ruta : { ...ruta, seccion, entrada: contenido[seccion][indice], indice, valida: partes.length === 3 };
    }

    // Ruta antigua: #/<materia>/<documento>
    const destino = CON_DETALLE
      .map((s) => ({ s, e: contenido[s].find((x) => x.documento === seccion) }))
      .find((x) => x.e);
    return destino ? { ...ruta, redirigir: `#/${materia.id}/${destino.s}/${destino.e.id}` } : ruta;
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
    if (!cubierto) return;
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

  /** Dentro de una misma materia no hace falta el velo: el cambio es inmediato. */
  function mismaMateria(destino) {
    const ruta = leerRuta(destino);
    return Boolean(ruta.materia && materiaActual && ruta.materia.id === materiaActual.id);
  }

  document.addEventListener('click', async (evento) => {
    const enlace = evento.target.closest('a[href^="#/"]');
    if (!enlace || evento.defaultPrevented || evento.button !== 0) return;
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const destino = enlace.getAttribute('href');
    evento.preventDefault();
    if (destino === location.hash) {
      window.scrollTo({ top: 0, behavior: util.movimientoReducido() ? 'auto' : 'smooth' });
      return;
    }
    if (!mismaMateria(destino)) await cubrir(COLOR_TEMA[temaDe(leerRuta(destino))], centroDe(enlace));
    location.hash = destino;
  });

  window.addEventListener('hashchange', async () => {
    if (!cubierto && !mismaMateria(location.hash)) await cubrir(COLOR_TEMA[temaDe(leerRuta(location.hash))]);
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

  /** Barra superior de la materia: marca y menú de secciones. */
  function pintarBarra(ruta) {
    const visible = Boolean(ruta.materia);
    barra.marca.hidden = !visible;
    barra.nav.hidden = !visible;
    if (!visible) {
      materiaActual = null;
      return;
    }
    if (!materiaActual || materiaActual.id !== ruta.materia.id) {
      barra.marca.innerHTML = plantillas.marca(ruta.materia);
      barra.nav.innerHTML = plantillas.menu(ruta.materia);
    }
    materiaActual = ruta.materia;
    barra.nav.querySelectorAll('a[data-seccion]').forEach((a) => {
      if (a.dataset.seccion === ruta.seccion) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    // Lleva a la vista el elemento activo del menú (en celular el menú se desliza de lado)
    const actual = barra.nav.querySelector('[aria-current="page"]');
    if (actual) {
      const lista = actual.parentElement;
      lista.scrollTo({ left: actual.offsetLeft - (lista.clientWidth - actual.offsetWidth) / 2, behavior: 'auto' });
    }
    medirBarra();
  }

  function medirBarra() {
    const alto = barra.nav.hidden ? 0 : barra.nav.offsetHeight;
    document.documentElement.style.setProperty('--alto-barra', `${alto}px`);
  }

  window.addEventListener('resize', () => requestAnimationFrame(medirBarra), { passive: true });

  function tituloDe(ruta) {
    const nombres = { inicio: '', temas: 'Temas', conceptos: 'Conceptos', casos: 'Casos prácticos', proyecto: 'Proyecto - Video Tutorial' };
    if (ruta.entrada) return `${ruta.entrada.titulo} · ${ruta.materia.nombre}`;
    return nombres[ruta.seccion] ? `${nombres[ruta.seccion]} · ${ruta.materia.nombre}` : ruta.materia.nombre;
  }

  async function mostrarRuta() {
    if (limpiarVista) {
      limpiarVista();
      limpiarVista = null;
    }

    const ruta = leerRuta(location.hash);
    if (ruta.redirigir) {
      history.replaceState(null, '', ruta.redirigir);
      return mostrarRuta();
    }
    if (!ruta.valida) {
      history.replaceState(null, '', '#/');
      return mostrarRuta();
    }

    pintarBarra(ruta);

    if (!ruta.materia) {
      const veniaDeOtraVista = cuerpo.dataset.vista !== 'portada';
      activar('portada', 'noche');
      // Al volver desde una materia se regresa a los astros, no al video
      if (veniaDeOtraVista) window.Pagina.portada.irAAstros(false);
      window.Pagina.portada.actualizar();
      return;
    }

    window.Pagina.portada.pausar();

    if (!ruta.entrada) {
      vistas.materia.innerHTML = plantillas.seccion(ruta.materia, ruta.seccion);
      activar('materia', ruta.materia.tema, tituloDe(ruta));
      limpiarVista = plantillas.animar(vistas.materia, ruta.materia, ruta.seccion);
      return;
    }

    activar('lector', ruta.materia.tema, tituloDe(ruta));
    limpiarVista = await window.Pagina.lector.mostrar(vistas.lector, {
      materia: ruta.materia,
      seccion: ruta.seccion,
      entrada: ruta.entrada,
      indice: ruta.indice,
    });
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

  /* ---------- Inicio ---------- */
  mostrarRuta();
})();
