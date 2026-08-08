const NIVELES = [
  { value: "secundaria", label: "Secundaria" },
  { value: "preparatoria", label: "Preparatoria" },
  { value: "licenciatura", label: "Licenciatura" },
  { value: "maestria", label: "Maestría" },
  { value: "doctorado", label: "Doctorado" },
];

const NIVEL_PROGRAMAS_URL = {
  licenciatura: "programas/lic.json",
  maestria: "programas/maes.json",
  doctorado: "programas/doct.json",
};

const NIVEL_SIN_PROGRAMA = ["secundaria", "preparatoria"];

const programasCache = {};

function fetchProgramas(url) {
  if (programasCache[url]) return Promise.resolve(programasCache[url]);
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      programasCache[url] = data;
      return data;
    });
}

function crearOpcion(texto, valor) {
  const opt = document.createElement("option");
  opt.textContent = texto;
  opt.value = valor === undefined ? texto : valor;
  return opt;
}

function poblarNivelSelect(nivelSelect) {
  nivelSelect.innerHTML = "";

  const placeholder = crearOpcion("Selecciona tu nivel de interes...", "");
  placeholder.disabled = true;
  placeholder.selected = true;
  nivelSelect.appendChild(placeholder);

  NIVELES.forEach(({ value, label }) => {
    nivelSelect.appendChild(crearOpcion(label, value));
  });
}

function resetProgramaSelect(programaSelect, texto) {
  programaSelect.innerHTML = "";
  const placeholder = crearOpcion(texto, "");
  placeholder.disabled = true;
  placeholder.selected = true;
  programaSelect.appendChild(placeholder);
}

function actualizarProgramaSelect(nivelSelect, programaSelect) {
  const nivel = nivelSelect.value;

  if (!nivel) {
    resetProgramaSelect(programaSelect, "Selecciona tu programa de interes ...");
    programaSelect.disabled = true;
    return;
  }

  if (NIVEL_SIN_PROGRAMA.includes(nivel)) {
    resetProgramaSelect(programaSelect, "No aplica para este nivel");
    programaSelect.disabled = true;
    return;
  }

  const url = NIVEL_PROGRAMAS_URL[nivel];
  resetProgramaSelect(programaSelect, "Cargando programas...");
  programaSelect.disabled = true;

  fetchProgramas(url)
    .then((programas) => {
      if (nivelSelect.value !== nivel) return; // el usuario ya cambió de nivel
      resetProgramaSelect(programaSelect, "Selecciona tu programa de interes ...");
      programas.forEach((programa) => {
        programaSelect.appendChild(crearOpcion(programa));
      });
      programaSelect.disabled = false;
    })
    .catch(() => {
      if (nivelSelect.value !== nivel) return;
      resetProgramaSelect(programaSelect, "No se pudo cargar el listado");
      programaSelect.disabled = true;
    });
}

function initFormularioProgramas(form) {
  const selects = form.querySelectorAll(".formulario__select");
  const nivelSelect = selects[0];
  const programaSelect = selects[1];
  if (!nivelSelect || !programaSelect) return;

  poblarNivelSelect(nivelSelect);
  resetProgramaSelect(programaSelect, "Selecciona tu programa de interes ...");
  programaSelect.disabled = true;

  nivelSelect.addEventListener("change", () => actualizarProgramaSelect(nivelSelect, programaSelect));
}

document.querySelectorAll(".formulario__form").forEach(initFormularioProgramas);
