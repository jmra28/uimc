const comentariosCarousel = document.querySelector(".comentarios__carousel");

if (comentariosCarousel) {
  const track = comentariosCarousel.querySelector(".comentarios__track");
  const cards = Array.from(comentariosCarousel.querySelectorAll(".comentarios__card"));
  const radios = Array.from(comentariosCarousel.querySelectorAll(".comentarios__radio"));
  const autoplayDelay = 5000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopQuery = window.matchMedia("(min-width: 768px)");

  const lastTrackIndex = cards.length - 1;
  let trackIndex = 1;
  let autoplayTimer = null;

  function visibleCount() {
    return desktopQuery.matches ? 3 : 1;
  }

  function updateTransform(animate) {
    if (!animate) track.style.transition = "none";

    const percent = 100 / visibleCount();
    const offset = Math.floor(visibleCount() / 2);
    track.style.transform = `translateX(-${(trackIndex - offset) * percent}%)`;

    if (!animate) {
      void track.offsetWidth;
      track.style.transition = "";
    }
  }

  function updateFeaturedCard() {
    cards.forEach((card) => card.classList.remove("comentarios__card--featured"));
    cards[trackIndex].classList.add("comentarios__card--featured");
  }

  function syncRadio() {
    let real = trackIndex;
    if (trackIndex === 0) real = radios.length;
    if (trackIndex === lastTrackIndex) real = 1;
    radios[real - 1].checked = true;
  }

  function goNext() {
    trackIndex += 1;
    updateTransform(true);
    updateFeaturedCard();
    syncRadio();
  }

  function goToReal(real) {
    trackIndex = real;
    updateTransform(true);
    updateFeaturedCard();
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

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;
    if (trackIndex === lastTrackIndex) {
      trackIndex = 1;
      updateTransform(false);
      updateFeaturedCard();
    }
  });

  radios.forEach((radio, i) =>
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      goToReal(i + 1);
      resetAutoplay();
    })
  );

  desktopQuery.addEventListener("change", () => updateTransform(false));
  window.addEventListener("resize", () => updateTransform(false));

  comentariosCarousel.addEventListener("mouseenter", stopAutoplay);
  comentariosCarousel.addEventListener("mouseleave", startAutoplay);

  updateTransform(false);
  updateFeaturedCard();
  startAutoplay();
}
