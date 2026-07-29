const overlayImage = document.querySelector(".video-particulas__overlay-image");

if (overlayImage) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    overlayImage.classList.add("video-particulas__overlay-image--visible");
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          overlayImage.classList.toggle("video-particulas__overlay-image--visible", entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(overlayImage);
  }
}
