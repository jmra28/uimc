const ICONO_DOCUMENTO_SVG = `
  <svg class="portal-alumno__doc-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M14 2v5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M12 11v6M9 14l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

function crearTarjeta(item, textoBoton, tipo) {
  const pendiente = item.url.startsWith("#TODO");

  const card = document.createElement(pendiente ? "div" : "a");
  card.className = "portal-alumno__card";
  if (!pendiente) {
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener";
  }

  if (pendiente) {
    const tag = document.createElement("span");
    tag.className = "portal-alumno__card-tag";
    tag.textContent = "Próximamente";
    card.appendChild(tag);
  }

  const icon = document.createElement("img");
  icon.className = "portal-alumno__card-icon";
  icon.src = "assets/images/vineta-fub-rojo.png";
  icon.alt = "";
  card.appendChild(icon);

  const title = document.createElement("h3");
  title.className = "portal-alumno__card-title";
  title.textContent = item.titulo;
  card.appendChild(title);

  const text = document.createElement("p");
  text.className = "portal-alumno__card-text";
  text.textContent = item.descripcion;
  card.appendChild(text);

  if (!pendiente) {
    const button = document.createElement("span");
    button.className = "portal-alumno__card-button";
    if (tipo === "documento") {
      button.innerHTML = ICONO_DOCUMENTO_SVG;
    }
    button.appendChild(document.createTextNode(textoBoton));
    card.appendChild(button);
  }

  return card;
}

function renderInstitucion(id, data) {
  const panel = document.querySelector(`[data-portal-panel="${id}"]`);
  if (!panel || !data) return;

  const nombre = panel.querySelector("[data-portal-nombre]");
  if (nombre) nombre.textContent = data.nombreCompleto;

  const plataformasGrid = panel.querySelector('[data-portal-grid="plataformas"]');
  if (plataformasGrid) {
    data.plataformas.forEach((item) => plataformasGrid.appendChild(crearTarjeta(item, "Ingresar", "plataforma")));
  }

  const documentosGrid = panel.querySelector('[data-portal-grid="documentos"]');
  if (documentosGrid) {
    data.documentos.forEach((item) => documentosGrid.appendChild(crearTarjeta(item, "Ver documento", "documento")));
  }
}

function renderBloqueProceso(data, introSelector, puntosSelector, gridName) {
  if (!data) return;

  const intro = document.querySelector(introSelector);
  if (intro) intro.textContent = data.intro;

  const lista = document.querySelector(puntosSelector);
  if (lista) {
    data.puntosClave.forEach((punto) => {
      const li = document.createElement("li");
      li.textContent = punto;
      lista.appendChild(li);
    });
  }

  const documentosGrid = document.querySelector(`[data-portal-grid="${gridName}"]`);
  if (documentosGrid) {
    data.documentos.forEach((item) => documentosGrid.appendChild(crearTarjeta(item, "Descargar", "documento")));
  }
}

function initLogoSwitch(data) {
  const logo = document.getElementById("portal-alumno-logo");
  const radioUim = document.getElementById("portal-alumno-tab-uim");
  const radioIal = document.getElementById("portal-alumno-tab-ial");
  if (!logo || !radioUim || !radioIal) return;

  function actualizarLogo() {
    const institucion = radioIal.checked ? data.ial : data.uim;
    logo.src = institucion.logo;
    logo.alt = institucion.nombreCompleto;
  }

  radioUim.addEventListener("change", actualizarLogo);
  radioIal.addEventListener("change", actualizarLogo);
  actualizarLogo();
}

function initPortalAlumno() {
  const root = document.querySelector(".portal-alumno");
  if (!root) return;

  fetch("data/portal-alumno.json")
    .then((res) => res.json())
    .then((data) => {
      renderInstitucion("uim", data.uim);
      renderInstitucion("ial", data.ial);
      renderBloqueProceso(data.practicas.licenciatura, "[data-practicas-intro]", "[data-practicas-puntos]", "practicas-documentos");
      renderBloqueProceso(data.practicas.servicioSocial, "[data-servicio-intro]", "[data-servicio-puntos]", "servicio-documentos");
      renderBloqueProceso(data.practicas.servicioSocial, "[data-servicio-prepa-intro]", "[data-servicio-prepa-puntos]", "servicio-documentos-prepa");
      initLogoSwitch(data);
    })
    .catch(() => {
      root.querySelectorAll("[data-portal-grid]").forEach((grid) => {
        grid.textContent = "No se pudo cargar la información. Intenta más tarde.";
      });
    });
}

initPortalAlumno();
