const heroSection = document.querySelector(".hero");

if (heroSection) {
  const radios = Array.from(heroSection.querySelectorAll(".hero__radio"));
  const slides = Array.from(heroSection.querySelectorAll(".hero__slide"));
  const slider = heroSection.querySelector(".hero__slider");
  const autoplayDelay = 5000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplayTimer = null;

  function getCurrentIndex() {
    return radios.findIndex((radio) => radio.checked);
  }

  function updateActiveSlide() {
    const index = getCurrentIndex();
    slides.forEach((slide, i) => slide.classList.toggle("hero__slide--active", i === index));
  }

  function goNext() {
    const length = radios.length;
    const next = (getCurrentIndex() + 1) % length;
    radios[next].checked = true;
    updateActiveSlide();
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

  radios.forEach((radio) =>
    radio.addEventListener("change", () => {
      updateActiveSlide();
      resetAutoplay();
    })
  );

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  updateActiveSlide();
  startAutoplay();
}
