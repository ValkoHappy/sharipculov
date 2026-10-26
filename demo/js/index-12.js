document.querySelectorAll('.prog-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var tab = this.dataset.tab;
        document.querySelectorAll('.prog-tab').forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.prog-panel').forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    });
});
(function () {
    var key = 'siteVisitors';
    var count = parseInt(localStorage.getItem(key) || '0', 10);
    var visited = sessionStorage.getItem('visited');
    if (!visited) {
        count += 1;
        localStorage.setItem(key, count);
        sessionStorage.setItem('visited', '1');
    }
    var el = document.getElementById('visitorCount');
    if (el)
        el.textContent = count.toLocaleString('ru-RU');
})();
