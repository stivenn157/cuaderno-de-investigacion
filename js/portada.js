/*
 * Portada:
 *  - Escena del sol y la luna controlada por el scroll (funciona al bajar y al subir).
 *  - Video de presentación (archivo local o YouTube), cargado sin frenar la página.
 */
(function () {
  'use strict';

  const { datos, util } = window.Pagina;
  const portada = document.getElementById('vista-portada');
  const escena = portada.querySelector('.escena');
  const pantalla = portada.querySelector('.presentacion__pantalla');

  /* ---------- Escena controlada por el scroll ---------- */

  const tramo = (valor, desde, hasta) => Math.min(1, Math.max(0, (valor - desde) / (hasta - desde)));
  const suave = (t) => 1 - Math.pow(1 - t, 3);

  let pendiente = false;

  function actualizar() {
    pendiente = false;
    if (document.body.dataset.vista !== 'portada') return;

    const caja = escena.getBoundingClientRect();
    const alto = window.innerHeight;
    const reducido = util.movimientoReducido();

    // entrada: la escena sube desde abajo de la pantalla hasta el tope (0 -> 1)
    // avance: recorrido mientras el marco está fijo (0 -> 1)
    const entrada = reducido ? 1 : tramo(alto - caja.top, 0, alto);
    const avance = reducido ? 1 : tramo(-caja.top, 0, Math.max(1, caja.height - alto));

    const valores = {
      '--cabeza': suave(tramo(entrada, 0.3, 1)),
      '--sube-sol': suave(tramo(avance, 0, 0.6)),
      '--sube-luna': suave(tramo(avance, 0.12, 0.72)),
      '--nombres': suave(tramo(avance, 0.6, 0.88)),
      '--amanecer': suave(tramo(avance, 0, 0.75)),
    };
    Object.entries(valores).forEach(([nombre, valor]) => portada.style.setProperty(nombre, valor.toFixed(3)));
    escena.classList.toggle('is-lista', avance > 0.7);
  }

  function alDesplazar() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }

  window.addEventListener('scroll', alDesplazar, { passive: true });
  window.addEventListener('resize', alDesplazar, { passive: true });

  /** Lleva el scroll hasta el punto en que los astros ya salieron. */
  function irAAstros(suavemente) {
    const destino = escena.offsetTop + (escena.offsetHeight - window.innerHeight) * 0.92;
    window.scrollTo({ top: destino, behavior: suavemente && !util.movimientoReducido() ? 'smooth' : 'instant' });
    alDesplazar();
  }

  portada.querySelector('.portada__bajar').addEventListener('click', () => irAAstros(true));

  // Si alguien llega con el teclado a un astro que aún no salió, se completa la escena
  portada.querySelectorAll('.astro').forEach((astro) => {
    astro.addEventListener('focus', () => {
      if (!escena.classList.contains('is-lista')) irAAstros(false);
    });
  });

  /* ---------- Video de presentación ---------- */

  const ICONO_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>';

  function idYoutube(enlace) {
    const coincide = String(enlace).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return coincide ? coincide[1] : null;
  }

  function mostrarAviso() {
    pantalla.innerHTML = `
      <div class="presentacion__vacio">
        <span class="presentacion__play">${ICONO_PLAY}</span>
        <p class="presentacion__aviso">El video de presentación estará aquí muy pronto</p>
      </div>`;
  }

  function montarYoutube(id) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'presentacion__portada';
    boton.style.backgroundImage = `url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`;
    boton.setAttribute('aria-label', 'Reproducir el video de presentación');
    boton.innerHTML = `<span class="presentacion__play">${ICONO_PLAY}</span>`;
    // El reproductor de YouTube solo se carga cuando la persona pulsa: la portada sigue liviana
    boton.addEventListener('click', () => {
      const marco = document.createElement('iframe');
      marco.className = 'presentacion__marco';
      marco.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      marco.title = 'Video de presentación';
      marco.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      marco.allowFullscreen = true;
      boton.replaceWith(marco);
    });
    pantalla.replaceChildren(boton);
  }

  function montarArchivo(config) {
    const video = document.createElement('video');
    video.className = 'presentacion__video';
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    const fuente = document.createElement('source');
    fuente.src = config.archivo;
    fuente.type = 'video/mp4';
    video.append(fuente);
    // Se muestra solo si el archivo existe; si no, queda el aviso
    video.addEventListener('loadedmetadata', () => {
      if (config.portada) video.poster = config.portada;
      pantalla.replaceChildren(video);
    }, { once: true });
    fuente.addEventListener('error', mostrarAviso, { once: true });
    video.load();
  }

  function montarVideo() {
    const config = datos.sitio.video || {};
    const id = config.youtube && idYoutube(config.youtube);
    if (id) {
      montarYoutube(id);
      return;
    }
    mostrarAviso();
    if (config.archivo) montarArchivo(config);
  }

  /** Pausa el video al salir de la portada. */
  function pausar() {
    const video = pantalla.querySelector('video');
    if (video) video.pause();
  }

  montarVideo();
  actualizar();

  window.Pagina.portada = Object.freeze({ actualizar, irAAstros, pausar });
})();
