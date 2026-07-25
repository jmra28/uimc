const barrasProgresoItems = document.querySelectorAll(".barras-progreso__item");
const prefersReducedMotionBarras = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animatePercent(el) {
  const target = Number(el.dataset.target);

  if (prefersReducedMotionBarras) {
    el.textContent = `${target}%`;
    return;
  }

  const duration = 1500;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = `${Math.floor(progress * target)}%`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${target}%`;
    }
  }

  requestAnimationFrame(step);
}

function animateBar(item) {
  const fill = item.querySelector(".barras-progreso__fill");
  const percent = item.querySelector(".barras-progreso__percent");
  const target = Number(fill.dataset.target);

  fill.style.width = `${target}%`;
  animatePercent(percent);
}

const barrasProgresoObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateBar(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

barrasProgresoItems.forEach((item) => barrasProgresoObserver.observe(item));
