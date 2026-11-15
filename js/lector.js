/*
 * Lector de resúmenes: muestra el resumen de un tema o de un caso práctico,
 * arma el índice, la barra de progreso y las apariciones al hacer scroll,
 * y carga las animaciones propias del documento del que sale el resumen.
 */
(function () {
  'use strict';

  const { datos, secciones, util } = window.Pagina;
  const { escapar, formatoFecha, dosDigitos } = util;
  const PALABRAS_POR_MINUTO = 200;
  const NOMBRE = { temas: 'Tema', casos: 'Caso práctico' };
  const SECCION = { temas: 'Temas', casos: 'Casos prácticos' };

  window.Efectos = window.Efectos || {};
  window.Resumenes = window.Resumenes || {};

  /* ---------- Plantilla ---------- */

  function vecinoHtml(materia, seccion, entrada, numero, rotulo, clase) {
    if (!entrada) return '<span></span>';
    return `
      <a class="vecino ${clase}" href="#/${materia.id}/${seccion}/${entrada.id}">
        <span class="ceja">${rotulo}</span>
        <span class="vecino__titulo">${NOMBRE[seccion]} ${dosDigitos(numero)}: ${escapar(entrada.titulo)}</span>
      </a>`;
  }

  /** Bloque bajo la cabecera: "Lo esencial" en los temas y los tres pasos en los casos. */
  function bloqueClave(seccion, entrada) {
    if (seccion === 'casos') {
      const pasos = window.Pagina.vistas.PASOS.map(([clave, nombre], i) => `
        <li class="caso-paso revelar" style="--retraso: ${i * 120}ms">
          <button type="button" class="caso-paso__boton" data-ir="p${i + 1}">
            <span class="caso-paso__n">0${i + 1}</span>
            <strong>${nombre}</strong>
            <span>${escapar(entrada.pasos[clave])}</span>
            <span class="caso-paso__ir">Ir a esta parte ↓</span>
          </button>
        </li>`).join('');
      return `
        <section class="clave" aria-labelledby="clave-titulo">
          <h2 id="clave-titulo" class="ceja clave__titulo">El caso en tres pasos</h2>
          <ol class="caso-pasos caso-pasos--grande">${pasos}</ol>
        </section>`;
    }
    const puntos = entrada.esencial.map((t, i) => `
      <li class="esencial__punto revelar" style="--retraso: ${i * 100}ms">
        <span class="esencial__n">0${i + 1}</span><p>${escapar(t)}</p>
      </li>`).join('');
    return `
      <section class="clave" aria-labelledby="clave-titulo">
        <h2 id="clave-titulo" class="ceja clave__titulo">Lo esencial</h2>
        <ol class="esencial">${puntos}</ol>
      </section>`;
  }

  function plantilla({ materia, seccion, entrada, indice }) {
    const doc = window.Pagina.vistas.documentoDe(materia, entrada.documento);
    const autores = [datos.sitio.autor, ...doc.coautores].map(escapar).join('<br>');
    const lista = secciones[materia.id][seccion];
    const descarga = window.Pagina.vistas.enlaceDescarga(materia, doc);
    const sub = seccion === 'casos' ? escapar(entrada.empresa) : entrada.etiquetas.map(escapar).join(' · ');
    return `
      <div class="lector lector--especial lector--${seccion}">
        <div class="progreso" aria-hidden="true"><span class="progreso__barra"></span></div>

        <nav class="migas lector__migas" aria-label="Ruta">
          <a href="#/${materia.id}/${seccion}"><span class="flecha" aria-hidden="true">←</span> Volver a ${SECCION[seccion]}</a>
        </nav>

        <header class="lector__cabecera">
          <p class="ceja">${NOMBRE[seccion]} ${dosDigitos(indice + 1)} · ${escapar(materia.nombre)}</p>
          <p class="lector__tipo">${sub}</p>
          <h1 class="lector__titulo">${escapar(entrada.titulo)}</h1>
          <p class="lector__resumen">${escapar(entrada.resumen)}</p>
          <dl class="lector__meta">
            <div><dt>Autores</dt><dd>${autores}</dd></div>
            <div><dt>Docente</dt><dd>${escapar(datos.sitio.docente)}</dd></div>
            <div><dt>Fuente</dt><dd>${escapar(doc.tipo)}<br><time datetime="${doc.fecha}">${formatoFecha(doc.fecha)}</time></dd></div>
            <div><dt>Lectura</dt><dd class="lector__minutos">…</dd></div>
          </dl>
          <a class="boton lector__descarga" href="${descarga}" download>
            <span aria-hidden="true">↓</span> Descargar el documento completo (.docx)
          </a>
        </header>

        ${bloqueClave(seccion, entrada)}

        <div class="lector__cuerpo">
          <aside class="lector__indice" id="hoja-indice" aria-label="Índice del resumen">
            <div class="hoja__barra"><p class="ceja">Índice</p><button type="button" class="hoja__cerrar" data-cerrar>Cerrar</button></div>
            <ol class="indice"></ol>
          </aside>
          <div class="prosa" aria-busy="true">
            <p class="lector__cargando">Abriendo el resumen…</p>
          </div>
          <aside class="lector__panel" id="hoja-panel" aria-label="Elementos visuales del resumen"></aside>
        </div>

        <aside class="lector__cierre">
          <p>¿Quieres leer el trabajo completo, con todas sus citas y referencias?</p>
          <a class="boton boton--lleno" href="${descarga}" download><span aria-hidden="true">↓</span> Descargar ${escapar(doc.tipo)} (.docx)</a>
        </aside>

        <nav class="lector__vecinos" aria-label="Otros ${SECCION[seccion].toLowerCase()}">
          ${vecinoHtml(materia, seccion, lista[indice - 1], indice, '← Anterior', 'vecino--anterior')}
          ${vecinoHtml(materia, seccion, lista[indice + 1], indice + 2, 'Siguiente →', 'vecino--siguiente')}
        </nav>

        <!-- Celulares y tablets: el índice y el panel se abren desde esta barra -->
        <div class="dock" role="toolbar" aria-label="Herramientas de lectura">
          <button type="button" class="dock__boton dock__boton--indice" data-hoja="indice" aria-controls="hoja-indice" aria-expanded="false">
            <span class="dock__icono" aria-hidden="true"><i></i><i></i><i></i></span> Índice
          </button>
          <button type="button" class="dock__boton dock__boton--panel" data-hoja="panel" aria-controls="hoja-panel" aria-expanded="false">
            <span class="dock__led" aria-hidden="true"></span><span class="dock__estado">Panel</span>
            <span class="dock__flecha" aria-hidden="true">↑</span>
          </button>
        </div>
        <div class="hoja__fondo" data-cerrar aria-hidden="true"></div>
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

  async function iniciarEfectos(clave, raiz, prosa) {
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
      // Sin animaciones el resumen se sigue leyendo con normalidad
      console.warn('Animaciones no disponibles para', clave, error);
      return () => {};
    }
  }

  /** Los tres pasos del caso llevan a su parte del resumen. */
  function irAPartes(raiz) {
    const alClic = (e) => {
      const boton = e.target.closest('.clave [data-ir]');
      if (!boton) return;
      const destino = raiz.querySelector(`#${boton.dataset.ir}`);
      if (destino) destino.scrollIntoView({ behavior: util.movimientoReducido() ? 'auto' : 'smooth', block: 'start' });
    };
    raiz.addEventListener('click', alClic);
    return () => raiz.removeEventListener('click', alClic);
  }

  /* ---------- API ---------- */

  async function mostrar(contenedor, ruta) {
    const { materia, seccion, entrada } = ruta;
    const clave = `${materia.id}/${seccion}/${entrada.id}`;
    const limpiezas = [];
    let activo = true;

    contenedor.innerHTML = plantilla(ruta);
    const raiz = contenedor.querySelector('.lector');
    const prosa = raiz.querySelector('.prosa');

    // El título principal entra palabra por palabra
    const titulo = raiz.querySelector('.lector__titulo');
    util.partirPalabras(titulo);
    requestAnimationFrame(() => requestAnimationFrame(() => titulo.classList.add('titulo-visible')));
    limpiezas.push(util.alAparecer([...raiz.querySelectorAll('.clave .revelar')], (b) => b.classList.add('is-visible')));

    const limpiar = () => {
      activo = false;
      limpiezas.forEach((fn) => fn());
    };

    try {
      await util.cargarScript(`js/resumenes/${clave}.js`);
    } catch (error) {
      prosa.innerHTML = '<p>No se pudo abrir este resumen. Puedes descargar el documento completo con el botón de arriba.</p>';
      prosa.removeAttribute('aria-busy');
      return limpiar;
    }
    if (!activo) return limpiar;

    prosa.innerHTML = window.Resumenes[clave] || '<p>Este resumen está vacío.</p>';
    prosa.removeAttribute('aria-busy');

    const palabras = prosa.textContent.trim().split(/\s+/).length;
    raiz.querySelector('.lector__minutos').textContent = `${Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO))} min`;

    prepararTitulos(prosa);
    limpiezas.push(construirIndice(raiz, prosa));
    limpiezas.push(seguirProgreso(raiz, prosa));
    limpiezas.push(irAPartes(raiz));

    const detener = await iniciarEfectos(entrada.efectos, raiz, prosa);
    if (!activo) {
      detener();
      return limpiar;
    }
    limpiezas.push(detener);

    // Se aplica al final para incluir los bloques que agregan los efectos
    limpiezas.push(revelarBloques(prosa));
    limpiezas.push(prepararHojas(raiz));
    return limpiar;
  }

  /* ---------- Celular y tablet: índice y panel como hojas deslizables ---------- */

  function prepararHojas(raiz) {
    const panel = raiz.querySelector('.lector__panel');
    const indice = raiz.querySelector('.lector__indice');
    const botones = [...raiz.querySelectorAll('.dock__boton')];
    const estadoDock = raiz.querySelector('.dock__estado');
    const ledDock = raiz.querySelector('.dock__led');

    const sinIndice = indice.hidden;
    const sinPanel = panel.hidden || !panel.firstElementChild;
    raiz.querySelector('.dock__boton--indice').hidden = sinIndice;
    raiz.querySelector('.dock__boton--panel').hidden = sinPanel;
    raiz.querySelector('.dock').hidden = sinIndice && sinPanel;

    if (!sinPanel) {
      panel.insertAdjacentHTML('afterbegin',
        '<div class="hoja__barra"><p class="ceja">Panel del documento</p><button type="button" class="hoja__cerrar" data-cerrar>Cerrar</button></div>');
    }

    let abierta = '';
    const marcar = (nombre) => {
      abierta = nombre;
      raiz.dataset.hoja = nombre;
      botones.forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.hoja === nombre)));
    };

    const alClic = (evento) => {
      const boton = evento.target.closest('[data-hoja]');
      if (boton) {
        marcar(abierta === boton.dataset.hoja ? '' : boton.dataset.hoja);
        return;
      }
      // Cerrar con el botón, el fondo o al elegir un título del índice
      if (evento.target.closest('[data-cerrar]') || (abierta === 'indice' && evento.target.closest('[data-ir]'))) marcar('');
    };
    const alTecla = (evento) => {
      if (evento.key === 'Escape' && abierta) marcar('');
    };
    raiz.addEventListener('click', alClic);
    document.addEventListener('keydown', alTecla);

    // La barra muestra en vivo el estado del panel (por ejemplo, "Intrusión detectada")
    const fuente = panel.querySelector('.fx-panel__estado, .ac-monitor__estado');
    const cabeza = panel.querySelector('.fx-panel__cabeza, .ac-monitor__cabeza');
    const luz = panel.querySelector('.fx-led, .ac-led');
    let reloj;
    const copiar = () => {
      if (fuente) estadoDock.textContent = fuente.textContent.trim();
      else if (cabeza) estadoDock.textContent = cabeza.textContent.trim();
      if (luz) ledDock.style.background = getComputedStyle(luz).backgroundColor;
    };
    copiar();
    const observador = new MutationObserver(() => {
      copiar();
      clearTimeout(reloj);
      reloj = setTimeout(copiar, 650); // el color del LED cambia con una transición
    });
    if (fuente) observador.observe(fuente, { childList: true, characterData: true, subtree: true });

    return () => {
      observador.disconnect();
      clearTimeout(reloj);
      document.removeEventListener('keydown', alTecla);
    };
  }

  window.Pagina.lector = Object.freeze({ mostrar });
})();
