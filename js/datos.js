/*
 * Datos de la página: materias y documentos.
 * Para agregar un documento:
 *   1. Copia el .docx en documentos/<materia>/
 *   2. Agrega su nombre en IDS dentro de herramientas/convertir_docx.py y ejecútalo
 *   3. Agrega aquí su ficha (mismo id)
 */
window.Pagina = window.Pagina || {};

window.Pagina.datos = Object.freeze({
  sitio: {
    titulo: 'Cuaderno de investigación',
    autor: 'Stiven Marulanda Chica',
    universidad: 'Corporación Universitaria Remington',
    periodo: 'Semestre 8 · 2026',
    docente: 'Oscar Mahecha Camargo',
    /*
     * Video de presentación de la portada. Usa una de las dos opciones:
     *  - archivo: guarda el video en la carpeta video/ con este nombre (MP4 recomendado).
     *  - youtube: pega aquí el enlace de YouTube; si lo llenas, tiene prioridad.
     * Mientras no exista ninguno, la portada muestra un aviso de "muy pronto".
     */
    video: {
      archivo: 'video/presentacion.mp4',
      portada: 'video/portada.jpg',
      youtube: '',
    },
  },
  materias: [
    {
      id: 'sistemas-operativos',
      astro: 'sol',
      tema: 'dia',
      numero: 'I',
      nombre: 'Sistemas operativos',
      tituloHtml: 'Sistemas <em>operativos</em>',
      intro:
        'Cómo un sistema operativo administra procesos, memoria, archivos y hardware, y cómo usar ese conocimiento para diagnosticar y resolver fallas reales en los equipos de una empresa.',
      documentos: [
        {
          id: 'actividad-1',
          tipo: 'Actividad 1',
          titulo: 'Fundamentos del sistema operativo',
          resumen:
            'Qué es un sistema operativo, cómo conecta al usuario con el hardware, sus funciones principales y los comandos básicos de consola en Linux y Windows.',
          coautores: ['Estiben Lopez Arbelaez'],
          fecha: '2026-10-17',
          archivo: 'ACTIVIDAD 1.docx',
          efectos: true,
        },
        {
          id: 'actividad-practica',
          tipo: 'Actividad práctica',
          titulo: 'Diagnóstico de un equipo lento',
          resumen:
            'Diagnóstico paso a paso de un computador que se vuelve lento por falta de memoria, con soluciones concretas y un plan de mantenimiento preventivo.',
          coautores: ['Estiben Lopez Arbelaez'],
          fecha: '2026-10-17',
          archivo: 'actividad practica.docx',
          efectos: true,
        },
        {
          id: 'parcial-1',
          tipo: 'Parcial 1',
          titulo: 'Caso TecnoGestión',
          resumen:
            'Diagnóstico técnico de un programa de facturación que se congela y de una impresora con fallas de controladores, con plan de solución y prevención.',
          coautores: ['Estiben Lopez Arbelaez'],
          fecha: '2026-10-24',
          archivo: 'Parcial 1.docx',
          efectos: true,
        },
        {
          id: 'taller-teorico',
          tipo: 'Taller teórico',
          titulo: 'Procesos y sincronización',
          resumen:
            'Programas y procesos, estados, algoritmos de planificación FCFS y SJF, condiciones de carrera, secciones críticas, semáforos y bloqueos.',
          coautores: ['Estiben Lopez'],
          fecha: '2026-10-31',
          archivo: 'Taller Teorico.docx',
          efectos: true,
        },
        {
          id: 'taller-practico',
          tipo: 'Taller práctico',
          titulo: 'Hardware y rendimiento',
          resumen:
            'Procesadores multinúcleo, saturación de RAM, generaciones DDR, buses, gráficos integrados frente a dedicados y el diagnóstico integral de un equipo.',
          coautores: ['Estiben Lopez'],
          fecha: '2026-10-31',
          archivo: 'Taller practico.docx',
          efectos: true,
        },
        {
          id: 'taller-teorico-4',
          tipo: 'Taller teórico 4',
          titulo: 'Sistemas distribuidos',
          resumen:
            'Qué es un sistema distribuido, la arquitectura en tres capas, la comunicación entre procesos, la transparencia, la tolerancia a fallos, la escalabilidad y sus usos en empresas reales.',
          coautores: ['Estiben Lopez'],
          fecha: '2026-11-12',
          archivo: 'Taller teorico 4.docx',
          efectos: true,
        },
        {
          id: 'taller-practico-4',
          tipo: 'Taller práctico 4',
          titulo: 'Caso MULTISERVICIOS S.A.',
          resumen:
            'Cómo pasar de un servidor central saturado a una plataforma distribuida para 350 empleados en cuatro ciudades: capas, mensajes, réplicas y archivos compartidos.',
          coautores: ['Estiben Lopez'],
          fecha: '2026-11-12',
          archivo: 'Taller practico 4.docx',
          efectos: true,
        },
      ],
    },
    {
      id: 'linea-de-enfasis-ii',
      astro: 'luna',
      tema: 'noche',
      numero: 'II',
      nombre: 'Línea de énfasis II',
      tituloHtml: 'Línea de <em>énfasis II</em>',
      intro:
        'Ciberseguridad aplicada a las empresas: principios de la seguridad de la información, activos críticos, análisis de incidentes reales y planes de protección para organizaciones grandes y pequeñas.',
      documentos: [
        {
          id: 'taller-1',
          tipo: 'Taller 1',
          titulo: 'Fundamentos de ciberseguridad',
          resumen:
            'Ciberseguridad y seguridad de la información, sus principios, activos, amenazas, el factor humano y la ciberseguridad como estrategia de negocio.',
          coautores: ['Adrian Alexis Ramirez Ramirez'],
          fecha: '2026-10-19',
          archivo: 'Taller 1.docx',
          efectos: true,
        },
        {
          id: 'taller-practico',
          tipo: 'Taller práctico',
          titulo: 'Diagnóstico de una pyme',
          resumen:
            'Activos críticos, análisis de un incidente, priorización de medidas y el diagnóstico inicial de seguridad de Mercados y Suministros del Oriente S. A. S.',
          coautores: ['Adrian Alexis Ramirez Ramirez'],
          fecha: '2026-10-19',
          archivo: 'Taller practico.docx',
          efectos: true,
        },
        {
          id: 'parcial-practico',
          tipo: 'Parcial práctico',
          titulo: 'Caso Comercializadora EMBLEMA',
          resumen:
            'Activos críticos, diagnóstico del incidente, impactos, medidas de bajo costo y un plan de acción de 30 días para una empresa mediana.',
          coautores: ['Jackson Morillo Rodriguez'],
          fecha: '2026-10-26',
          archivo: 'parcial practico linea de enfasis.docx',
          efectos: true,
        },
        {
          id: 'analisis-de-caso',
          tipo: 'Análisis de caso',
          titulo: 'Ransomware en Ecopetrol',
          resumen:
            'Investigación del ciberataque de julio de 2026 al Grupo Ecopetrol: cómo ocurrió, qué debilidades lo facilitaron y una propuesta de servicio de ciberseguridad.',
          coautores: ['Adrian Ramirez'],
          fecha: '2026-11-02',
          archivo: 'Analisis de caso.docx',
          efectos: true,
        },
      ],
    },
  ],
});
