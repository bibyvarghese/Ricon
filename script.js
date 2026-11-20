const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

const setMenuOpen = (isOpen) => {
  mobileMenu.classList.toggle("open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuButton.querySelector(".menu-word").textContent = isOpen ? "Close" : "Menu";
  document.body.classList.toggle("menu-open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
};

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
document.body.append(scrollProgress);

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.setProperty("--scroll-progress", Math.min(1, progress).toFixed(4));
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const newsletterForm = document.querySelector(".newsletter form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button");
    button.textContent = "✓";
  });
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    button.textContent = "Message sent";
  });
}

const revealTargets = document.querySelectorAll(
  ".story-image, .story-copy, .products .section-heading, .product-card, .featured-image, .featured-copy, .journal > article, .journal-card, .newsletter > div, .newsletter form, .page-hero-copy, .page-intro > *, .value-card, .catalog-card, .gallery-grid figure, .project-row, .contact-details, .contact-form",
);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

  revealTargets.forEach((target) => {
    const siblingIndex = Array.from(target.parentElement.children).indexOf(target);
    target.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 4) * 90}ms`);
    target.classList.add("scroll-reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (!reducedMotion) {
  const parallaxTargets = document.querySelectorAll(
    ".hero-image, .page-hero-image, .story-image, .product-image, .featured-image, .project-row-image, .catalog-card-image, .gallery-grid figure",
  );
  const parallaxCopy = document.querySelectorAll(
    ".page-hero-copy, .story-copy, .featured-copy, .catalog-card-copy, .project-row-copy",
  );
  let updatePending = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight;

    parallaxTargets.forEach((target) => {
      const bounds = target.getBoundingClientRect();
      const midpoint = bounds.top + bounds.height / 2;
      const distance = (midpoint - viewportHeight / 2) / (viewportHeight / 2 + bounds.height / 2);
      const offset = Math.max(-68, Math.min(68, distance * -68));
      target.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      target.classList.add("parallax-media");
    });

    parallaxCopy.forEach((target) => {
      const bounds = target.getBoundingClientRect();
      const midpoint = bounds.top + bounds.height / 2;
      const distance = (midpoint - viewportHeight / 2) / (viewportHeight / 2 + bounds.height / 2);
      const offset = Math.max(-22, Math.min(22, distance * 22));
      target.style.setProperty("--scroll-copy-y", `${offset.toFixed(1)}px`);
    });

    updatePending = false;
  };

  const requestParallaxUpdate = () => {
    if (!updatePending) {
      updatePending = true;
      window.requestAnimationFrame(updateParallax);
    }
  };

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  updateParallax();
}
