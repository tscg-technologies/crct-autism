
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");

        if (!question) return;

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            faqItems.forEach((faq) => {
                faq.classList.remove("active");

                const button = faq.querySelector(".faq-question");
                if (button) {
                    button.setAttribute("aria-expanded", "false");
                }
            });

            if (!isActive) {
                item.classList.add("active");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
});
