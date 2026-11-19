// Main Application Logic for CRCT
document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
});

/**
 * FAQ Accordion Helper
 * Handles single-open behavior on <details> accordion
 */
function initFaqAccordion() {
  const faqAccordion = document.getElementById('faqAccordion');
  if (!faqAccordion) return;

  const faqItems = faqAccordion.querySelectorAll('details.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((targetDetail) => {
    targetDetail.addEventListener('toggle', () => {
      if (targetDetail.open) {
        faqItems.forEach((otherDetail) => {
          if (otherDetail !== targetDetail && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });
}
