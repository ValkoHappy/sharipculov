document.addEventListener('DOMContentLoaded', function () {
    var skillsSection = document.querySelector('.skills-section');
    if (!skillsSection)
        return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-fill').forEach(function (fill) {
                    fill.style.width = fill.dataset.width + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    observer.observe(skillsSection);
});
