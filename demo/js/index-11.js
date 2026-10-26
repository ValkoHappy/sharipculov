var progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
});
var backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
    backBtn.classList.toggle('visible', window.scrollY > 300);
});
backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
(function () {
    if (!localStorage.getItem('cookieAccepted')) {
        document.getElementById('cookieBanner').classList.add('visible');
    }
    document.getElementById('cookieAccept').addEventListener('click', function () {
        localStorage.setItem('cookieAccepted', '1');
        document.getElementById('cookieBanner').classList.remove('visible');
    });
})();
