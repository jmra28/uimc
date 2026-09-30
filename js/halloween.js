(function () {
  var HALLOWEEN_MONTH = 9; // Octubre (0-indexado)
  var STORAGE_KEY = "uim-halloween-hidden";

  var forzado = /[?&]halloween=(on|off)/.exec(location.search);
  var activo = forzado ? forzado[1] === "on" : new Date().getMonth() === HALLOWEEN_MONTH;
  if (!activo) return;

  document.documentElement.classList.add("halloween-season");

  var oculto = false;
  try {
    oculto = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {}
  if (oculto) document.documentElement.classList.add("halloween-hidden");

  function crearArana(modificador) {
    var div = document.createElement("div");
    div.className = "halloween-spider halloween-spider--" + modificador;
    div.setAttribute("aria-hidden", "true");
    div.innerHTML =
      '<svg width="30" height="24" viewBox="0 0 20 16" fill="none">' +
      '<g stroke="#20222b" stroke-width="1.1" stroke-linecap="round">' +
      '<line x1="10" y1="8" x2="1" y2="2"/><line x1="10" y1="8" x2="1" y2="8"/><line x1="10" y1="8" x2="2" y2="14"/>' +
      '<line x1="10" y1="8" x2="19" y2="2"/><line x1="10" y1="8" x2="19" y2="8"/><line x1="10" y1="8" x2="18" y2="14"/>' +
      "</g>" +
      '<circle cx="10" cy="9" r="3.4" fill="#20222b"/><circle cx="10" cy="4.6" r="2.1" fill="#20222b"/>' +
      "</svg>";
    return div;
  }

  ["left", "center-left", "center", "center-right", "right"].forEach(function (modificador) {
    document.body.appendChild(crearArana(modificador));
  });

  function crearMurcielago(modificador) {
    var div = document.createElement("div");
    div.className = "halloween-bat halloween-bat--" + modificador;
    div.setAttribute("aria-hidden", "true");
    div.innerHTML =
      '<svg viewBox="0 0 140 50" fill="#20222b">' +
      '<path d="M62,16 C40,6 15,4 4,14 C15,22 40,28 62,30 Z"/>' +
      '<path d="M78,16 C100,6 125,4 136,14 C125,22 100,28 78,30 Z"/>' +
      '<ellipse cx="70" cy="21" rx="9" ry="11"/>' +
      '<path d="M62,10 L58,2 L66,8 Z"/>' +
      '<path d="M78,10 L82,2 L74,8 Z"/>' +
      "</svg>";
    return div;
  }

  ["a", "b", "c"].forEach(function (modificador) {
    document.body.appendChild(crearMurcielago(modificador));
  });

  var witch = document.createElement("div");
  witch.className = "halloween-witch";
  witch.setAttribute("aria-hidden", "true");
  witch.innerHTML =
    '<svg width="56" height="46" viewBox="0 0 56 46" fill="none">' +
    '<ellipse cx="28" cy="37" rx="20" ry="3" fill="#20222b" opacity="0.5"/>' +
    '<path d="M6 34 L46 34" stroke="#8a5a2b" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M6 34 L-2 31 M6 34 L-2 37" stroke="#8a5a2b" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M20 32 C14 20 18 10 27 8 C36 10 39 20 33 32 Z" fill="#151f6d"/>' +
    '<circle cx="27" cy="16" r="5.4" fill="#e8c9a3"/>' +
    '<path d="M19 13 C21 4 33 4 35 13 C31 10 23 10 19 13 Z" fill="#151f6d"/>' +
    '<path d="M25 6 L27 -4 L29 6 Z" fill="#151f6d"/>' +
    "</svg>";
  document.body.appendChild(witch);

  var bubble = document.createElement("div");
  bubble.className = "halloween-bubble";
  bubble.innerHTML =
    '<div class="halloween-bubble__card">' +
    '<div class="halloween-bubble__header">' +
    "<span>🦇 UIM Búfalo</span>" +
    '<button type="button" class="halloween-bubble__close" aria-label="Cerrar">&times;</button>' +
    "</div>" +
    '<div class="halloween-bubble__body">' +
    "<p>¡Truco o trato! 🎃 ¿Tienes dudas sobre algún programa? Escríbenos.</p>" +
    '<a class="halloween-bubble__action" target="_blank" rel="noopener" href="https://wa.me/526181560378?text=%C2%A1Hola!%20Vi%20la%20sorpresa%20de%20Halloween%20en%20el%20sitio%20de%20UIM%20y%20quiero%20informaci%C3%B3n.">Iniciar conversación</a>' +
    '<div class="halloween-bubble__toggle-row">' +
    "<span>Decoración de Halloween</span>" +
    '<button type="button" class="halloween-bubble__switch" id="halloweenSwitch"></button>' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<button type="button" class="halloween-bubble__toggle" aria-label="Abrir sorpresa de Halloween" aria-expanded="false">🦇</button>';
  document.body.appendChild(bubble);

  var toggleBtn = bubble.querySelector(".halloween-bubble__toggle");
  var closeBtn = bubble.querySelector(".halloween-bubble__close");
  var switchBtn = bubble.querySelector("#halloweenSwitch");

  function actualizarSwitch() {
    var estaOculto = document.documentElement.classList.contains("halloween-hidden");
    switchBtn.textContent = estaOculto ? "Mostrar" : "Ocultar";
  }
  actualizarSwitch();

  function abrir() {
    bubble.classList.add("halloween-bubble--open");
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  function cerrar() {
    bubble.classList.remove("halloween-bubble--open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", function () {
    if (bubble.classList.contains("halloween-bubble--open")) {
      cerrar();
    } else {
      abrir();
    }
  });

  closeBtn.addEventListener("click", cerrar);

  document.addEventListener("click", function (event) {
    if (!event.composedPath().includes(bubble)) cerrar();
  });

  switchBtn.addEventListener("click", function () {
    var ocultarAhora = !document.documentElement.classList.contains("halloween-hidden");
    document.documentElement.classList.toggle("halloween-hidden", ocultarAhora);
    try {
      localStorage.setItem(STORAGE_KEY, ocultarAhora ? "1" : "0");
    } catch (e) {}
    actualizarSwitch();
  });
})();
