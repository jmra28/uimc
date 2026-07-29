const sliderCarrusel = document.querySelector(".slider-carrusel");

if (sliderCarrusel) {
  const radios = Array.from(sliderCarrusel.querySelectorAll(".slider-carrusel__radio"));
  const autoplayDelay = 5000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplayTimer = null;

  function getCurrentIndex() {
    return radios.findIndex((radio) => radio.checked);
  }

  function goNext() {
    const next = (getCurrentIndex() + 1) % radios.length;
    radios[next].checked = true;
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(goNext, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  radios.forEach((radio) => radio.addEventListener("change", resetAutoplay));

  sliderCarrusel.addEventListener("mouseenter", stopAutoplay);
  sliderCarrusel.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}
