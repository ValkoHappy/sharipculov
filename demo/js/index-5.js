document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger-menu');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.menu-overlay');
    burger.addEventListener('click', function () {
        this.classList.toggle('active');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    overlay.addEventListener('click', function () {
        this.classList.remove('active');
        burger.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function () {
            burger.classList.remove('active');
            menu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
});
