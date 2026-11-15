/*
 * Diagramas interactivos de la sección Conceptos:
 *  - triada:  la triada CID (Línea de énfasis II)
 *  - estados: el ciclo de vida de un proceso (Sistemas operativos)
 * Se recorren solos y se detienen cuando la persona elige un elemento.
 */
(function () {
  'use strict';

  const { escapar, movimientoReducido } = window.Pagina.util;
  const INTERVALO = 3600;

  const TRIADA = [
    { id: 'c', nombre: 'Confidencialidad', x: 160, y: 46, texto: 'Solo las personas autorizadas ven la información.', ejemplo: 'Solo el área de finanzas accede a las cuentas bancarias.', caso: 'En Ecopetrol fue el pilar vulnerado: se copiaron archivos de la nube.' },
    { id: 'i', nombre: 'Integridad', x: 44, y: 226, texto: 'Los datos están completos, exactos y sin cambios no autorizados.', ejemplo: 'La información publicada de los gerentes debe ser la real.', caso: 'En Ecopetrol se salvó: no se alteró ningún registro original.' },
    { id: 'd', nombre: 'Disponibilidad', x: 276, y: 226, texto: 'La información está lista cuando un usuario autorizado la necesita.', ejemplo: 'Un plan de recuperación evita quedar sin servicio tras un corte de luz.', caso: 'En Ecopetrol resistió: el ransomware se bloqueó a tiempo.' },
  ];

  const ESTADOS = [
    { id: 'nuevo', nombre: 'Nuevo', x: 50, y: 60, texto: 'El proceso nace: el sistema carga su código en la RAM y le arma su ficha PCB.', ejemplo: 'Doble clic en el ícono del programa de facturación.' },
    { id: 'listo', nombre: 'Listo', x: 175, y: 60, texto: 'Tiene todo preparado y hace fila esperando que el planificador le dé la CPU.', ejemplo: 'Espera unos milisegundos su turno.' },
    { id: 'ejecucion', nombre: 'En ejecución', x: 300, y: 60, texto: 'Usa el procesador. Puede volver a Listo si se le acaba el turno.', ejemplo: 'Calcula los totales de la factura.' },
    { id: 'bloqueado', nombre: 'Bloqueado', x: 237, y: 190, texto: 'Espera una operación de entrada y salida y suelta la CPU para otro proceso.', ejemplo: 'Guarda la factura en PDF en el disco.' },
    { id: 'terminado', nombre: 'Terminado', x: 400, y: 190, texto: 'Terminó su trabajo: el sistema libera su memoria y sus recursos.', ejemplo: 'El usuario cierra la ventana.' },
  ];
  // Recorrido de la animación automática (con un regreso de Bloqueado a Listo)
  const RECORRIDO = ['nuevo', 'listo', 'ejecucion', 'bloqueado', 'listo', 'ejecucion', 'terminado'];

  function botonesSvg(lista, radio) {
    return lista.map((n) => `
      <g class="dest-nodo" data-id="${n.id}" transform="translate(${n.x} ${n.y})" tabindex="0" role="button" aria-label="${escapar(n.nombre)}">
        <circle class="dest-nodo__onda" r="${radio + 6}" />
        <circle class="dest-nodo__punto" r="${radio}" />
        <text class="dest-nodo__nombre" y="${n.y < 120 ? -(radio + 12) : radio + 22}" text-anchor="middle">${escapar(n.nombre)}</text>
      </g>`).join('');
  }

  function plantillaTriada() {
    return `
      <div class="dest-diagrama">
        <svg viewBox="0 0 320 270" aria-hidden="true">
          <path class="dest-lado" pathLength="1" d="M160 46 L44 226 L276 226 Z" />
          <text class="dest-centro" x="160" y="168" text-anchor="middle">CID</text>
          ${botonesSvg(TRIADA, 11)}
        </svg>
      </div>`;
  }

  function plantillaEstados() {
    const flecha = (d) => `<path class="dest-arista" d="${d}" marker-end="url(#dest-flecha)" />`;
    return `
      <div class="dest-diagrama">
        <svg viewBox="0 0 450 250" aria-hidden="true">
          <defs><marker id="dest-flecha" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 Z" /></marker></defs>
          ${flecha('M72 60 H151')}
          ${flecha('M197 52 H276')}
          ${flecha('M276 70 H197')}
          ${flecha('M292 82 L251 170')}
          ${flecha('M222 170 L184 82')}
          ${flecha('M318 80 L387 172')}
          ${botonesSvg(ESTADOS, 20)}
          <circle class="dest-ficha" r="7" />
        </svg>
      </div>`;
  }

  function plantillaInfo(titulo, ceja) {
    return `
      <div class="dest-info" aria-live="polite">
        <p class="ceja">${ceja}</p>
        <h2 class="dest-info__titulo">${titulo}</h2>
        <p class="dest-info__nombre"></p>
        <p class="dest-info__texto"></p>
        <p class="dest-info__ejemplo"></p>
        <p class="dest-info__extra"></p>
        <p class="dest-info__ayuda">Toca un elemento del diagrama para explorarlo.</p>
      </div>`;
  }

  /**
   * Monta un diagrama interactivo. Devuelve una función que detiene su animación.
   */
  function montar(contenedor) {
    const tipo = contenedor.dataset.destacado;
    const esTriada = tipo === 'triada';
    const datos = esTriada ? TRIADA : ESTADOS;
    contenedor.innerHTML = `
      <div class="dest dest--${tipo}">
        ${esTriada ? plantillaTriada() : plantillaEstados()}
        ${plantillaInfo(esTriada ? 'La triada CID' : 'Ciclo de vida de un proceso', esTriada ? 'Los tres pilares de la seguridad' : 'Concepto en movimiento')}
      </div>`;

    const nodos = [...contenedor.querySelectorAll('.dest-nodo')];
    const ficha = contenedor.querySelector('.dest-ficha');
    const info = {
      nombre: contenedor.querySelector('.dest-info__nombre'),
      texto: contenedor.querySelector('.dest-info__texto'),
      ejemplo: contenedor.querySelector('.dest-info__ejemplo'),
      extra: contenedor.querySelector('.dest-info__extra'),
    };

    function elegir(id) {
      const n = datos.find((d) => d.id === id);
      if (!n) return;
      nodos.forEach((g) => g.classList.toggle('is-activo', g.dataset.id === id));
      if (ficha) ficha.setAttribute('transform', `translate(${n.x} ${n.y})`);
      info.nombre.textContent = n.nombre;
      info.texto.textContent = n.texto;
      info.ejemplo.textContent = `Ejemplo: ${n.ejemplo}`;
      info.extra.textContent = n.caso || '';
      info.extra.hidden = !n.caso;
      contenedor.querySelector('.dest').dataset.activo = id;
      // Reinicia la animación de entrada del texto en cada cambio
      const caja = contenedor.querySelector('.dest-info');
      caja.classList.remove('is-cambio');
      void caja.offsetWidth;
      caja.classList.add('is-cambio');
    }

    // Recorrido automático hasta que la persona interactúe
    const orden = esTriada ? datos.map((d) => d.id) : RECORRIDO;
    let paso = 0;
    let reloj = null;
    elegir(orden[0]);
    if (!movimientoReducido()) {
      reloj = setInterval(() => {
        paso = (paso + 1) % orden.length;
        elegir(orden[paso]);
      }, INTERVALO);
    }
    const detener = () => {
      clearInterval(reloj);
      reloj = null;
    };

    nodos.forEach((g) => {
      const accion = () => { detener(); elegir(g.dataset.id); };
      g.addEventListener('click', accion);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          accion();
        }
      });
    });

    return detener;
  }

  window.Pagina.destacados = Object.freeze({ montar });
})();
