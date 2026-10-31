(function () {
  var ANIMACIONES = {
    9: { carpeta: "oct_halloween", nombre: "Halloween", tipo: "ambiente" },
    10: { carpeta: "nov_dia-de-muertos", nombre: "Día de Muertos", tipo: "pantallaCompleta" },
  };

  var STORAGE_KEY = "uim-anim-mens-hidden";

  var forzado = /[?&]animacion=(on|off)/.exec(location.search);
  var mesActual = new Date().getMonth();
  var entrada = ANIMACIONES[mesActual];

  var activo = forzado ? forzado[1] === "on" && Boolean(entrada) : Boolean(entrada);
  if (!activo || !entrada) return;

  var base = "assets/anim_mens/" + entrada.carpeta + "/";

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = base + "style.css";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = base + "script.js";
  script.defer = true;
  document.body.appendChild(script);

  document.documentElement.classList.add("anim-mens-season");

  var esPantallaCompleta = entrada.tipo === "pantallaCompleta";

  var mostrando;
  if (esPantallaCompleta) {
    mostrando = false;
  } else {
    var oculto = false;
    try {
      oculto = localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {}
    mostrando = !oculto;
    if (oculto) document.documentElement.classList.add("anim-mens-hidden");
  }

  function actualizarBoton(btn) {
    var texto = btn.querySelector(".anim-mens-toggle__texto");
    texto.textContent = mostrando ? "Desactivar animación" : "Activar animación";
    btn.classList.toggle("anim-mens-toggle--activo", mostrando);
    btn.setAttribute("aria-pressed", String(mostrando));
  }

  function crearBoton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "anim-mens-toggle";
    btn.setAttribute("aria-label", "Activar o desactivar la animación de " + entrada.nombre);
    btn.innerHTML =
      '<span class="anim-mens-toggle__icono" aria-hidden="true">✨</span>' +
      '<span class="anim-mens-toggle__texto"></span>';
    actualizarBoton(btn);

    btn.addEventListener("click", function () {
      mostrando = !mostrando;

      if (!esPantallaCompleta) {
        document.documentElement.classList.toggle("anim-mens-hidden", !mostrando);
        try {
          localStorage.setItem(STORAGE_KEY, mostrando ? "0" : "1");
        } catch (e) {}
      }

      document.dispatchEvent(
        new CustomEvent("anim-mens:toggle", { detail: { activo: mostrando, tipo: entrada.tipo } })
      );
      actualizarBoton(btn);
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", crearBoton);
  } else {
    crearBoton();
  }
})();
