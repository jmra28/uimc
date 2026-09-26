const TEST_VOCACIONAL_PREGUNTAS = [
  {
    texto: "¿Qué actividad disfrutas más?",
    opciones: [
      { texto: "Resolver problemas matemáticos o de lógica", area: "ingenieria" },
      { texto: "Ayudar y cuidar a otras personas", area: "salud" },
      { texto: "Liderar proyectos o negocios", area: "negocios" },
      { texto: "Leer, escribir o debatir ideas", area: "humanidades" },
      { texto: "Dibujar, diseñar o crear contenido", area: "arte" },
    ],
  },
  {
    texto: "En un trabajo en equipo, normalmente eres quien...",
    opciones: [
      { texto: "Organiza tareas y toma decisiones", area: "negocios" },
      { texto: "Resuelve los problemas técnicos", area: "ingenieria" },
      { texto: "Cuida que todos estén bien", area: "salud" },
      { texto: "Aporta ideas creativas", area: "arte" },
      { texto: "Investiga y da contexto", area: "humanidades" },
    ],
  },
  {
    texto: "¿Qué tema te llama más la atención?",
    opciones: [
      { texto: "Tecnología y sistemas", area: "ingenieria" },
      { texto: "Salud y bienestar", area: "salud" },
      { texto: "Finanzas y economía", area: "negocios" },
      { texto: "Sociedad, leyes o educación", area: "humanidades" },
      { texto: "Diseño, medios y comunicación", area: "arte" },
    ],
  },
  {
    texto: "Tu materia favorita en la escuela es (o era)...",
    opciones: [
      { texto: "Matemáticas", area: "ingenieria" },
      { texto: "Biología o Ciencias", area: "salud" },
      { texto: "Historia o Ciencias Sociales", area: "humanidades" },
      { texto: "Arte o talleres creativos", area: "arte" },
      { texto: "Ninguna en particular, prefiero organizar cosas", area: "negocios" },
    ],
  },
  {
    texto: "¿Qué te gustaría lograr en tu carrera?",
    opciones: [
      { texto: "Construir o mejorar sistemas y procesos", area: "ingenieria" },
      { texto: "Cuidar la salud de las personas", area: "salud" },
      { texto: "Dirigir mi propia empresa", area: "negocios" },
      { texto: "Defender causas o educar a otros", area: "humanidades" },
      { texto: "Expresarme y comunicar ideas", area: "arte" },
    ],
  },
];

const TEST_VOCACIONAL_RESULTADOS = {
  negocios: {
    titulo: "Negocios y Administración",
    texto: "Tienes perfil de líder y estratega. Programas como Administración de Empresas, Licenciatura en Mercadotécnia o Administración Financiera pueden ser para ti.",
  },
  ingenieria: {
    titulo: "Ingeniería y Ciencias Exactas",
    texto: "Disfrutas resolver problemas técnicos. Explora Ingeniería Industrial y de Sistemas, Arquitectura o Ingeniería Civil.",
  },
  salud: {
    titulo: "Salud y Bienestar",
    texto: "Te motiva cuidar de otros. Conoce nuestra Maestría en Administración de Hospitales y en Salud Pública.",
  },
  humanidades: {
    titulo: "Humanidades y Ciencias Sociales",
    texto: "Te apasiona entender a las personas y la sociedad. Licenciatura en Derecho, Educación y Didáctica o Ciencias de la Comunicación encajan contigo.",
  },
  arte: {
    titulo: "Comunicación y Diseño",
    texto: "Tienes una mente creativa. Ciencias de la Comunicación o Arquitectura pueden potenciar tu talento.",
  },
};

const TEST_VOCACIONAL_ORDEN_AREAS = ["negocios", "ingenieria", "salud", "humanidades", "arte"];

function crearOpcionTest(texto, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "test-vocacional__option";
  btn.textContent = texto;
  btn.addEventListener("click", onClick);
  return btn;
}

function initTestVocacional(modal) {
  const body = modal.querySelector("[data-test-body]");
  const progreso = modal.querySelector("[data-test-progress]");
  if (!body || !progreso) return;

  let paso = 0;
  let conteo = {};

  function renderPregunta() {
    body.textContent = "";
    const pregunta = TEST_VOCACIONAL_PREGUNTAS[paso];
    progreso.textContent = `Pregunta ${paso + 1} de ${TEST_VOCACIONAL_PREGUNTAS.length}`;

    const titulo = document.createElement("p");
    titulo.className = "test-vocacional__question";
    titulo.textContent = pregunta.texto;
    body.appendChild(titulo);

    const opciones = document.createElement("div");
    opciones.className = "test-vocacional__options";
    pregunta.opciones.forEach((opcion) => {
      opciones.appendChild(
        crearOpcionTest(opcion.texto, () => {
          conteo[opcion.area] = (conteo[opcion.area] || 0) + 1;
          paso += 1;
          if (paso < TEST_VOCACIONAL_PREGUNTAS.length) {
            renderPregunta();
          } else {
            renderResultado();
          }
        })
      );
    });
    body.appendChild(opciones);
  }

  function renderResultado() {
    progreso.textContent = "Resultado";
    body.textContent = "";

    const areaGanadora = TEST_VOCACIONAL_ORDEN_AREAS.reduce((mejor, area) =>
      (conteo[area] || 0) > (conteo[mejor] || 0) ? area : mejor
    , TEST_VOCACIONAL_ORDEN_AREAS[0]);

    const resultado = TEST_VOCACIONAL_RESULTADOS[areaGanadora];

    const titulo = document.createElement("h4");
    titulo.className = "test-vocacional__result-title";
    titulo.textContent = resultado.titulo;
    body.appendChild(titulo);

    const texto = document.createElement("p");
    texto.className = "test-vocacional__result-text";
    texto.textContent = resultado.texto;
    body.appendChild(texto);

    const nota = document.createElement("p");
    nota.className = "test-vocacional__result-note";
    nota.textContent = "Este es un test orientativo. Un asesor puede ayudarte a definir mejor tu camino.";
    body.appendChild(nota);

    const acciones = document.createElement("div");
    acciones.className = "test-vocacional__actions";

    const reiniciar = document.createElement("button");
    reiniciar.type = "button";
    reiniciar.className = "test-vocacional__restart";
    reiniciar.textContent = "Reiniciar test";
    reiniciar.addEventListener("click", () => {
      paso = 0;
      conteo = {};
      renderPregunta();
    });
    acciones.appendChild(reiniciar);

    const asesor = document.createElement("button");
    asesor.type = "button";
    asesor.className = "formulario__submit";
    asesor.textContent = "Hablar con un asesor";
    asesor.addEventListener("click", () => {
      modal.classList.remove("formulario-modal--visible");
      modal.setAttribute("aria-hidden", "true");
      const modalAsesor = document.getElementById("formulario-modal");
      if (modalAsesor) {
        modalAsesor.classList.add("formulario-modal--visible");
        modalAsesor.setAttribute("aria-hidden", "false");
      }
    });
    acciones.appendChild(asesor);

    body.appendChild(acciones);
  }

  modal.addEventListener("modal:open", () => {
    paso = 0;
    conteo = {};
    renderPregunta();
  });
}

document.querySelectorAll("#modal-test-vocacional").forEach(initTestVocacional);
