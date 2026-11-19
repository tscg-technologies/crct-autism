// ==========================================
// CRCT HERO CAROUSEL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  if (!slides.length) return;

  const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
  const prevButton = carousel.querySelector(".prev-arrow");
  const nextButton = carousel.querySelector(".next-arrow");
  let currentIndex = 0;
  let autoplayTimer = null;
  let isHovered = false;
  const autoplayDelay = 5000;
  const prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle("active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function stopAutoplay() {
    clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (isHovered || prefersReducedMotion.matches || document.hidden) {
      return;
    }

    autoplayTimer = window.setTimeout(() => {
      showSlide(currentIndex + 1);
      startAutoplay();
    }, autoplayDelay);
  }

  function navigateTo(index) {
    showSlide(index);
    startAutoplay();
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => navigateTo(currentIndex + 1));
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => navigateTo(currentIndex - 1));
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => navigateTo(index));
  });

  carousel.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoplay();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateTo(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateTo(currentIndex - 1);
    }
  });

  document.addEventListener("visibilitychange", startAutoplay);

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", startAutoplay);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(startAutoplay);
  }

  showSlide(0);
  startAutoplay();
});