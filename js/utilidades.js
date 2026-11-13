/* Funciones pequeñas compartidas por todos los scripts. */
(function () {
  'use strict';

  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const cargados = new Map();

  /** Escapa texto para insertarlo con seguridad dentro de HTML. */
  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** '2026-10-17' -> '17 oct 2026' */
  function formatoFecha(iso) {
    const [anio, mes, dia] = iso.split('-').map(Number);
    return `${dia} ${MESES[mes - 1]} ${anio}`;
  }

  /** 3 -> '03' */
  function dosDigitos(n) {
    return String(n).padStart(2, '0');
  }

  /**
   * Carga un script una sola vez. Funciona abriendo index.html directamente
   * (file://), donde fetch() de archivos locales no está permitido.
   */
  function cargarScript(src) {
    if (cargados.has(src)) return cargados.get(src);
    const promesa = new Promise((resolver, rechazar) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolver();
      s.onerror = () => rechazar(new Error(`No se pudo cargar ${src}`));
      document.head.appendChild(s);
    });
    cargados.set(src, promesa);
    promesa.catch(() => cargados.delete(src));
    return promesa;
  }

  function cargarEstilo(href) {
    if (cargados.has(href)) return cargados.get(href);
    const promesa = new Promise((resolver) => {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.onload = () => resolver();
      l.onerror = () => resolver(); // sin estilos extra la página sigue funcionando
      document.head.appendChild(l);
    });
    cargados.set(href, promesa);
    return promesa;
  }

  const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
  function movimientoReducido() {
    return consulta.matches;
  }

  /** Observa elementos y llama a alEntrar una sola vez cuando aparecen. Devuelve una función para detener. */
  function alAparecer(elementos, alEntrar, opciones) {
    if (!('IntersectionObserver' in window)) {
      elementos.forEach((el) => alEntrar(el));
      return () => {};
    }
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        observador.unobserve(entrada.target);
        alEntrar(entrada.target);
      });
    }, opciones || { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }

  /**
   * Envuelve cada palabra de los nodos de texto de un título en
   * <span class="palabra"><span>…</span></span> para animarlas una por una.
   * Respeta los elementos internos (por ejemplo, "Parte I") y no cambia el texto.
   */
  function partirPalabras(elemento) {
    if (elemento.dataset.partido) return;
    elemento.dataset.partido = '1';
    let indice = 0;
    const textos = [];
    const recorrer = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
    while (recorrer.nextNode()) textos.push(recorrer.currentNode);
    textos.forEach((nodo) => {
      const trozos = nodo.nodeValue.split(/(\s+)/);
      const fragmento = document.createDocumentFragment();
      trozos.forEach((trozo) => {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) {
          fragmento.append(document.createTextNode(' '));
          return;
        }
        const exterior = document.createElement('span');
        exterior.className = 'palabra';
        const interior = document.createElement('span');
        interior.textContent = trozo;
        interior.style.setProperty('--p', String(indice));
        indice += 1;
        exterior.append(interior);
        fragmento.append(exterior);
      });
      nodo.replaceWith(fragmento);
    });
  }

  window.Pagina = window.Pagina || {};
  window.Pagina.util = Object.freeze({
    partirPalabras,
    escapar,
    formatoFecha,
    dosDigitos,
    cargarScript,
    cargarEstilo,
    movimientoReducido,
    alAparecer,
  });
})();
