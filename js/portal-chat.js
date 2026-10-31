const REGLAS_CHAT = [
  "Sé respetuoso: no se permiten groserías, insultos ni lenguaje ofensivo.",
  "No envíes mensajes de spam, cadenas ni contenido publicitario ajeno a la universidad.",
  "Sé específico: describe tu duda o solicitud con claridad para que podamos ayudarte más rápido.",
  "Usa este medio solo para dudas académicas, administrativas o de servicios escolares.",
  "No compartas contraseñas ni datos personales de otros alumnos.",
  "Evita enviar el mismo mensaje varias veces; nuestro equipo responde en horario hábil (lunes a viernes).",
  "No se atenderán mensajes con amenazas, acoso o contenido discriminatorio.",
];

function crearBloqueReglas() {
  const div = document.createElement("div");
  div.className = "portal-chat__bubble portal-chat__reglas";

  const titulo = document.createElement("p");
  titulo.className = "portal-chat__reglas-titulo";
  titulo.textContent = "Antes de continuar, te pedimos respetar estas reglas:";
  div.appendChild(titulo);

  const ul = document.createElement("ul");
  ul.className = "portal-chat__reglas-list";
  REGLAS_CHAT.forEach((regla) => {
    const li = document.createElement("li");
    li.textContent = regla;
    ul.appendChild(li);
  });
  div.appendChild(ul);

  return div;
}

function crearBurbuja(texto) {
  const p = document.createElement("p");
  p.className = "portal-chat__bubble";
  p.textContent = texto;
  return p;
}

function crearBotonOpcion(texto, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "portal-chat__option";
  btn.textContent = texto;
  btn.addEventListener("click", onClick);
  return btn;
}

function crearBotonRegresar(onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "portal-chat__back";
  btn.textContent = "← Regresar";
  btn.addEventListener("click", onClick);
  return btn;
}

function limpiarNumero(numero) {
  return numero.replace(/\D/g, "");
}

function armarEnlaceWhatsapp(telefono, mensaje) {
  return `https://wa.me/${limpiarNumero(telefono)}?text=${encodeURIComponent(mensaje)}`;
}

function initPortalChat() {
  const widget = document.querySelector(".portal-chat");
  if (!widget) return;

  const toggleButton = widget.querySelector(".portal-chat__toggle");
  const closeButton = widget.querySelector(".portal-chat__close");
  const body = widget.querySelector(".portal-chat__body");
  const logoUim = widget.querySelector('[data-chat-logo="uim"]');
  const logoIal = widget.querySelector('[data-chat-logo="ial"]');

  let mensajeria = null;

  function esIal() {
    const radioIal = document.getElementById("portal-alumno-tab-ial");
    return Boolean(radioIal && radioIal.checked);
  }

  function limpiarBody() {
    body.textContent = "";
  }

  function renderOpciones(opciones) {
    const wrap = document.createElement("div");
    wrap.className = "portal-chat__options";
    opciones.forEach(({ texto, onClick }) => wrap.appendChild(crearBotonOpcion(texto, onClick)));
    body.appendChild(wrap);
  }

  function renderFinal(nombreArea, telefono) {
    limpiarBody();

    const institucionIal = esIal();
    const telefonoFinal = institucionIal ? mensajeria.direccionAcademica.telefono : telefono;
    const nombreInstitucion = institucionIal
      ? "Instituto Abraham Lincoln (IAL)"
      : "Universidad Internacional Mexicana (UIM)";
    const destinoFinal = institucionIal ? "Dirección Académica" : nombreArea;

    body.appendChild(crearBurbuja(`Te comunicamos con ${destinoFinal}.`));

    const mensaje = `Hola, soy alumno de ${nombreInstitucion} y tengo una duda sobre: ${nombreArea}.`;

    const link = document.createElement("a");
    link.className = "portal-chat__action";
    link.href = armarEnlaceWhatsapp(telefonoFinal, mensaje);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Continuar en WhatsApp";
    body.appendChild(link);

    body.appendChild(crearBotonRegresar(renderCategorias));
  }

  function renderRespuesta(categoria, faq) {
    limpiarBody();
    body.appendChild(crearBurbuja(faq.pregunta));
    body.appendChild(crearBurbuja(faq.respuesta));
    renderOpciones([
      { texto: "Ver otra pregunta", onClick: () => renderPreguntas(categoria) },
      { texto: "Continuar en WhatsApp", onClick: () => renderFinal(categoria.label, categoria.telefono) },
    ]);
    body.appendChild(crearBotonRegresar(renderCategorias));
  }

  function renderPreguntas(categoria) {
    limpiarBody();
    body.appendChild(crearBurbuja(`Estas son algunas preguntas frecuentes sobre ${categoria.label.toLowerCase()}:`));
    const opciones = categoria.preguntasFrecuentes.map((faq) => ({
      texto: faq.pregunta,
      onClick: () => renderRespuesta(categoria, faq),
    }));
    opciones.push({
      texto: "Mi duda no está aquí",
      onClick: () => renderFinal(categoria.label, categoria.telefono),
    });
    renderOpciones(opciones);
    body.appendChild(crearBotonRegresar(renderCategorias));
  }

  function renderNiveles(categoria) {
    limpiarBody();
    body.appendChild(crearBurbuja(`¿De qué nivel es tu duda de ${categoria.label.toLowerCase()}?`));
    renderOpciones(
      categoria.niveles.map((nivel) => ({
        texto: nivel.label,
        onClick: () => renderFinal(`${categoria.label} - ${nivel.label}`, nivel.telefono),
      }))
    );
    body.appendChild(crearBotonRegresar(renderCategorias));
  }

  function renderReglas() {
    limpiarBody();
    body.appendChild(crearBurbuja("Hola 👋 Bienvenido a la mensajería de UIM/IAL."));
    body.appendChild(crearBloqueReglas());

    const continuar = document.createElement("button");
    continuar.type = "button";
    continuar.className = "portal-chat__action";
    continuar.textContent = "Continuar";
    continuar.addEventListener("click", renderCategorias);
    body.appendChild(continuar);
  }

  function renderCategorias() {
    limpiarBody();

    if (esIal()) {
      body.appendChild(crearBurbuja(mensajeria.avisoIal));
    }

    body.appendChild(crearBurbuja("Hola 👋 ¿Cuál es tu duda?"));
    renderOpciones(
      mensajeria.categorias.map((categoria) => ({
        texto: categoria.label,
        onClick: () => {
          if (categoria.niveles) {
            renderNiveles(categoria);
          } else if (categoria.preguntasFrecuentes) {
            renderPreguntas(categoria);
          } else {
            renderFinal(categoria.label, categoria.telefono);
          }
        },
      }))
    );
  }

  function setVisible(visible) {
    widget.classList.toggle("portal-chat--visible", visible);
    toggleButton.setAttribute("aria-expanded", String(visible));
    if (visible && mensajeria) renderReglas();
  }

  toggleButton.addEventListener("click", () => {
    setVisible(!widget.classList.contains("portal-chat--visible"));
  });

  closeButton.addEventListener("click", () => setVisible(false));

  document.addEventListener("click", (event) => {
    if (!event.composedPath().includes(widget)) setVisible(false);
  });

  fetch("data/portal-alumno.json")
    .then((res) => res.json())
    .then((data) => {
      mensajeria = data.mensajeria;
      if (logoUim) logoUim.src = data.uim.logo;
      if (logoIal) logoIal.src = data.ial.logo;
    });
}

initPortalChat();
