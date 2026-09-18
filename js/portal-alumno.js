function crearTarjeta(item, textoBoton) {
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
    button.textContent = textoBoton;
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
    data.plataformas.forEach((item) => plataformasGrid.appendChild(crearTarjeta(item, "Ingresar")));
  }

  const documentosGrid = panel.querySelector('[data-portal-grid="documentos"]');
  if (documentosGrid) {
    data.documentos.forEach((item) => documentosGrid.appendChild(crearTarjeta(item, "Ver documento")));
  }
}

function crearItemDirectorio(item) {
  const card = document.createElement("div");
  card.className = "portal-alumno__directorio-item";

  const area = document.createElement("p");
  area.className = "portal-alumno__directorio-area";
  area.textContent = item.area;
  card.appendChild(area);

  const telefono = document.createElement("a");
  telefono.className = "portal-alumno__directorio-phone";
  telefono.href = `tel:${item.telefono}`;
  telefono.textContent = item.telefono;
  card.appendChild(telefono);

  return card;
}

function renderDirectorio(directorio) {
  const grid = document.querySelector('[data-portal-grid="directorio"]');
  if (!grid || !directorio) return;

  directorio.forEach((item) => grid.appendChild(crearItemDirectorio(item)));
}

function initPortalAlumno() {
  const root = document.querySelector(".portal-alumno");
  if (!root) return;

  fetch("data/portal-alumno.json")
    .then((res) => res.json())
    .then((data) => {
      renderInstitucion("uim", data.uim);
      renderInstitucion("ial", data.ial);
      renderDirectorio(data.directorio);
    })
    .catch(() => {
      root.querySelectorAll("[data-portal-grid]").forEach((grid) => {
        grid.textContent = "No se pudo cargar la información. Intenta más tarde.";
      });
    });
}

initPortalAlumno();
