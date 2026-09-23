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
    if (visible && mensajeria) renderCategorias();
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
