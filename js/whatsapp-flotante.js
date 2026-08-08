const whatsappFlotante = document.querySelector(".whatsapp-flotante");

if (whatsappFlotante) {
  const toggleButton = whatsappFlotante.querySelector(".whatsapp-flotante__toggle");
  const closeButton = whatsappFlotante.querySelector(".whatsapp-flotante__close");

  function setVisible(visible) {
    whatsappFlotante.classList.toggle("whatsapp-flotante--visible", visible);
    toggleButton.setAttribute("aria-expanded", String(visible));
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
