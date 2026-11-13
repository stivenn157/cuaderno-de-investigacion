/*
 * Herramientas compartidas por los efectos de cada documento (window.Fx).
 * Se carga una sola vez, antes del archivo de efectos del documento.
 */
(function () {
  'use strict';

  const { escapar, alAparecer } = window.Pagina.util;
  const SIMBOLOS = '0123456789ABCDEF#$%&@<>/{}[]';

  /** Crea un elemento a partir de un fragmento HTML (con un solo nodo raíz). */
  function crear(html) {
    const plantilla = document.createElement('template');
    plantilla.innerHTML = html.trim();
    return plantilla.content.firstElementChild;
  }

  function titulos(prosa) {
    return [...prosa.querySelectorAll('h2, h3')];
  }

  /** Primer título (h2/h3) cuyo texto cumple el patrón. */
  function buscarTitulo(prosa, patron) {
    return titulos(prosa).find((h) => patron.test(h.textContent)) || null;
  }

  /** Primer párrafo directo de la prosa cuyo texto cumple el patrón. */
  function buscarParrafo(prosa, patron, desde) {
    const lista = [...prosa.querySelectorAll(':scope > p')];
    const inicio = desde ? lista.findIndex((p) => desde.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING) : 0;
    return lista.slice(Math.max(0, inicio)).find((p) => patron.test(p.textContent)) || null;
  }

  /** Inserta el nodo después del elemento ancla, o tras sus n hermanos siguientes. */
  function insertarDespues(ancla, nodo, saltos) {
    if (!ancla) return null;
    let destino = ancla;
    for (let i = 0; i < (saltos || 0) && destino.nextElementSibling; i += 1) {
      const sig = destino.nextElementSibling;
      if (sig.matches('h2, h3')) break;
      destino = sig;
    }
    destino.after(nodo);
    return nodo;
  }

  function aleatorio(texto) {
    return [...texto].map((c) => (c === ' ' ? c : SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)])).join('');
  }

  /* ---------- Animador: todo lo que use tiempo se cancela al salir ---------- */

  function animador(reducido) {
    const marcos = new Set();
    const relojes = new Set();

    function marco(fn) {
      const id = requestAnimationFrame((t) => { marcos.delete(id); fn(t); });
      marcos.add(id);
    }

    function esperar(ms, fn) {
      const id = setTimeout(() => { relojes.delete(id); fn(); }, reducido ? 0 : ms);
      relojes.add(id);
      return id;
    }

    function repetir(ms, fn) {
      if (reducido) return null;
      const id = setInterval(fn, ms);
      relojes.add(id);
      return id;
    }

    /** Ejecuta pasos en secuencia: [[retrasoMs, fn], ...] */
    function secuencia(pasos) {
      let acumulado = 0;
      pasos.forEach(([retraso, fn]) => {
        acumulado += retraso;
        esperar(acumulado, fn);
      });
    }

    function contar(elemento, desde, hasta, duracion, formato) {
      const dar = formato || ((n) => Math.round(n).toLocaleString('es-CO'));
      if (reducido) { elemento.textContent = dar(hasta); return; }
      const inicio = performance.now();
      const paso = (t) => {
        const avance = Math.min(1, (t - inicio) / duracion);
        const suave = 1 - Math.pow(1 - avance, 3);
        elemento.textContent = dar(desde + (hasta - desde) * suave);
        if (avance < 1) marco(paso);
      };
      marco(paso);
    }

    function descifrar(nodo, duracion) {
      const final = nodo.nodeValue;
      if (reducido || !final || !final.trim()) return;
      const inicio = performance.now();
      const paso = (t) => {
        const avance = Math.min(1, (t - inicio) / duracion);
        const revelados = Math.floor(avance * final.length);
        nodo.nodeValue = final.slice(0, revelados) + aleatorio(final.slice(revelados));
        if (avance < 1) marco(paso);
        else nodo.nodeValue = final;
      };
      marco(paso);
    }

    /** Escribe texto letra por letra en un elemento. Devuelve una función para cancelar. */
    function teclear(elemento, texto, velocidad, alTerminar) {
      if (reducido) {
        elemento.textContent = texto;
        if (alTerminar) alTerminar();
        return () => {};
      }
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        elemento.textContent = texto.slice(0, i);
        if (i >= texto.length) {
          clearInterval(id);
          relojes.delete(id);
          if (alTerminar) alTerminar();
        }
      }, velocidad || 35);
      relojes.add(id);
      return () => { clearInterval(id); relojes.delete(id); };
    }

    function detener() {
      marcos.forEach(cancelAnimationFrame);
      relojes.forEach((id) => { clearTimeout(id); clearInterval(id); });
      marcos.clear();
      relojes.clear();
    }

    return { marco, esperar, repetir, secuencia, contar, descifrar, teclear, detener, reducido };
  }

  /* ---------- Seguimiento del scroll ---------- */

  /**
   * Llama a alCambiar(indice) con el último elemento de la lista que ya pasó
   * por encima del límite (por defecto, el 45 % de la pantalla). -1 = ninguno.
   */
  function seguirSeccion(elementos, alCambiar, limite) {
    let actual = null;
    let pendiente = false;
    const revisar = () => {
      pendiente = false;
      const tope = window.innerHeight * (limite || 0.45);
      let indice = -1;
      elementos.forEach((el, i) => { if (el.getBoundingClientRect().top < tope) indice = i; });
      if (indice === actual) return;
      actual = indice;
      alCambiar(indice);
    };
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(revisar);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    revisar();
    return () => window.removeEventListener('scroll', alDesplazar);
  }

  /** Activa elementos (clase is-activa) al aparecer y llama a fn si se pasa. */
  function activarAlAparecer(elementos, fn, margen) {
    const lista = elementos.filter(Boolean);
    return alAparecer(lista, (el) => {
      el.classList.add('is-activa');
      if (fn) fn(el);
    }, { rootMargin: `0px 0px ${margen || '-25%'} 0px` });
  }

  /**
   * Títulos que aparecen palabra por palabra, subiendo desde una máscara,
   * mientras la línea dorada del título se dibuja.
   */
  function revelarTitulos(prosa) {
    const lista = titulos(prosa);
    lista.forEach((h) => window.Pagina.util.partirPalabras(h));
    return alAparecer(lista, (h) => h.classList.add('titulo-visible'), { rootMargin: '0px 0px -12% 0px' });
  }

  /** Nombre anterior, que usan los efectos de cada documento. */
  function descifrarTitulos(prosa) {
    return revelarTitulos(prosa);
  }

  /* ---------- Realces del texto ---------- */

  const COMANDO = /^[\w.:\\/ -]{2,48}$/;
  const TECLAS = /\b(Ctrl|Shift|Alt|Esc|Win|Enter|Supr|Tab)(\s*\+\s*(Ctrl|Shift|Alt|Esc|Win|Enter|Supr|Tab|[A-Z]))+\b/g;

  const COMANDOS_SUELTOS = new Set(['resmon', 'cleanmgr', 'msconfig', 'regedit', 'taskmgr', 'perfmon', 'ping', 'ipconfig', 'chkdsk', 'sfc', 'cmd', 'powershell', 'tasklist', 'systeminfo', 'msinfo32']);

  function pareceComando(texto) {
    if (!COMANDO.test(texto)) return false;
    return /[.\\/]/.test(texto) || COMANDOS_SUELTOS.has(texto.toLowerCase());
  }

  /**
   * Convierte en <code> los comandos entre comillas (“resmon”, “sfc /scannow”)
   * y en <kbd> las combinaciones de teclas (Ctrl + Shift + Esc).
   */
  function realzarComandos(prosa) {
    prosa.querySelectorAll(':scope > p').forEach((p) => {
      let html = p.innerHTML;
      html = html.replace(/[“"]([^”"<]{2,48})[”"]/g, (todo, dentro) => (
        pareceComando(dentro.trim()) ? `<code class="fx-codigo">${dentro.trim()}</code>` : todo
      ));
      // Comandos sin comillas: archivos .msc/.exe/.cpl/.sys y algunos comandos con opciones
      html = html.replace(
        /(?<!fx-codigo">)\b(?:[\w-]+\.(?:msc|exe|cpl|sys)|sfc \/scannow|chkdsk [A-Z]: \/\w+|perfmon \/\w+)\b(?!<\/code>)/g,
        (cmd) => `<code class="fx-codigo">${cmd}</code>`,
      );
      html = html.replace(TECLAS, (combo) => combo
        .split(/\s*\+\s*/)
        .map((t) => `<kbd class="fx-tecla">${t}</kbd>`)
        .join('<span class="fx-mas">+</span>'));
      if (html !== p.innerHTML) p.innerHTML = html;
    });
  }

  /**
   * Convierte el inicio "Paso 1 (título):" de cada párrafo en una etiqueta
   * con casilla que se marca al leerlo. Devuelve las etiquetas creadas.
   */
  function marcarPasos(prosa, patron) {
    const marcas = [];
    prosa.querySelectorAll(':scope > p').forEach((p) => {
      const coincide = p.innerHTML.match(patron);
      if (!coincide) return;
      p.innerHTML = p.innerHTML.replace(patron, (texto) => (
        `<span class="fx-paso"><span class="fx-paso__casilla" aria-hidden="true"></span>${texto.replace(/:\s*$/, '')}</span>`
      ));
      p.classList.add('fx-con-paso');
      marcas.push(p);
    });
    return marcas;
  }

  /**
   * Correo de ejemplo con señales de alerta que se resaltan al aparecer.
   * Las partes marcadas con [[texto]] se convierten en señales numeradas.
   */
  function correoHtml({ rotulo, titulo, de, asunto, cuerpo, enlace, senales }) {
    let n = 0;
    const marcar = (texto) => escapar(texto).replace(/\[\[(.+?)\]\]/g, (_, dentro) => {
      const i = n;
      n += 1;
      return `<span class="fx-senal" style="--i: ${i}">${dentro}</span>`;
    });
    return `
      <figure class="fx-figura fx-figura--correo">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">${escapar(rotulo)}</span>${escapar(titulo)}</figcaption>
        <div class="fx-correo">
          <dl class="fx-correo__cabeza"><dt>De</dt><dd>${marcar(de)}</dd><dt>Asunto</dt><dd>${marcar(asunto)}</dd></dl>
          <div class="fx-correo__cuerpo">${marcar(cuerpo)}<br><span class="fx-correo__enlace">${marcar(enlace)}</span></div>
        </div>
        <ul class="fx-senales">${senales.map((s, i) => `<li style="--i: ${i}">${escapar(s)}</li>`).join('')}</ul>
      </figure>`;
  }

  /** Coloca contenido en el panel lateral y devuelve su raíz. */
  function llenarPanel(panel, html) {
    panel.innerHTML = html;
    return panel.firstElementChild;
  }

  window.Fx = Object.freeze({
    escapar,
    alAparecer,
    crear,
    titulos,
    buscarTitulo,
    buscarParrafo,
    insertarDespues,
    aleatorio,
    animador,
    seguirSeccion,
    activarAlAparecer,
    descifrarTitulos,
    revelarTitulos,
    realzarComandos,
    marcarPasos,
    correoHtml,
    llenarPanel,
  });
})();
