(function () {
    var deadline = new Date('2026-04-30T23:59:59');
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
        var diff = deadline - Date.now();
        if (diff <= 0) {
            var el = document.querySelector('.hero-countdown');
            if (el)
                el.style.display = 'none';
            return;
        }
        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff % 86400000) / 3600000);
        var minutes = Math.floor((diff % 3600000) / 60000);
        var seconds = Math.floor((diff % 60000) / 1000);
        document.getElementById('cd-days').textContent = pad(days);
        document.getElementById('cd-hours').textContent = pad(hours);
        document.getElementById('cd-minutes').textContent = pad(minutes);
        document.getElementById('cd-seconds').textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
})();
