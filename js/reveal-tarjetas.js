const revealTarjetas = document.querySelectorAll(".oferta-academica__card, .descargas__card, .tarjetas__card, .talleres-galeria__card, .barras-progreso__image, .barras-progreso__content, .mision__card, .valores__item, .pasos__item");

const revealTarjetasPorGrupo = new Map();
revealTarjetas.forEach((tarjeta) => {
  const grupo = tarjeta.parentElement;
  const indice = revealTarjetasPorGrupo.get(grupo) || 0;
  tarjeta.style.transitionDelay = `${Math.min(indice, 8) * 80}ms`;
  revealTarjetasPorGrupo.set(grupo, indice + 1);
});

const revealTarjetasObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTarjetas.forEach((tarjeta) => revealTarjetasObserver.observe(tarjeta));
