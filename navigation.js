// ================= CRCT NAVIGATION =================

document.addEventListener("DOMContentLoaded", () => {

  const header = document.getElementById("crctHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!header || !menuToggle || !navMenu) return;

  // Open and close mobile menu
  function toggleMenu(isOpen) {
    navMenu.classList.toggle("open", isOpen);
    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    // Prevent body scroll when menu is open on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    toggleMenu(!isOpen);
  });

  // Close menu when any navigation link or CTA in the menu is clicked
  const menuItems = navMenu.querySelectorAll("a");
  menuItems.forEach(link => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !header.contains(event.target) &&
      navMenu.classList.contains("open")
    ) {
      toggleMenu(false);
    }
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  // Sticky navbar shadow on scroll
  function handleScroll() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Reset mobile menu when switching to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      toggleMenu(false);
      document.body.style.overflow = "";
    }
  });

  // Highlight active link based on current page URL
  const currentPath = window.location.pathname.toLowerCase();
  const isTherapyPage = currentPath.includes("occupational-therapy.html") ||
                        currentPath.includes("behavioral-therapy.html") ||
                        currentPath.includes("speech-therapy.html") ||
                        currentPath.includes("sensory-integration-therapy.html") ||
                        currentPath.includes("special-education.html");

  navLinks.forEach(link => {
    const href = (link.getAttribute("href") || "").toLowerCase().replace(/^\.\//, "");
    const baseHref = href.split("#")[0];

    let isCurrent = false;
    if (baseHref === "index.html" || baseHref === "") {
      isCurrent = (currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath.endsWith("\\")) && !isTherapyPage;
    } else if (baseHref === "about.html") {
      isCurrent = currentPath.includes("about.html");
    } else if (baseHref === "services.html") {
      isCurrent = currentPath.includes("services.html") || isTherapyPage;
    } else if (baseHref === "contact.html") {
      isCurrent = currentPath.includes("contact.html");
    }

    if (isCurrent) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // Update dynamic footer copyright year across all pages
  const yearEls = document.querySelectorAll("#footer-year, .footer-year");
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = year;
  });

});
