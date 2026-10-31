const whatsappFlotante = document.querySelector(".whatsapp-flotante");

if (whatsappFlotante) {
  const toggleButton = whatsappFlotante.querySelector(".whatsapp-flotante__toggle");
  const closeButton = whatsappFlotante.querySelector(".whatsapp-flotante__close");
  const reglas = whatsappFlotante.querySelector("[data-whatsapp-reglas]");
  const contenido = whatsappFlotante.querySelector("[data-whatsapp-contenido]");
  const continuarButton = whatsappFlotante.querySelector("[data-whatsapp-continuar]");

  function setVisible(visible) {
    whatsappFlotante.classList.toggle("whatsapp-flotante--visible", visible);
    toggleButton.setAttribute("aria-expanded", String(visible));
    if (!visible && reglas && contenido) {
      reglas.hidden = false;
      contenido.hidden = true;
    }
  }

  if (continuarButton && reglas && contenido) {
    continuarButton.addEventListener("click", () => {
      reglas.hidden = true;
      contenido.hidden = false;
    });
  }

  toggleButton.addEventListener("click", () => {
    setVisible(!whatsappFlotante.classList.contains("whatsapp-flotante--visible"));
  });

  closeButton.addEventListener("click", () => setVisible(false));

  document.addEventListener("click", (event) => {
    if (!whatsappFlotante.contains(event.target)) {
      setVisible(false);
    }
  });
}
