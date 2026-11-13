/*
 * Efectos de "Taller práctico 4: Caso MULTISERVICIOS S.A.".
 *  - Red lateral: de un servidor único saturado a una red distribuida.
 *  - Antes y después: centralizado frente a distribuido.
 *  - Recorrido de una consulta por las tres capas (balanceador incluido).
 *  - Un pedido viaja como mensaje JSON entre los módulos.
 *  - Pago síncrono en caja frente a avisos asíncronos en cola.
 *  - Replicación con bitácora y cambio de servidor principal.
 *  - Archivo copiado en tres servidores y carpetas por rol (RBAC).
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/taller-practico-4';
  const Fx = window.Fx;

  const ACTIVIDADES = ['Concepto distribuido', 'Cliente-servidor', 'Comunicación', 'Modelos de comunicación', 'Tolerancia a fallos', 'Archivos distribuidos'];

  // Ciudades alrededor del centro (viewBox 220 x 170)
  const SEDES = [[40, 30], [180, 30], [180, 140], [40, 140]];

  const RECORRIDO = ['cliente', 'balanceador', 'app', 'bd', 'replica', 'cliente'];

  const ROLES = {
    vendedor: ['Ventas'],
    bodeguero: ['Bodega'],
    contador: ['Contabilidad', 'Ventas'],
    gerente: ['Ventas', 'Bodega', 'Contabilidad', 'Gerencia'],
  };
  const CARPETAS = ['Ventas', 'Bodega', 'Contabilidad', 'Gerencia'];

  /* ---------- Plantillas ---------- */

  function panelHtml() {
    const lineasCentro = SEDES.map(([x, y]) => `<line class="m4-linea m4-linea--centro" x1="110" y1="85" x2="${x}" y2="${y}" />`).join('');
    const lineasMalla = SEDES.map(([x, y], i) => {
      const [x2, y2] = SEDES[(i + 1) % SEDES.length];
      return `<line class="m4-linea m4-linea--malla" x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" />`;
    }).join('');
    const sedes = SEDES.map(([x, y], i) => `<g class="m4-sede" transform="translate(${x} ${y})"><rect x="-17" y="-11" width="34" height="22" rx="3" /><text y="4" text-anchor="middle">Sede ${i + 1}</text></g>`).join('');
    return `
      <div class="fx-panel m4-panel" data-modo="centralizado">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Red MULTISERVICIOS</p>
        <p class="fx-panel__estado">Un solo servidor saturado</p>
        <svg class="m4-red" viewBox="0 0 220 170" aria-hidden="true">
          ${lineasCentro}${lineasMalla}
          <g class="m4-centro" transform="translate(110 85)"><circle r="16" /><text y="4" text-anchor="middle">Central</text></g>
          ${sedes}
        </svg>
        <dl class="m4-datos">
          <div><dt>Empleados</dt><dd>350</dd></div>
          <div><dt>Sedes</dt><dd class="m4-datos__sedes">4</dd></div>
        </dl>
        <ol class="fx-lista">${ACTIVIDADES.map((a) => `<li>${a}</li>`).join('')}</ol>
      </div>`;
  }

  function antesHtml() {
    return `
      <figure class="fx-figura m4-antes" data-modo="centralizado">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Antes y después</span>350 empleados en cuatro ciudades, un solo servidor</figcaption>
        <div class="tt-gantt__botones" role="group" aria-label="Modelo">
          <button type="button" class="fx-boton" data-modo="centralizado" aria-pressed="true">Centralizado</button>
          <button type="button" class="fx-boton" data-modo="distribuido" aria-pressed="false">Distribuido</button>
        </div>
        <div class="m4-antes__servidores">
          ${[1, 2, 3, 4].map((n) => `<div class="m4-antes__srv" style="--i: ${n - 1}"><span class="m4-antes__nombre">${n === 1 ? 'Sede principal' : `Ciudad ${n}`}</span><span class="fx-barra"><span></span></span><span class="m4-antes__carga"></span></div>`).join('')}
        </div>
        <p class="fx-nota m4-antes__nota">Todo pasa por la sede principal: un solo punto de falla.</p>
      </figure>`;
  }

  function capasHtml() {
    return `
      <figure class="fx-figura m4-capas">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Tres capas</span>El camino de una consulta</figcaption>
        <div class="m4-capa"><span class="m4-capa__n">Capa 1</span><span class="m4-nodo" data-nodo="cliente">Empleado · navegador</span></div>
        <div class="m4-capa"><span class="m4-capa__n">Capa 2</span><span class="m4-nodo" data-nodo="balanceador">Balanceador</span><span class="m4-nodo" data-nodo="app" data-app="0">App 1 <small>0</small></span><span class="m4-nodo" data-nodo="app" data-app="1">App 2 <small>0</small></span></div>
        <div class="m4-capa"><span class="m4-capa__n">Capa 3</span><span class="m4-nodo" data-nodo="bd">Base de datos principal</span><span class="m4-nodo" data-nodo="replica">Réplica</span></div>
        <p class="fx-nota m4-capas__paso" aria-live="polite">El balanceador elige el servidor con más espacio libre.</p>
      </figure>`;
  }

  function jsonHtml() {
    return `
      <figure class="fx-figura m4-json">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">API REST · HTTPS · JSON</span>Un pedido que cierra un vendedor, convertido en mensaje</figcaption>
        <pre class="m4-json__codigo" aria-label="Mensaje de ejemplo en formato JSON"><code></code></pre>
        <ol class="fx-cadena m4-json__ruta">
          <li style="--i: 0">Ventas envía el pedido</li>
          <li style="--i: 1">Inventario descuenta las unidades</li>
          <li style="--i: 2">Facturación genera la factura</li>
          <li style="--i: 3">Clientes actualiza el historial</li>
        </ol>
        <p class="fx-nota">Mensaje ilustrativo. Si una ciudad pierde conexión, RabbitMQ guarda los avisos en espera.</p>
      </figure>`;
  }

  function modelosHtml() {
    return `
      <figure class="fx-figura m4-modelos">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Dos formas de comunicarse</span>Lo urgente espera respuesta; lo demás va a la cola</figcaption>
        <div class="m4-carril">
          <span class="m4-carril__rotulo">Pago en caja · síncrono</span>
          <div class="m4-carril__pista"><span class="m4-caja">Vendedor</span><span class="m4-flecha"></span><span class="m4-caja">Servidor central</span></div>
          <span class="m4-carril__estado m4-sync">esperando confirmación…</span>
        </div>
        <div class="m4-carril">
          <span class="m4-carril__rotulo">Catálogos y avisos · asíncrono</span>
          <div class="m4-carril__pista"><span class="m4-caja">Sistema</span><span class="m4-cola" aria-hidden="true"></span><span class="m4-caja">Otras ciudades</span></div>
          <span class="m4-carril__estado m4-async">el vendedor sigue atendiendo</span>
        </div>
      </figure>`;
  }

  function replicaHtml() {
    return `
      <figure class="fx-figura m4-replica">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Replicación y bitácora</span>Cada factura queda copiada antes de que algo falle</figcaption>
        <div class="m4-replica__fila">
          <span class="m4-bd m4-bd--principal">Principal</span>
          <span class="m4-bd" data-r="1">Réplica 1</span>
          <span class="m4-bd" data-r="2">Réplica 2</span>
        </div>
        <ol class="m4-bitacora"></ol>
        <div class="m4-replica__pie">
          <p class="fx-nota m4-replica__estado" aria-live="polite">Todo sincronizado</p>
          <button type="button" class="fx-boton m4-replica__caida">Simular caída</button>
        </div>
      </figure>`;
  }

  function archivosHtml() {
    return `
      <figure class="fx-figura m4-archivos" data-rol="vendedor">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Sistema de archivos distribuido</span>Un archivo, tres copias, y cada quien ve solo lo suyo</figcaption>
        <div class="m4-copias">
          <span class="m4-doc">contrato.pdf</span>
          <div class="m4-copias__srv">${[1, 2, 3].map((n) => `<span style="--i: ${n - 1}">Servidor ${n}<b>copia</b></span>`).join('')}</div>
        </div>
        <div class="tt-gantt__botones m4-roles" role="group" aria-label="Rol del empleado">
          ${Object.keys(ROLES).map((r, i) => `<button type="button" class="fx-boton" data-rol="${r}" aria-pressed="${i === 0}">${r.charAt(0).toUpperCase() + r.slice(1)}</button>`).join('')}
        </div>
        <ul class="m4-carpetas">${CARPETAS.map((c) => `<li data-carpeta="${c}"><span class="m4-carpetas__icono" aria-hidden="true"></span>${c}</li>`).join('')}</ul>
        <p class="fx-nota">Control de acceso basado en roles (RBAC) conectado a un directorio central de cuentas.</p>
      </figure>`;
  }

  /* ---------- Comportamiento ---------- */

  function botones(figura, atributo, alElegir) {
    figura.querySelectorAll(`button[data-${atributo}]`).forEach((b) => {
      b.addEventListener('click', () => {
        figura.querySelectorAll(`button[data-${atributo}]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        figura.dataset[atributo] = b.dataset[atributo];
        alElegir(b.dataset[atributo]);
      });
    });
  }

  function pintarAntes(fig, modo) {
    const cargas = modo === 'centralizado' ? [1, 0, 0, 0] : [0.38, 0.34, 0.31, 0.36];
    fig.querySelectorAll('.m4-antes__srv').forEach((s, i) => {
      const barra = s.querySelector('.fx-barra > span');
      barra.style.setProperty('--fx-valor', cargas[i]);
      barra.style.setProperty('--fx-color', cargas[i] > 0.85 ? 'var(--fx-rojo)' : 'var(--fx-verde)');
      s.querySelector('.m4-antes__carga').textContent = cargas[i] ? `${Math.round(cargas[i] * 100)} %` : 'sin servidor';
    });
    fig.querySelector('.m4-antes__nota').textContent = modo === 'centralizado'
      ? 'Todo pasa por la sede principal: un solo punto de falla.'
      : 'La carga se reparte y cada ciudad sigue trabajando aunque otra falle.';
  }

  function correrCapas(fig, anim) {
    const nodos = [...fig.querySelectorAll('.m4-nodo')];
    const apps = nodos.filter((n) => n.dataset.nodo === 'app');
    const cuentas = [0, 0];
    let consulta = 0;
    const una = () => {
      const app = consulta % 2;
      consulta += 1;
      RECORRIDO.forEach((nombre, paso) => {
        anim.esperar(paso * 380, () => {
          nodos.forEach((n) => n.classList.remove('is-activo'));
          const destino = nombre === 'app' ? apps[app] : nodos.find((n) => n.dataset.nodo === nombre);
          destino.classList.add('is-activo');
          if (nombre === 'app') {
            cuentas[app] += 1;
            apps[app].querySelector('small').textContent = String(cuentas[app]);
          }
        });
      });
      anim.esperar(RECORRIDO.length * 380, () => nodos.forEach((n) => n.classList.remove('is-activo')));
    };
    una();
    anim.repetir(2800, una);
  }

  function escribirJson(fig, anim) {
    const texto = '{\n  "pedido": 1024,\n  "sede": "Ciudad 2",\n  "producto": "REP-0381",\n  "cantidad": 2,\n  "vendedor": "V-112"\n}';
    anim.teclear(fig.querySelector('.m4-json__codigo code'), texto, 22);
  }

  function correrModelos(fig, anim) {
    const sync = fig.querySelector('.m4-sync');
    const cola = fig.querySelector('.m4-cola');
    const ciclo = () => {
      fig.classList.remove('is-confirmado');
      sync.textContent = 'esperando confirmación…';
      anim.esperar(1400, () => { fig.classList.add('is-confirmado'); sync.textContent = 'producto disponible · recibo impreso'; });
      cola.append(Fx.crear('<span class="m4-sobre"></span>'));
      while (cola.children.length > 5) cola.firstElementChild.remove();
    };
    ciclo();
    anim.repetir(2600, ciclo);
  }

  function correrReplica(fig, anim) {
    const bitacora = fig.querySelector('.m4-bitacora');
    const replicas = [...fig.querySelectorAll('.m4-bd[data-r]')];
    let factura = 1025;
    const linea = (txt) => {
      bitacora.append(Fx.crear(`<li>${txt}</li>`));
      while (bitacora.children.length > 4) bitacora.firstElementChild.remove();
    };
    const ciclo = () => {
      if (fig.classList.contains('is-caida')) return;
      const n = factura;
      factura += 1;
      linea(`BEGIN · factura ${n}`);
      anim.esperar(500, () => linea(`INSERT factura ${n} · inventario −1`));
      anim.esperar(1000, () => {
        linea('COMMIT · copiado en réplicas');
        replicas.forEach((r) => { r.classList.remove('is-copia'); void r.offsetWidth; r.classList.add('is-copia'); });
      });
    };
    ciclo();
    anim.repetir(2400, ciclo);
    fig.querySelector('.m4-replica__caida').addEventListener('click', () => {
      const estado = fig.querySelector('.m4-replica__estado');
      fig.classList.add('is-caida');
      estado.textContent = 'La principal se apagó…';
      anim.esperar(1200, () => {
        fig.classList.add('is-relevo');
        estado.textContent = 'La réplica 1 toma el control y lee la bitácora para terminar lo pendiente';
        linea('Réplica 1 → nueva principal');
      });
      anim.esperar(5000, () => {
        fig.classList.remove('is-caida', 'is-relevo');
        estado.textContent = 'Servidor reparado y al día';
      });
    });
  }

  function pintarRol(fig, rol) {
    const permitidas = ROLES[rol] || [];
    fig.querySelectorAll('.m4-carpetas li').forEach((li) => {
      li.classList.toggle('is-abierta', permitidas.includes(li.dataset.carpeta));
    });
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('m4');

    const t = (patron) => Fx.buscarTitulo(prosa, patron);
    const antes = Fx.insertarDespues(t(/^Actividad 1/), Fx.crear(antesHtml()), 1);
    const capas = Fx.insertarDespues(t(/^Actividad 2/), Fx.crear(capasHtml()), 3);
    const json = Fx.insertarDespues(t(/^Actividad 3/), Fx.crear(jsonHtml()), 1);
    const modelos = Fx.insertarDespues(t(/^Actividad 4/), Fx.crear(modelosHtml()), 1);
    const replica = Fx.insertarDespues(t(/^Actividad 5/), Fx.crear(replicaHtml()), 2);
    const archivos = Fx.insertarDespues(t(/^Actividad 6/), Fx.crear(archivosHtml()), 2);

    if (antes) {
      pintarAntes(antes, 'centralizado');
      botones(antes, 'modo', (modo) => pintarAntes(antes, modo));
    }
    if (archivos) {
      pintarRol(archivos, 'vendedor');
      botones(archivos, 'rol', (rol) => pintarRol(archivos, rol));
    }

    limpiezas.push(Fx.activarAlAparecer([antes, capas, json, modelos, replica, archivos], (el) => {
      if (el === capas) correrCapas(capas, anim);
      if (el === json) escribirJson(json, anim);
      if (el === modelos) correrModelos(modelos, anim);
      if (el === replica) correrReplica(replica, anim);
    }));
    limpiezas.push(Fx.revelarTitulos(prosa));

    // Red lateral
    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    const sedes = panelRaiz.querySelector('.m4-datos__sedes');
    const items = [...panelRaiz.querySelectorAll('.fx-lista li')];
    const textos = [
      'Un solo servidor saturado',
      'Capas y balanceador de carga',
      'Módulos que se hablan por la red',
      'Síncrono para pagar, cola para avisar',
      'Réplicas y latidos en toda la red',
      'Archivos copiados en tres servidores',
    ];
    const temas = Fx.titulos(prosa).filter((h) => h.tagName === 'H3');
    limpiezas.push(Fx.seguirSeccion(temas, (i) => {
      const n = Math.max(0, i);
      items.forEach((li, j) => {
        li.classList.toggle('is-hecho', j < n);
        li.classList.toggle('is-actual', j === n);
      });
      estado.textContent = textos[Math.min(n, textos.length - 1)];
      panelRaiz.dataset.modo = n >= 1 ? 'distribuido' : 'centralizado';
      sedes.textContent = n >= 5 ? '4 + 3 nuevas' : '4';
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
