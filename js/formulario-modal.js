function initFormularioModal(modal) {
  const id = modal.id;
  const openTriggers = document.querySelectorAll(`[data-modal-open="${id}"]`);
  const closeTriggers = modal.querySelectorAll("[data-modal-close]");

  function abrir(event) {
    event.preventDefault();
    modal.classList.add("formulario-modal--visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("formulario-modal-open");
  }

  function cerrar() {
    modal.classList.remove("formulario-modal--visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("formulario-modal-open");
  }

  openTriggers.forEach((trigger) => trigger.addEventListener("click", abrir));
  closeTriggers.forEach((trigger) => trigger.addEventListener("click", cerrar));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("formulario-modal--visible")) cerrar();
  });
}

document.querySelectorAll(".formulario-modal").forEach(initFormularioModal);
