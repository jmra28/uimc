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

function crearItemDocLista(item) {
  const pendiente = item.url.startsWith("#TODO");

  const li = document.createElement("li");
  li.className = "portal-alumno__doc-list-item";

  const link = document.createElement(pendiente ? "span" : "a");
  link.className = "portal-alumno__doc-list-link";
  if (pendiente) {
    link.classList.add("portal-alumno__doc-list-link--pendiente");
  } else {
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
  }
  link.innerHTML = ICONO_DOCUMENTO_SVG;

  const textWrap = document.createElement("span");
  textWrap.className = "portal-alumno__doc-list-text";

  const title = document.createElement("span");
  title.className = "portal-alumno__doc-list-title";
  title.textContent = item.titulo;
  textWrap.appendChild(title);

  if (item.descripcion) {
    const desc = document.createElement("span");
    desc.className = "portal-alumno__doc-list-desc";
    desc.textContent = item.descripcion;
    textWrap.appendChild(desc);
  }

  link.appendChild(textWrap);

  if (pendiente) {
    const tag = document.createElement("span");
    tag.className = "portal-alumno__card-tag";
    tag.textContent = "Próximamente";
    link.appendChild(tag);
  }

  li.appendChild(link);
  return li;
}

function crearItemDocProceso(item) {
  const li = document.createElement("li");
  li.className = "portal-alumno__doc-list-item portal-alumno__doc-list-item--proceso";

  const details = document.createElement("details");
  details.className = "portal-alumno__proceso";

  const summary = document.createElement("summary");
  summary.className = "portal-alumno__proceso-summary";
  summary.innerHTML = ICONO_DOCUMENTO_SVG;

  const textWrap = document.createElement("span");
  textWrap.className = "portal-alumno__doc-list-text";

  const title = document.createElement("span");
  title.className = "portal-alumno__doc-list-title";
  title.textContent = item.titulo;
  textWrap.appendChild(title);

  if (item.descripcion) {
    const desc = document.createElement("span");
    desc.className = "portal-alumno__doc-list-desc";
    desc.textContent = item.descripcion;
    textWrap.appendChild(desc);
  }

  summary.appendChild(textWrap);
  summary.innerHTML += `
    <svg class="portal-alumno__collapsible-icon portal-alumno__proceso-toggle" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  details.appendChild(summary);

  const ol = document.createElement("ol");
  ol.className = "portal-alumno__proceso-steps";
  item.pasos.forEach((paso) => {
    const paso_li = document.createElement("li");
    paso_li.className = "portal-alumno__proceso-step";

    const pasoTitulo = document.createElement("span");
    pasoTitulo.className = "portal-alumno__proceso-step-title";
    pasoTitulo.textContent = paso.titulo;
    paso_li.appendChild(pasoTitulo);

    const pasoDetalle = document.createElement("p");
    pasoDetalle.className = "portal-alumno__proceso-step-detail";
    pasoDetalle.textContent = paso.detalle;
    paso_li.appendChild(pasoDetalle);

    ol.appendChild(paso_li);
  });
  details.appendChild(ol);

  li.appendChild(details);
  return li;
}

function renderListaDocs(panel, items, listName) {
  const lista = panel.querySelector(`[data-portal-list="${listName}"]`);
  if (!lista || !items) return;
  items.forEach((item) => {
    lista.appendChild(item.pasos ? crearItemDocProceso(item) : crearItemDocLista(item));
  });
}

function formatearFechaAviso(fechaISO) {
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const [year, month, day] = fechaISO.split("-").map(Number);
  return `${day} de ${meses[month - 1]} de ${year}`;
}

function crearAviso(aviso) {
  const details = document.createElement("details");
  details.className = "portal-alumno__aviso";
  if (aviso.estado === "pasado") details.classList.add("portal-alumno__aviso--pasado");
  if (aviso.abierto) details.open = true;

  const summary = document.createElement("summary");
  summary.className = "portal-alumno__aviso-summary";

  if (aviso.foto) {
    const img = document.createElement("img");
    img.className = "portal-alumno__aviso-foto";
    img.src = aviso.foto;
    img.alt = aviso.titulo;
    summary.appendChild(img);
  }

  const head = document.createElement("div");
  head.className = "portal-alumno__aviso-head";

  const estado = document.createElement("span");
  estado.className = "portal-alumno__aviso-estado";
  estado.textContent = aviso.estado === "pasado" ? "Evento pasado" : "Próximo evento";
  head.appendChild(estado);

  const titulo = document.createElement("h4");
  titulo.className = "portal-alumno__aviso-titulo";
  titulo.textContent = aviso.titulo;
  head.appendChild(titulo);

  if (aviso.fecha) {
    const fecha = document.createElement("p");
    fecha.className = "portal-alumno__aviso-fecha";
    fecha.textContent = formatearFechaAviso(aviso.fecha);
    head.appendChild(fecha);
  }

  const toggle = document.createElement("span");
  toggle.className = "portal-alumno__aviso-toggle";
  toggle.innerHTML = `
    <span class="portal-alumno__aviso-toggle-text--closed">Leer nota</span>
    <span class="portal-alumno__aviso-toggle-text--open">Ocultar nota</span>
  `;
  head.appendChild(toggle);

  summary.appendChild(head);
  details.appendChild(summary);

  const desc = document.createElement("p");
  desc.className = "portal-alumno__aviso-desc";
  desc.textContent = aviso.descripcion;
  details.appendChild(desc);

  return details;
}

function renderAvisos(panel, avisos) {
  const lista = panel.querySelector("[data-portal-avisos]");
  if (!lista) return;

  if (!avisos || avisos.length === 0) {
    const empty = document.createElement("p");
    empty.className = "portal-alumno__avisos-empty";
    empty.textContent = "Aún no hay avisos publicados. Próximamente encontrarás aquí eventos y comunicados.";
    lista.appendChild(empty);
    return;
  }

  avisos.forEach((aviso) => lista.appendChild(crearAviso(aviso)));
}

const ICONO_RECARGO_SVG = `
  <svg class="politicas-pago__dia-alerta-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 1 21h22L12 3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M12 10v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="18" r="1" fill="currentColor"/>
  </svg>
`;

const ICONO_CHECK_SVG = `
  <svg class="politicas-pago__check-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <path d="M8 12.5 10.8 15.3 16 9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const ICONO_METODO_SVG = `
  <svg class="politicas-pago__metodo-icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <path d="M2 9.5h20" stroke="currentColor" stroke-width="1.6"/>
    <path d="M5.5 14.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
`;

function crearDiaPagoCard(item) {
  const card = document.createElement("div");
  card.className = "politicas-pago__dia-card";

  const badge = document.createElement("div");
  badge.className = "politicas-pago__dia-badge";
  badge.innerHTML = `<span class="politicas-pago__dia-numero">${item.diaLimite}</span><span class="politicas-pago__dia-label">de cada mes</span>`;
  card.appendChild(badge);

  const body = document.createElement("div");
  body.className = "politicas-pago__dia-body";

  const nivel = document.createElement("h4");
  nivel.className = "politicas-pago__dia-nivel";
  nivel.textContent = item.nivel;
  body.appendChild(nivel);

  const alerta = document.createElement("p");
  alerta.className = "politicas-pago__dia-alerta";
  alerta.innerHTML = `${ICONO_RECARGO_SVG}<span>A partir del día <strong>${item.diaRecargo}</strong> se genera un recargo de <strong>${item.montoRecargo}</strong>.</span>`;
  body.appendChild(alerta);

  card.appendChild(body);
  return card;
}

function crearMetodoPagoChip(item) {
  const chip = document.createElement("div");
  chip.className = "politicas-pago__metodo";
  chip.innerHTML = `
    <span class="politicas-pago__metodo-icon-wrap">${ICONO_METODO_SVG}</span>
    <span class="politicas-pago__metodo-text">
      <span class="politicas-pago__metodo-nombre">${item.nombre}</span>
      <span class="politicas-pago__metodo-detalle">${item.detalle}</span>
    </span>
  `;
  return chip;
}

function crearConceptoItem(texto) {
  const li = document.createElement("li");
  li.className = "politicas-pago__concepto";
  li.innerHTML = `${ICONO_CHECK_SVG}<span>${texto}</span>`;
  return li;
}

function crearReinscripcionItem(item) {
  const li = document.createElement("li");
  li.className = "politicas-pago__reinscripcion-item";
  li.innerHTML = `
    <span class="politicas-pago__reinscripcion-dot"></span>
    <span class="politicas-pago__reinscripcion-text">
      <strong>${item.nivel}</strong>
      <span>${item.detalle}</span>
    </span>
  `;
  return li;
}

function renderPoliticasPago(politicasPago) {
  if (!politicasPago) return;

  document.querySelectorAll("[data-politicas-pago]").forEach((contenedor) => {
    const diasWrap = document.createElement("div");
    diasWrap.className = "politicas-pago__dias";
    politicasPago.diasPago.forEach((item) => diasWrap.appendChild(crearDiaPagoCard(item)));
    contenedor.appendChild(diasWrap);

    const metodosTitle = document.createElement("h3");
    metodosTitle.className = "politicas-pago__subtitle";
    metodosTitle.textContent = "Formas de pago";
    contenedor.appendChild(metodosTitle);

    const metodosWrap = document.createElement("div");
    metodosWrap.className = "politicas-pago__metodos";
    politicasPago.metodosPago.forEach((item) => metodosWrap.appendChild(crearMetodoPagoChip(item)));
    contenedor.appendChild(metodosWrap);

    const columnas = document.createElement("div");
    columnas.className = "politicas-pago__columnas";

    const conceptosCard = document.createElement("div");
    conceptosCard.className = "politicas-pago__panel-card";
    conceptosCard.innerHTML = `<h3 class="politicas-pago__subtitle">Para nuevo ingreso</h3>`;
    const conceptosList = document.createElement("ul");
    conceptosList.className = "politicas-pago__conceptos";
    politicasPago.conceptosNuevoIngreso.forEach((texto) => conceptosList.appendChild(crearConceptoItem(texto)));
    conceptosCard.appendChild(conceptosList);
    columnas.appendChild(conceptosCard);

    const reinscripcionesCard = document.createElement("div");
    reinscripcionesCard.className = "politicas-pago__panel-card";
    reinscripcionesCard.innerHTML = `<h3 class="politicas-pago__subtitle">Reinscripciones y anualidades</h3>`;
    const reinscripcionesList = document.createElement("ul");
    reinscripcionesList.className = "politicas-pago__reinscripciones";
    politicasPago.reinscripciones.forEach((item) => reinscripcionesList.appendChild(crearReinscripcionItem(item)));
    reinscripcionesCard.appendChild(reinscripcionesList);
    columnas.appendChild(reinscripcionesCard);

    contenedor.appendChild(columnas);
  });
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

  renderListaDocs(panel, data.documentos.reglamentos, "reglamentos");
  renderListaDocs(panel, data.documentos.tutoriales, "tutoriales");
  renderAvisos(panel, data.documentos.avisos);
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
      renderPoliticasPago(data.politicasPago);
      renderBloqueProceso(data.practicas.licenciatura, "[data-practicas-intro]", "[data-practicas-puntos]", "practicas-documentos");
      renderBloqueProceso(data.practicas.servicioSocial, "[data-servicio-intro]", "[data-servicio-puntos]", "servicio-documentos");
      renderBloqueProceso(data.practicas.servicioSocial, "[data-servicio-prepa-intro]", "[data-servicio-prepa-puntos]", "servicio-documentos-prepa");
      initLogoSwitch(data);
    })
    .catch(() => {
      root.querySelectorAll("[data-portal-grid], [data-portal-list], [data-portal-avisos]").forEach((grid) => {
        grid.textContent = "No se pudo cargar la información. Intenta más tarde.";
      });
    });
}

initPortalAlumno();
