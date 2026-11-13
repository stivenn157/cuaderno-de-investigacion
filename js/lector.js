/*
 * Lector de documentos: carga el contenido convertido del Word, arma el índice,
 * la barra de progreso y las apariciones al hacer scroll. Si el documento tiene
 * efectos propios (datos.js -> efectos: true) también los carga, solo para él.
 */
(function () {
  'use strict';

  const { datos, util } = window.Pagina;
  const { escapar, formatoFecha, dosDigitos } = util;
  const PALABRAS_POR_MINUTO = 200;

  window.Efectos = window.Efectos || {};

  /* ---------- Plantilla ---------- */

  function vecinoHtml(materia, doc, rotulo, clase) {
    if (!doc) return '<span></span>';
    return `
      <a class="vecino ${clase}" href="#/${materia.id}/${doc.id}">
        <span class="ceja">${rotulo}</span>
        <span class="vecino__titulo">${escapar(doc.tipo)}: ${escapar(doc.titulo)}</span>
      </a>`;
  }

  function plantilla(materia, doc, indice) {
    const autores = [datos.sitio.autor, ...doc.coautores].map(escapar).join('<br>');
    const docs = materia.documentos;
    const ruta = `documentos/${materia.id}/${encodeURIComponent(doc.archivo)}`;
    return `
      <div class="lector${doc.efectos ? ' lector--especial' : ''}">
        <div class="progreso" aria-hidden="true"><span class="progreso__barra"></span></div>

        <nav class="migas lector__migas" aria-label="Ruta">
          <a href="#/">Cielo</a>
          <span aria-hidden="true">/</span>
          <a href="#/${materia.id}"><span class="flecha" aria-hidden="true">←</span> ${escapar(materia.nombre)}</a>
        </nav>

        <header class="lector__cabecera">
          <p class="ceja">${escapar(materia.nombre)} · Ficha N.º ${dosDigitos(indice + 1)}</p>
          <p class="lector__tipo">${escapar(doc.tipo)}</p>
          <h1 class="lector__titulo">${escapar(doc.titulo)}</h1>
          <p class="lector__resumen">${escapar(doc.resumen)}</p>
          <dl class="lector__meta">
            <div><dt>Autores</dt><dd>${autores}</dd></div>
            <div><dt>Docente</dt><dd>${escapar(datos.sitio.docente)}</dd></div>
            <div><dt>Fecha</dt><dd><time datetime="${doc.fecha}">${formatoFecha(doc.fecha)}</time></dd></div>
            <div><dt>Lectura</dt><dd class="lector__minutos">…</dd></div>
          </dl>
          <a class="boton lector__descarga" href="${ruta}" download>
            <span aria-hidden="true">↓</span> Descargar el original (.docx)
          </a>
        </header>

        <div class="lector__cuerpo">
          <aside class="lector__indice" aria-label="Índice del documento">
            <p class="ceja">Índice</p>
            <ol class="indice"></ol>
          </aside>
          <div class="prosa" aria-busy="true">
            <p class="lector__cargando">Abriendo el documento…</p>
          </div>
          <aside class="lector__panel" aria-label="Elementos visuales del documento"></aside>
        </div>

        <nav class="lector__vecinos" aria-label="Otros documentos">
          ${vecinoHtml(materia, docs[indice - 1], '← Anterior', 'vecino--anterior')}
          ${vecinoHtml(materia, docs[indice + 1], 'Siguiente →', 'vecino--siguiente')}
        </nav>
      </div>`;
  }

  /* ---------- Preparación del contenido ---------- */

  function enFrase(texto) {
    const minus = texto.toLocaleLowerCase('es');
    return minus.charAt(0).toLocaleUpperCase('es') + minus.slice(1);
  }

  function prepararTitulos(prosa) {
    prosa.querySelectorAll('h2').forEach((h2) => {
      const texto = h2.textContent.trim();
      const parte = texto.match(/^PARTE\s+([IVX]+)\s*[-–.:]\s*(.+)$/i);
      if (parte) {
        h2.dataset.parte = parte[1].toUpperCase();
        h2.innerHTML = `<span class="titulo-parte">Parte ${parte[1].toUpperCase()}</span>${escapar(enFrase(parte[2]))}`;
      } else if (texto === texto.toUpperCase()) {
        h2.textContent = enFrase(texto);
      }
    });
    prosa.querySelectorAll('h3').forEach((h3) => {
      h3.textContent = h3.textContent.trim().replace(/\.$/, '');
    });
    const primero = prosa.querySelector(':scope > p');
    if (primero) primero.classList.add('capitular');
  }

  function construirIndice(raiz, prosa) {
    const lista = raiz.querySelector('.indice');
    const titulos = [...prosa.querySelectorAll('h2, h3')];
    if (titulos.length < 3) {
      raiz.querySelector('.lector__indice').hidden = true;
      return () => {};
    }

    lista.innerHTML = titulos
      .map((t) => {
        const nivel = t.tagName === 'H2' ? 'indice__parte' : 'indice__punto';
        const texto = t.dataset.parte ? `Parte ${t.dataset.parte}` : t.textContent;
        return `<li class="${nivel}"><button type="button" data-ir="${escapar(t.id)}">${escapar(texto)}</button></li>`;
      })
      .join('');

    const alClic = (e) => {
      const boton = e.target.closest('[data-ir]');
      if (!boton) return;
      const destino = document.getElementById(boton.dataset.ir);
      if (destino) destino.scrollIntoView({ behavior: util.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
    };
    lista.addEventListener('click', alClic);

    // Marca en el índice el último título que ya pasó por el tercio superior de la pantalla
    const contenedor = raiz.querySelector('.lector__indice');
    const botones = [...lista.querySelectorAll('[data-ir]')];
    let actual = null;
    let pendiente = false;
    const marcar = () => {
      pendiente = false;
      const limite = window.innerHeight * 0.3;
      let indice = -1;
      titulos.forEach((t, i) => { if (t.getBoundingClientRect().top < limite) indice = i; });
      const boton = botones[indice] || null;
      if (boton === actual) return;
      if (actual) actual.classList.remove('is-actual');
      actual = boton;
      if (!boton) return;
      boton.classList.add('is-actual');
      const arriba = boton.offsetTop - contenedor.clientHeight / 2;
      contenedor.scrollTo({ top: Math.max(0, arriba), behavior: 'auto' });
    };
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(marcar);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    marcar();

    return () => {
      window.removeEventListener('scroll', alDesplazar);
      lista.removeEventListener('click', alClic);
    };
  }

  function seguirProgreso(raiz, prosa) {
    const barra = raiz.querySelector('.progreso__barra');
    let pendiente = false;
    const actualizar = () => {
      pendiente = false;
      const inicio = prosa.offsetTop;
      const recorrido = prosa.offsetHeight - window.innerHeight * 0.6;
      const avance = Math.min(1, Math.max(0, (window.scrollY - inicio + window.innerHeight * 0.3) / recorrido));
      barra.style.transform = `scaleX(${avance})`;
    };
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    actualizar();
    return () => window.removeEventListener('scroll', alDesplazar);
  }

  function revelarBloques(prosa) {
    const bloques = [...prosa.children];
    bloques.forEach((b) => b.classList.add('revelar'));
    return util.alAparecer(bloques, (b) => b.classList.add('is-visible'));
  }

  async function iniciarEfectos(materia, doc, raiz, prosa) {
    const clave = `${materia.id}/${doc.id}`;
    try {
      await Promise.all([util.cargarEstilo('css/efectos/comun.css'), util.cargarScript('js/efectos/comun.js')]);
      await Promise.all([
        util.cargarEstilo(`css/efectos/${clave}.css`),
        util.cargarScript(`js/efectos/${clave}.js`),
      ]);
      const efecto = window.Efectos[clave];
      if (!efecto) return () => {};
      const detener = efecto.iniciar({
        raiz,
        prosa,
        panel: raiz.querySelector('.lector__panel'),
        reducido: util.movimientoReducido(),
      });
      return typeof detener === 'function' ? detener : () => {};
    } catch (error) {
      // Sin efectos el documento se sigue leyendo con normalidad
      console.warn('Efectos no disponibles para', clave, error);
      return () => {};
    }
  }

  /* ---------- API ---------- */

  async function mostrar(contenedor, materia, indice) {
    const doc = materia.documentos[indice];
    const clave = `${materia.id}/${doc.id}`;
    const limpiezas = [];
    let activo = true;

    contenedor.innerHTML = plantilla(materia, doc, indice);
    const raiz = contenedor.querySelector('.lector');
    const prosa = raiz.querySelector('.prosa');

    // El título principal entra palabra por palabra
    const titulo = raiz.querySelector('.lector__titulo');
    util.partirPalabras(titulo);
    requestAnimationFrame(() => requestAnimationFrame(() => titulo.classList.add('titulo-visible')));

    const limpiar = () => {
      activo = false;
      limpiezas.forEach((fn) => fn());
    };

    try {
      await util.cargarScript(`js/contenido/${clave}.js`);
    } catch (error) {
      prosa.innerHTML = `<p>No se pudo abrir el contenido de este documento. Puedes <a href="documentos/${materia.id}/${encodeURIComponent(doc.archivo)}" download>descargar el archivo original</a>.</p>`;
      prosa.removeAttribute('aria-busy');
      return limpiar;
    }
    if (!activo) return limpiar;

    prosa.innerHTML = (window.Contenido && window.Contenido[clave]) || '<p>Este documento está vacío.</p>';
    prosa.removeAttribute('aria-busy');

    const palabras = prosa.textContent.trim().split(/\s+/).length;
    raiz.querySelector('.lector__minutos').textContent = `${Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO))} min`;

    prepararTitulos(prosa);
    limpiezas.push(construirIndice(raiz, prosa));
    limpiezas.push(seguirProgreso(raiz, prosa));

    if (doc.efectos) {
      const detener = await iniciarEfectos(materia, doc, raiz, prosa);
      if (!activo) {
        detener();
        return limpiar;
      }
      limpiezas.push(detener);
    } else {
      raiz.querySelector('.lector__panel').hidden = true;
    }

    // Se aplica al final para incluir los bloques que agregan los efectos
    limpiezas.push(revelarBloques(prosa));
    return limpiar;
  }

  window.Pagina.lector = Object.freeze({ mostrar });
})();
