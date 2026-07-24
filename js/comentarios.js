const comentariosCarousel = document.querySelector(".comentarios__carousel");

if (comentariosCarousel) {
  const radios = Array.from(comentariosCarousel.querySelectorAll(".comentarios__radio"));
  const groups = Array.from(comentariosCarousel.querySelectorAll(".comentarios__group"));
  const prevBtn = comentariosCarousel.querySelector(".comentarios__nav--prev");
  const nextBtn = comentariosCarousel.querySelector(".comentarios__nav--next");
  const autoplayDelay = 5000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplayTimer = null;

  function getCurrentIndex() {
    return radios.findIndex((radio) => radio.checked);
  }

  function updateActiveGroup() {
    const index = getCurrentIndex();
    groups.forEach((group, i) => group.classList.toggle("comentarios__group--active", i === index));
  }

  function goTo(index) {
    const length = radios.length;
    const wrapped = (index + length) % length;
    radios[wrapped].checked = true;
    updateActiveGroup();
  }

  function goNext() {
    goTo(getCurrentIndex() + 1);
  }

  function goPrev() {
    goTo(getCurrentIndex() - 1);
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

  prevBtn.addEventListener("click", () => {
    goPrev();
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    goNext();
    resetAutoplay();
  });

  radios.forEach((radio) =>
    radio.addEventListener("change", () => {
      updateActiveGroup();
      resetAutoplay();
    })
  );

  comentariosCarousel.addEventListener("mouseenter", stopAutoplay);
  comentariosCarousel.addEventListener("mouseleave", startAutoplay);

  updateActiveGroup();
  startAutoplay();
}
