/*
 * Video de presentación (uno solo para todo el sitio).
 * Se configura en js/datos.js -> sitio.video (archivo local o enlace de YouTube)
 * y se puede montar en cualquier pantalla: la portada y "Proyecto - Video Tutorial".
 */
(function () {
  'use strict';

  const { datos } = window.Pagina;
  const ICONO_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>';

  function idYoutube(enlace) {
    const coincide = String(enlace).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return coincide ? coincide[1] : null;
  }

  function mostrarAviso(pantalla) {
    pantalla.innerHTML = `
      <div class="presentacion__vacio">
        <span class="presentacion__play">${ICONO_PLAY}</span>
        <p class="presentacion__aviso">El video de presentación estará aquí muy pronto</p>
      </div>`;
  }

  function montarYoutube(pantalla, id) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'presentacion__portada';
    // Miniatura grande (1280×720) encima de la pequeña, que queda de respaldo si la grande no existe
    boton.style.backgroundImage = `url("https://i.ytimg.com/vi/${id}/maxresdefault.jpg"), url("https://i.ytimg.com/vi/${id}/hqdefault.jpg")`;
    boton.setAttribute('aria-label', 'Reproducir el video de presentación');
    boton.innerHTML = `<span class="presentacion__play">${ICONO_PLAY}</span>`;
    // El reproductor de YouTube solo se carga cuando la persona pulsa: la página sigue liviana
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

  function montarArchivo(pantalla, config) {
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
    fuente.addEventListener('error', () => mostrarAviso(pantalla), { once: true });
    video.load();
  }

  /** Monta el video del sitio dentro de un elemento .presentacion__pantalla. */
  function montar(pantalla) {
    if (!pantalla) return;
    const config = datos.sitio.video || {};
    const id = config.youtube && idYoutube(config.youtube);
    if (id) {
      montarYoutube(pantalla, id);
      return;
    }
    mostrarAviso(pantalla);
    if (config.archivo) montarArchivo(pantalla, config);
  }

  /** Pausa los videos que haya dentro de un contenedor. */
  function pausar(contenedor) {
    (contenedor || document).querySelectorAll('video').forEach((v) => v.pause());
  }

  window.Pagina.video = Object.freeze({ montar, pausar });
})();
