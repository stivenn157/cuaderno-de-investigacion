/*
 * Efectos de "Taller teórico 4: Sistemas distribuidos".
 *  - Panel de nodos con un latido (heartbeat) y los nueve temas del taller.
 *  - Varios computadores que el usuario ve como una sola máquina.
 *  - Envío de paquetes por TCP con confirmaciones ACK y un reenvío.
 *  - Pago con tarjeta: llamada síncrona al banco y aviso asíncrono por cola.
 *  - Clúster con failover: el gemelo toma el control cuando el principal cae.
 *  - Semana de matrículas: el balanceador reparte y se suman servidores.
 *  - Supermercado sin internet: las cajas siguen facturando y luego sincronizan.
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/taller-teorico-4';
  const Fx = window.Fx;

  const TEMAS = ['Concepto', 'Cliente-servidor', 'Comunicación', 'Modelos', 'Transparencia', 'Tolerancia a fallos', 'Escalabilidad', 'Archivos distribuidos', 'Aplicaciones'];

  const PAQUETES = [
    ['ida', 'Paquete 1'],
    ['vuelta', 'ACK 1'],
    ['ida perdido', 'Paquete 2 · se pierde en la red'],
    ['nota', 'No llega el ACK 2: TCP lo reenvía'],
    ['ida', 'Paquete 2 (reenvío)'],
    ['vuelta', 'ACK 2'],
    ['ida', 'Paquete 3'],
    ['vuelta', 'ACK 3'],
  ];

  // [desde, hasta, texto, tipo]: columnas 0 = tienda, 1 = banco, 2 = cola
  const SECUENCIA = [
    [0, 1, 'Cobro con tarjeta · HTTPS REST', 'sincrono'],
    [0, 0, 'La tienda espera la respuesta…', 'espera'],
    [1, 0, 'Pago aprobado', 'sincrono'],
    [0, 2, 'Aviso: enviar factura y descontar inventario', 'asincrono'],
    [0, 0, 'La tienda sigue atendiendo al cliente', 'libre'],
    [2, 2, 'La cola entrega los avisos cuando puede', 'asincrono'],
  ];

  /* ---------- Plantillas ---------- */

  function panelHtml() {
    return `
      <div class="fx-panel d4-panel">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Nodos del sistema</p>
        <p class="fx-panel__estado">Concepto</p>
        <svg class="d4-latido" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d="M0 22 H60 L68 22 L74 6 L82 36 L88 22 H120 L126 22 L132 10 L138 30 L143 22 H200" />
        </svg>
        <div class="d4-nodos" aria-hidden="true">${['A', 'B', 'C', 'D'].map((n, i) => `<span style="--i: ${i}">Nodo ${n}</span>`).join('')}</div>
        <ol class="fx-lista">${TEMAS.map((t) => `<li>${t}</li>`).join('')}</ol>
      </div>`;
  }

  function unaMaquinaHtml() {
    const equipos = ['Servidor 1', 'Servidor 2', 'Servidor 3', 'Servidor 4'].map((n, i) => `<span class="d4-equipo" style="--i: ${i}">${n}</span>`).join('');
    return `
      <figure class="fx-figura d4-una">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Transparencia</span>Muchos computadores, una sola máquina a los ojos del usuario</figcaption>
        <div class="d4-una__escena">
          <div class="d4-una__equipos">${equipos}</div>
          <span class="d4-una__velo">Lo que ve el usuario: un solo sistema</span>
        </div>
      </figure>`;
  }

  function tcpHtml() {
    const filas = PAQUETES.map(([tipo, texto], i) => `<li class="d4-paq ${tipo.split(' ').map((t) => `d4-paq--${t}`).join(' ')}" style="--i: ${i}"><span>${texto}</span></li>`).join('');
    return `
      <figure class="fx-figura d4-tcp">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Sockets sobre TCP</span>Cada pedazo se confirma; si no llega, se vuelve a enviar</figcaption>
        <div class="d4-tcp__extremos"><span>Equipo A</span><span>Equipo B</span></div>
        <ol class="d4-tcp__lista">${filas}</ol>
      </figure>`;
  }

  function secuenciaHtml() {
    const filas = SECUENCIA.map(([desde, hasta, texto, tipo], i) => {
      const ini = Math.min(desde, hasta) + 1;
      const fin = Math.max(desde, hasta) + 2;
      const dir = hasta < desde ? ' d4-msg--vuelta' : '';
      return `<li class="d4-msg d4-msg--${tipo}${dir}" style="--i: ${i}; grid-column: ${ini} / ${fin}"><span>${texto}</span></li>`;
    }).join('');
    return `
      <figure class="fx-figura d4-seq">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Síncrono y asíncrono</span>El ejemplo de la tienda virtual, paso a paso</figcaption>
        <div class="d4-seq__actores"><span>Tienda</span><span>Banco</span><span>Cola</span></div>
        <ol class="d4-seq__lista">${filas}</ol>
        <p class="fx-nota"><span class="d4-clave d4-clave--s"></span> síncrono: espera la respuesta · <span class="d4-clave d4-clave--a"></span> asíncrono: deja el mensaje y sigue</p>
      </figure>`;
  }

  function failoverHtml() {
    return `
      <figure class="fx-figura d4-fail">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Clúster de alta disponibilidad</span>Si el principal deja de latir, el gemelo toma su lugar</figcaption>
        <div class="d4-fail__par">
          <div class="d4-srv d4-srv--principal"><span class="d4-srv__nombre">Principal</span><span class="d4-srv__estado">atendiendo</span></div>
          <div class="d4-fail__enlace" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="d4-srv d4-srv--gemelo"><span class="d4-srv__nombre">Gemelo</span><span class="d4-srv__estado">en espera</span></div>
        </div>
        <div class="d4-fail__pie">
          <p class="d4-fail__texto" aria-live="polite">Latido normal entre los dos servidores</p>
          <button type="button" class="fx-boton d4-fail__repetir">Repetir</button>
        </div>
      </figure>`;
  }

  function matriculasHtml() {
    return `
      <figure class="fx-figura d4-mat">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">8:00 a. m. · semana de matrículas</span>El balanceador reparte y la nube suma servidores</figcaption>
        <div class="d4-mat__cabeza">
          <p class="d4-mat__dato"><span class="d4-mat__n">0</span> estudiantes conectados</p>
          <p class="d4-mat__dato"><span class="d4-mat__srv">2</span> servidores activos</p>
        </div>
        <div class="d4-mat__balanceador">Balanceador de carga</div>
        <div class="d4-mat__servidores"></div>
        <p class="fx-nota">Cifras de ejemplo: cuando la carga promedio pasa del 70 %, se agrega un servidor.</p>
      </figure>`;
  }

  function superHtml() {
    const cajas = Array.from({ length: 20 }, (_, i) => `<span style="--i: ${i}"></span>`).join('');
    return `
      <figure class="fx-figura d4-super">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Supermercado con servidor local</span>Se cae internet y las veinte cajas siguen facturando</figcaption>
        <div class="d4-super__escena">
          <div class="d4-super__tienda"><span class="d4-super__rotulo">Tienda · servidor local</span><div class="d4-super__cajas">${cajas}</div></div>
          <div class="d4-super__cable" aria-hidden="true"><span></span></div>
          <div class="d4-super__nube"><span class="d4-super__rotulo">Nube central</span><span class="d4-super__pend"><span class="d4-super__n">0</span> facturas por subir</span></div>
        </div>
        <p class="d4-super__estado fx-nota" aria-live="polite">Conectado</p>
      </figure>`;
  }

  /* ---------- Comportamiento ---------- */

  function correrFailover(fig, anim) {
    const texto = fig.querySelector('.d4-fail__texto');
    const enlace = fig.querySelector('.d4-fail__enlace');
    enlace.style.setProperty('--ancho', `${Math.max(enlace.offsetWidth, enlace.offsetHeight) - 8}px`);
    fig.classList.remove('is-caido', 'is-relevo');
    fig.querySelector('.d4-srv--principal .d4-srv__estado').textContent = 'atendiendo';
    fig.querySelector('.d4-srv--gemelo .d4-srv__estado').textContent = 'en espera';
    texto.textContent = 'Latido normal entre los dos servidores';
    anim.secuencia([
      [2400, () => {
        fig.classList.add('is-caido');
        fig.querySelector('.d4-srv--principal .d4-srv__estado').textContent = 'sin latido';
        texto.textContent = 'El principal se apagó en plena operación';
      }],
      [1300, () => {
        fig.classList.add('is-relevo');
        fig.querySelector('.d4-srv--gemelo .d4-srv__estado').textContent = 'atendiendo';
        texto.textContent = 'Failover: el gemelo atiende y la bitácora completa lo pendiente';
      }],
    ]);
  }

  function correrMatriculas(fig, anim) {
    const contenedor = fig.querySelector('.d4-mat__servidores');
    const numero = fig.querySelector('.d4-mat__n');
    const activos = fig.querySelector('.d4-mat__srv');
    const MAX = 6;
    let estudiantes = 0;
    let servidores = [];
    const agregar = () => {
      const s = Fx.crear('<div class="d4-mat__servidor"><span class="d4-mat__barra"><span></span></span><span class="d4-mat__carga">0 %</span></div>');
      contenedor.append(s);
      servidores = [...contenedor.children];
      activos.textContent = String(servidores.length);
    };
    contenedor.innerHTML = '';
    agregar();
    agregar();
    const ciclo = () => {
      estudiantes = Math.min(4800, estudiantes + 400);
      numero.textContent = estudiantes.toLocaleString('es-CO');
      const capacidad = 1000;
      let carga = estudiantes / (servidores.length * capacidad);
      if (carga > 0.7 && servidores.length < MAX) {
        agregar();
        carga = estudiantes / (servidores.length * capacidad);
      }
      servidores.forEach((s) => {
        const valor = Math.min(0.98, carga * (0.9 + Math.random() * 0.2));
        s.querySelector('.d4-mat__barra span').style.transform = `scaleY(${valor})`;
        s.querySelector('.d4-mat__carga').textContent = `${Math.round(valor * 100)} %`;
        s.classList.toggle('is-alta', valor > 0.8);
      });
      if (estudiantes >= 4800) estudiantes = 0;
      if (estudiantes === 0) {
        contenedor.innerHTML = '';
        agregar();
        agregar();
      }
    };
    ciclo();
    anim.repetir(900, ciclo);
  }

  function correrSuper(fig, anim) {
    const estado = fig.querySelector('.d4-super__estado');
    const pendientes = fig.querySelector('.d4-super__n');
    let n = 0;
    let fase = 0;
    const ciclo = () => {
      fase = (fase + 1) % 12;
      if (fase === 2) { fig.classList.add('is-cortado'); estado.textContent = 'Sin internet: las cajas facturan con el servidor local'; }
      if (fig.classList.contains('is-cortado')) { n += 7; pendientes.textContent = String(n); }
      if (fase === 8) { fig.classList.remove('is-cortado'); fig.classList.add('is-sincroniza'); estado.textContent = 'Volvió la conexión: se suben las facturas a la nube'; }
      if (fase === 10) { n = 0; pendientes.textContent = '0'; fig.classList.remove('is-sincroniza'); estado.textContent = 'Conectado y al día'; }
    };
    anim.repetir(700, ciclo);
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('d4');

    const t = (patron) => Fx.buscarTitulo(prosa, patron);
    const una = Fx.insertarDespues(t(/^1\./), Fx.crear(unaMaquinaHtml()), 1);
    const tcp = Fx.insertarDespues(Fx.buscarParrafo(prosa, /Sockets sobre el protocolo TCP/i) || t(/^3\./), Fx.crear(tcpHtml()));
    const seq = Fx.insertarDespues(t(/^4\./), Fx.crear(secuenciaHtml()), 3);
    const fail = Fx.insertarDespues(t(/^6\./), Fx.crear(failoverHtml()), 1);
    const mat = Fx.insertarDespues(t(/^7\./), Fx.crear(matriculasHtml()), 2);
    const sup = Fx.insertarDespues(t(/^9\./), Fx.crear(superHtml()), 3);

    if (fail) fail.querySelector('.d4-fail__repetir').addEventListener('click', () => correrFailover(fail, anim));

    limpiezas.push(Fx.activarAlAparecer([una, tcp, seq, fail, mat, sup], (el) => {
      if (el === fail) correrFailover(fail, anim);
      if (el === mat) correrMatriculas(mat, anim);
      if (el === sup) correrSuper(sup, anim);
    }));
    limpiezas.push(Fx.revelarTitulos(prosa));

    const panelRaiz = Fx.llenarPanel(panel, panelHtml());
    const items = [...panelRaiz.querySelectorAll('.fx-lista li')];
    const estado = panelRaiz.querySelector('.fx-panel__estado');
    const temas = Fx.titulos(prosa).filter((h) => h.tagName === 'H3');
    limpiezas.push(Fx.seguirSeccion(temas, (i) => {
      items.forEach((li, j) => {
        li.classList.toggle('is-hecho', j < i);
        li.classList.toggle('is-actual', j === i);
      });
      estado.textContent = TEMAS[Math.max(0, i)] || TEMAS[0];
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
