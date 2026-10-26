document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form)
        return;
    function showError(inputId, errorId, show) {
        var input = document.getElementById(inputId);
        var err = document.getElementById(errorId);
        if (!input || !err)
            return;
        if (show) {
            input.classList.add('input-error');
            err.classList.add('visible');
        }
        else {
            input.classList.remove('input-error');
            err.classList.remove('visible');
        }
    }
    function isValidPhone(v) {
        return /^[\d\s\+\-\(\)]{7,}$/.test(v);
    }
    ['formName', 'formPhone', 'formGoal'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el)
            el.addEventListener('input', function () {
                var errId = { formName: 'nameError', formPhone: 'phoneError', formGoal: 'goalError' }[id];
                showError(id, errId, false);
            });
    });
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var name = document.getElementById('formName').value.trim();
        var phone = document.getElementById('formPhone').value.trim();
        var goal = document.getElementById('formGoal').value;
        var valid = true;
        if (!name) {
            showError('formName', 'nameError', true);
            valid = false;
        }
        if (!phone || !isValidPhone(phone)) {
            showError('formPhone', 'phoneError', true);
            valid = false;
        }
        if (!goal) {
            showError('formGoal', 'goalError', true);
            valid = false;
        }
        if (!valid)
            return;
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Отправляем...';
        try {
            await saveApplication({ name: name, phone: phone, goal: goal });
        }
        catch (err) {
            console.warn('Ошибка сохранения заявки:', err);
        }
        setTimeout(function () {
            form.reset();
            btn.disabled = false;
            btn.textContent = 'Отправить заявку';
            var success = document.getElementById('formSuccess');
            success.classList.add('visible');
            setTimeout(function () {
                success.classList.remove('visible');
            }, 5000);
            if (!sessionStorage.getItem('userId')) {
                setTimeout(function () {
                    var hint = document.getElementById('registerHint');
                    if (hint)
                        hint.style.display = 'block';
                }, 500);
            }
        }, 800);
    });
});
