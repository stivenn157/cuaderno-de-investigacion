/*
 * Estrellas: se dibujan con box-shadow (una sola vez por tamaño de pantalla)
 * y titilan con opacidad, que es barata de animar.
 */
(function () {
  'use strict';

  const CANTIDAD = { 'estrellas--1': 90, 'estrellas--2': 45, 'estrellas--3': 18 };
  const COLORES = ['#ECE5D6', '#FFFFFF', '#E4C88A', '#C9D3F2'];

  function sombras(cantidad, ancho, alto) {
    const lista = [];
    for (let i = 0; i < cantidad; i += 1) {
      const x = Math.round(Math.random() * ancho);
      // más estrellas arriba que cerca del horizonte
      const y = Math.round(Math.pow(Math.random(), 1.4) * alto);
      const color = COLORES[i % COLORES.length];
      lista.push(`${x}px ${y}px ${color}`);
    }
    return lista.join(',');
  }

  function pintar() {
    document.querySelectorAll('.estrellas').forEach((capa) => {
      const contenedor = capa.parentElement;
      const fijo = contenedor.classList.contains('firmamento');
      const ancho = fijo ? window.innerWidth : contenedor.offsetWidth;
      const alto = fijo ? window.innerHeight : contenedor.offsetHeight;
      const clase = Object.keys(CANTIDAD).find((c) => capa.classList.contains(c));
      const cantidad = Math.round(CANTIDAD[clase] * Math.min(1, ancho / 1200) + 10);
      capa.style.setProperty('--estrellas', sombras(cantidad, ancho, alto));
    });
  }

  function moverFugaz() {
    const fugaz = document.querySelector('.fugaz');
    if (!fugaz) return;
    fugaz.addEventListener('animationiteration', () => {
      fugaz.style.setProperty('--fx', `${35 + Math.random() * 55}%`);
      fugaz.style.setProperty('--fy', `${5 + Math.random() * 30}%`);
    });
  }

  let espera;
  let anchoPrevio = window.innerWidth;
  window.addEventListener('resize', () => {
    // en celulares la barra del navegador cambia el alto; solo repintamos si cambia el ancho
    if (Math.abs(window.innerWidth - anchoPrevio) < 80) return;
    anchoPrevio = window.innerWidth;
    clearTimeout(espera);
    espera = setTimeout(pintar, 250);
  });

  window.Pagina = window.Pagina || {};
  window.Pagina.cielo = Object.freeze({ pintar });

  pintar();
  moverFugaz();
})();
