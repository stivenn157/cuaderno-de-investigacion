/*
 * Efectos de "Actividad 1: Fundamentos del sistema operativo".
 *  - Terminal lateral que escribe un comando por cada tema del documento.
 *  - Diagrama de capas animado (reemplaza el dibujo en texto del Word).
 *  - Las cinco funciones del SO que se encienden al leerlas.
 *  - Simulación de la RAM de 4 GB con paginación e hiperpaginación.
 *  - Comandos de consola presentados como tarjetas de terminal.
 */
(function () {
  'use strict';

  const CLAVE = 'sistemas-operativos/actividad-1';
  const Fx = window.Fx;

  // Un comando de ejemplo por cada título del documento (salidas ilustrativas)
  const TERMINAL = [
    ['uname -a', 'Linux aula-08 6.8.0 x86_64 GNU/Linux'],
    ['lshw -short', 'cpu · memoria · disco · red · usb'],
    ['systemctl list-units --type=service', '34 servicios cargados y activos'],
    ['top -b -n 1 | head -3', 'Tareas: 212 total, 1 ejecutando'],
    ['ps aux --sort=-%cpu | head -2', '2481 firefox   23.4 %CPU'],
    ['free -h', 'Mem: 4,0Gi total · 3,6Gi usada'],
    ['lsblk', 'sda 256G disk  /  sdb 32G usb'],
    ['ls -lah ~/proyectos', 'drwxr-xr-x  so/  semana1/'],
    ['dmesg | tail -1', '[3.21] usb 1-2: nuevo dispositivo'],
    ['echo $SHELL', '/bin/bash'],
    ['history | tail -1', 'sesión guardada'],
  ];

  const CAPAS = [
    ['Usuario', 'teclado, mouse, pantalla'],
    ['Aplicaciones', 'navegador, editor de texto'],
    ['Sistema operativo', 'kernel, drivers, archivos, planificador'],
    ['Hardware', 'CPU, RAM, disco, red, periféricos'],
  ];
  const ENLACES = ['interacción', 'llamadas al sistema', 'instrucciones e interrupciones'];

  const FUNCIONES = [
    ['Procesos', /^Administración de procesos/i],
    ['Memoria', /^Gestión de la memoria/i],
    ['Archivos', /^Gestión de archivos/i],
    ['Entrada y salida', /^Administración de dispositivos de E\/S/i],
    ['Protección', /^Protección y seguridad/i],
  ];

  const PROCESOS_RAM = [
    ['Navegador', 1.4],
    ['Descarga', 0.7],
    ['Antivirus', 0.9],
    ['Editor', 0.6],
  ];

  /* ---------- Plantillas ---------- */

  function capasHtml() {
    const filas = CAPAS.map(([nombre, detalle], i) => `
      <li class="a1-capa" style="--i: ${i}">
        <span class="a1-capa__nombre">${nombre}</span>
        <span class="a1-capa__detalle">${detalle}</span>
      </li>
      ${ENLACES[i] ? `<li class="a1-enlace" style="--i: ${i}" aria-hidden="true"><span>${ENLACES[i]}</span></li>` : ''}`).join('');
    return `
      <figure class="fx-figura a1-capas">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Diagrama</span>Cada capa le habla solo a la de al lado</figcaption>
        <div class="a1-capas__pila">
          <ol class="a1-capas__lista">${filas}</ol>
          <span class="a1-capas__pulso" aria-hidden="true"></span>
        </div>
      </figure>`;
  }

  function funcionesHtml() {
    const items = FUNCIONES.map(([nombre], i) => `<li style="--i: ${i}"><span class="a1-funciones__n">0${i + 1}</span>${nombre}</li>`).join('');
    return `<ol class="a1-funciones" aria-label="Funciones principales del sistema operativo">${items}</ol>`;
  }

  function ramHtml() {
    const bloques = PROCESOS_RAM.map(([nombre, gb], i) => `
      <span class="a1-ram__bloque" style="--i: ${i}; --ancho: ${(gb / 4) * 100}%"><span>${nombre}</span></span>`).join('');
    return `
      <figure class="fx-figura a1-ram">
        <figcaption class="fx-figura__cabeza"><span class="fx-rotulo">Simulación</span>Cuatro procesos compiten por 4 GB de RAM</figcaption>
        <div class="a1-ram__fila"><span class="a1-ram__rotulo">RAM · 4 GB</span><div class="a1-ram__barra">${bloques}</div></div>
        <div class="a1-ram__fila"><span class="a1-ram__rotulo">Disco · paginación</span><div class="a1-ram__disco"><span></span><span></span><span></span></div></div>
        <div class="a1-ram__pie">
          <p class="a1-ram__estado" aria-live="polite">Memoria libre</p>
          <button type="button" class="fx-boton a1-ram__repetir">Repetir</button>
        </div>
      </figure>`;
  }

  function panelHtml() {
    return `
      <div class="fx-panel a1-terminal">
        <p class="fx-panel__cabeza"><span class="fx-led" aria-hidden="true"></span>Terminal</p>
        <div class="a1-terminal__pantalla" aria-hidden="true"><ol class="a1-terminal__historial"></ol>
          <p class="a1-terminal__linea"><span class="a1-terminal__prompt">~/so $</span> <span class="a1-terminal__comando"></span><span class="a1-terminal__cursor"></span></p>
        </div>
        <p class="fx-nota">Comandos de ejemplo según el tema que estás leyendo.</p>
      </div>`;
  }

  /* ---------- Comportamiento ---------- */

  function simularRam(figura, anim) {
    const bloques = [...figura.querySelectorAll('.a1-ram__bloque')];
    const estado = figura.querySelector('.a1-ram__estado');
    figura.classList.remove('is-pagina', 'is-hiper');
    bloques.forEach((b) => b.classList.remove('is-dentro'));
    estado.textContent = 'Memoria libre';
    anim.secuencia([
      ...bloques.map((b, i) => [i === 0 ? 300 : 650, () => {
        b.classList.add('is-dentro');
        estado.textContent = `${PROCESOS_RAM[i][0]} pide memoria`;
      }]),
      [900, () => { figura.classList.add('is-pagina'); estado.textContent = 'RAM llena: el SO envía páginas inactivas al disco'; }],
      [1600, () => { figura.classList.add('is-hiper'); estado.textContent = 'Paginación en exceso: hiperpaginación'; }],
    ]);
  }

  function prepararComandos(prosa) {
    prosa.querySelectorAll(':scope > p').forEach((p) => {
      if (!p.textContent.includes('Sintaxis:')) return;
      const partes = p.innerHTML.split('<br>');
      const nombre = partes.shift();
      p.classList.add('a1-comando');
      p.innerHTML = `<span class="a1-comando__nombre">${nombre}</span>${partes.map((l) => `<span class="a1-comando__linea">${l.replace(/^•\s*/, '')}</span>`).join('')}`;
    });
  }

  function iniciar({ raiz, prosa, panel, reducido }) {
    const anim = Fx.animador(reducido);
    const limpiezas = [anim.detener];
    raiz.classList.add('a1');

    // Diagrama de capas en lugar del dibujo en texto
    const dibujo = prosa.querySelector('.diagrama');
    const capas = Fx.crear(capasHtml());
    if (dibujo) dibujo.replaceWith(capas);
    else Fx.insertarDespues(Fx.buscarTitulo(prosa, /relación entre hardware/i), capas, 1);

    // Funciones principales
    const hFunciones = Fx.buscarTitulo(prosa, /funciones principales/i);
    const funciones = Fx.crear(funcionesHtml());
    Fx.insertarDespues(hFunciones, funciones);
    const parrafosFuncion = FUNCIONES.map(([, patron]) => Fx.buscarParrafo(prosa, patron));
    limpiezas.push(Fx.alAparecer(parrafosFuncion.filter(Boolean), (p) => {
      const n = parrafosFuncion.indexOf(p);
      [...funciones.children].slice(0, n + 1).forEach((li) => li.classList.add('is-encendida'));
    }, { rootMargin: '0px 0px -35% 0px' }));

    // RAM de 4 GB
    const pRam = Fx.buscarParrafo(prosa, /4 GB de RAM/);
    const ram = pRam ? Fx.crear(ramHtml()) : null;
    if (ram) {
      pRam.after(ram);
      ram.querySelector('.a1-ram__repetir').addEventListener('click', () => simularRam(ram, anim));
    }

    prepararComandos(prosa);

    limpiezas.push(Fx.activarAlAparecer([capas, funciones, ram], (el) => {
      if (el === ram) simularRam(ram, anim);
      if (el === capas) {
        const pila = capas.querySelector('.a1-capas__pila');
        pila.style.setProperty('--alto-pila', `${pila.offsetHeight}px`);
      }
    }));
    limpiezas.push(Fx.descifrarTitulos(prosa, anim));

    // Terminal lateral
    Fx.llenarPanel(panel, panelHtml());
    const historial = panel.querySelector('.a1-terminal__historial');
    const comando = panel.querySelector('.a1-terminal__comando');
    let cancelar = () => {};
    limpiezas.push(Fx.seguirSeccion(Fx.titulos(prosa), (i) => {
      const entrada = TERMINAL[Math.min(Math.max(i, 0), TERMINAL.length - 1)];
      cancelar();
      cancelar = anim.teclear(comando, entrada[0], 28, () => {
        historial.append(Fx.crear(`<li><span class="a1-terminal__prompt">~/so $</span> ${Fx.escapar(entrada[0])}<span class="a1-terminal__salida">${Fx.escapar(entrada[1])}</span></li>`));
        while (historial.children.length > 4) historial.firstElementChild.remove();
        comando.textContent = '';
      });
    }));

    return () => limpiezas.forEach((fn) => fn());
  }

  window.Efectos[CLAVE] = Object.freeze({ iniciar });
})();
