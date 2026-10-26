document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('panel-' + this.dataset.tab).classList.add('active');
    });
});
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function showError(inputId, errorId, msg) {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    inp.classList.add('error');
    if (msg)
        err.textContent = msg;
    err.classList.add('visible');
}
function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove('error');
    document.getElementById(errorId).classList.remove('visible');
}
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    clearError('loginEmail', 'loginEmailError');
    clearError('loginPassword', 'loginPasswordError');
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    let valid = true;
    if (!validateEmail(email)) {
        showError('loginEmail', 'loginEmailError', 'Введите корректный email');
        valid = false;
    }
    if (pass.length < 6) {
        showError('loginPassword', 'loginPasswordError', 'Минимум 6 символов');
        valid = false;
    }
    if (!valid)
        return;
    try {
        const user = await loginUser(email, pass);
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('userName', user.name);
        document.getElementById('loginSuccess').style.display = 'block';
        setTimeout(() => window.location.href = 'cabinet.html', 1200);
    }
    catch (err) {
        showError('loginEmail', 'loginEmailError', err.message);
    }
});
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    ['regName', 'regEmail', 'regPassword', 'regPassword2'].forEach(id => {
        clearError(id, id + 'Error');
    });
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;
    const pass2 = document.getElementById('regPassword2').value;
    let valid = true;
    if (!name) {
        showError('regName', 'regNameError', 'Введите имя');
        valid = false;
    }
    if (!validateEmail(email)) {
        showError('regEmail', 'regEmailError', 'Введите корректный email');
        valid = false;
    }
    if (pass.length < 6) {
        showError('regPassword', 'regPasswordError', 'Минимум 6 символов');
        valid = false;
    }
    if (pass !== pass2) {
        showError('regPassword2', 'regPassword2Error', 'Пароли не совпадают');
        valid = false;
    }
    if (!valid)
        return;
    try {
        const result = await registerUser(name, email, pass);
        const user = await loginUser(email, pass);
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('userName', user.name);
        document.getElementById('registerSuccess').style.display = 'block';
        setTimeout(() => window.location.href = 'cabinet.html', 1500);
    }
    catch (err) {
        showError('regEmail', 'regEmailError', err.message);
    }
});
