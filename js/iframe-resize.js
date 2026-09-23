(function () {
  if (window.self === window.top) return;

  function enviarAltura() {
    window.parent.postMessage(
      { tipo: "portal-alumno-resize", altura: document.documentElement.scrollHeight },
      "*"
    );
  }

  new ResizeObserver(enviarAltura).observe(document.body);
  window.addEventListener("load", enviarAltura);
})();
