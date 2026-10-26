const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
(function checkAuth() {
    if (sessionStorage.getItem('userId')) {
        document.getElementById('openLoginModal').style.display = 'none';
        document.getElementById('cabinetBtn').style.display = '';
        var fl = document.getElementById('footerCabinetLink');
        if (fl)
            fl.style.display = '';
    }
})();
document.getElementById('openLoginModal').addEventListener('click', () => openModal(loginModal));
document.getElementById('closeLoginModal').addEventListener('click', () => closeModal(loginModal));
document.getElementById('closeRegisterModal').addEventListener('click', () => closeModal(registerModal));
document.getElementById('loginOverlay').addEventListener('click', () => closeModal(loginModal));
document.getElementById('registerOverlay').addEventListener('click', () => closeModal(registerModal));
document.getElementById('switchToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(registerModal);
});
document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModal);
    openModal(loginModal);
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(loginModal);
        closeModal(registerModal);
    }
});
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    const emailErr = document.getElementById('loginEmailError');
    const passErr = document.getElementById('loginPasswordError');
    let valid = true;
    emailEl.classList.remove('error');
    emailErr.classList.remove('visible');
    passEl.classList.remove('error');
    passErr.classList.remove('visible');
    if (!validateEmail(emailEl.value.trim())) {
        emailEl.classList.add('error');
        emailErr.classList.add('visible');
        valid = false;
    }
    if (passEl.value.length < 6) {
        passEl.classList.add('error');
        passErr.classList.add('visible');
        valid = false;
    }
    if (!valid)
        return;
    try {
        const user = await loginUser(emailEl.value.trim(), passEl.value);
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('userName', user.name);
        document.getElementById('loginSuccess').style.display = 'block';
        document.getElementById('openLoginModal').style.display = 'none';
        document.getElementById('cabinetBtn').style.display = '';
        setTimeout(() => { closeModal(loginModal); window.location.href = 'cabinet.html'; }, 1200);
    }
    catch (err) {
        emailEl.classList.add('error');
        passEl.classList.add('error');
        emailErr.textContent = err.message;
        emailErr.classList.add('visible');
    }
});
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const nameEl = document.getElementById('regName');
    const emailEl = document.getElementById('regEmail');
    const passEl = document.getElementById('regPassword');
    const pass2El = document.getElementById('regPassword2');
    const nameErr = document.getElementById('regNameError');
    const emailErr = document.getElementById('regEmailError');
    const passErr = document.getElementById('regPasswordError');
    const pass2Err = document.getElementById('regPassword2Error');
    let valid = true;
    [nameEl, emailEl, passEl, pass2El].forEach(f => f.classList.remove('error'));
    [nameErr, emailErr, passErr, pass2Err].forEach(e => e.classList.remove('visible'));
    if (nameEl.value.trim().length < 2) {
        nameEl.classList.add('error');
        nameErr.classList.add('visible');
        valid = false;
    }
    if (!validateEmail(emailEl.value.trim())) {
        emailEl.classList.add('error');
        emailErr.classList.add('visible');
        valid = false;
    }
    if (passEl.value.length < 6) {
        passEl.classList.add('error');
        passErr.classList.add('visible');
        valid = false;
    }
    if (passEl.value !== pass2El.value) {
        pass2El.classList.add('error');
        pass2Err.classList.add('visible');
        valid = false;
    }
    if (!valid)
        return;
    try {
        await registerUser(nameEl.value.trim(), emailEl.value.trim(), passEl.value);
        const user = await loginUser(emailEl.value.trim(), passEl.value);
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('userName', user.name);
        document.getElementById('openLoginModal').style.display = 'none';
        document.getElementById('cabinetBtn').style.display = '';
        document.getElementById('registerSuccess').style.display = 'block';
        setTimeout(() => { closeModal(registerModal); window.location.href = 'cabinet.html'; }, 1500);
    }
    catch (err) {
        emailEl.classList.add('error');
        emailErr.textContent = err.message;
        emailErr.classList.add('visible');
    }
});
