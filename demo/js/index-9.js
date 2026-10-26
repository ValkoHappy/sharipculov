(function () {
    var gender = 'male';
    document.querySelectorAll('.gender-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.gender-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            gender = this.dataset.gender;
        });
    });
    var calcBtn = document.getElementById('calcBtn');
    if (!calcBtn)
        return;
    calcBtn.addEventListener('click', function () {
        var age = parseInt(document.getElementById('calcAge').value);
        var height = parseInt(document.getElementById('calcHeight').value);
        var weight = parseInt(document.getElementById('calcWeight').value);
        var activity = parseFloat(document.getElementById('calcActivity').value);
        var goal = document.getElementById('calcGoal').value;
        if (!age || !height || !weight) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        var bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        }
        else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        var tdee = bmr * activity;
        if (goal === 'lose')
            tdee *= 0.8;
        else if (goal === 'gain')
            tdee *= 1.15;
        var calories = Math.round(tdee);
        var protein = Math.round(weight * 2.2);
        var fat = Math.round((tdee * 0.28) / 9);
        var carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);
        var bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
        var bmiLabel;
        if (bmi < 18.5)
            bmiLabel = 'Недостаточный вес';
        else if (bmi < 25)
            bmiLabel = 'Норма';
        else if (bmi < 30)
            bmiLabel = 'Избыточный вес';
        else
            bmiLabel = 'Ожирение';
        var calcData = { calories: calories, protein: protein, fat: fat, carbs: carbs };
        localStorage.setItem('calcResult', JSON.stringify(calcData));
        sessionStorage.setItem('calcResult', JSON.stringify(calcData));
        var isLoggedIn = !!sessionStorage.getItem('userId');
        var cabinetHint = isLoggedIn
            ? '<a href="cabinet.html" style="display:inline-block;margin-top:16px;color:#ff5e00;font-size:13px;font-weight:700;text-decoration:none;">→ Открыть в кабинете</a>'
            : '<p style="margin-top:16px;font-size:13px;color:#888;">Войдите в <a href="#" onclick="document.getElementById(\'openLoginModal\').click();return false;" style="color:#ff5e00;text-decoration:none;">личный кабинет</a>, чтобы сохранить результат и отслеживать питание.</p>';
        document.getElementById('calcResult').innerHTML =
            '<div class="calc-cards">' +
                '<div class="calc-card main-card"><span class="card-value">' + calories + '</span><span class="card-label">Калорий в день</span></div>' +
                '<div class="calc-card"><span class="card-value">' + protein + 'г</span><span class="card-label">Белки</span></div>' +
                '<div class="calc-card"><span class="card-value">' + fat + 'г</span><span class="card-label">Жиры</span></div>' +
                '<div class="calc-card"><span class="card-value">' + carbs + 'г</span><span class="card-label">Углеводы</span></div>' +
                '</div>' +
                '<div class="calc-bmi">' +
                '<span class="calc-bmi-label">ИМТ</span>' +
                '<span class="calc-bmi-value">' + bmi + ' — ' + bmiLabel + '</span>' +
                '</div>' +
                cabinetHint;
    });
})();
