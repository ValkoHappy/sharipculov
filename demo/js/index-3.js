document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".path-step");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
            }
        });
    }, { threshold: 0.1 });
    steps.forEach((step) => {
        observer.observe(step);
    });
});
