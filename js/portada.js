/*
 * Portada:
 *  - Escena del sol y la luna controlada por el scroll (funciona al bajar y al subir).
 *  - Video de presentación (archivo local o YouTube), cargado sin frenar la página.
 */
(function () {
  'use strict';

  const { util } = window.Pagina;
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

  /* ---------- Video de presentación (módulo compartido: js/video.js) ---------- */

  /** Pausa el video al salir de la portada. */
  function pausar() {
    window.Pagina.video.pausar(pantalla);
  }

  window.Pagina.video.montar(pantalla);
  actualizar();

  window.Pagina.portada = Object.freeze({ actualizar, irAAstros, pausar });
})();
