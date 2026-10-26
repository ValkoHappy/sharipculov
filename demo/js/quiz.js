(function () {
    var answers = {};
    var currentStep = 1;
    var totalSteps = 4;
    var progressFill = document.getElementById('quizProgressFill');
    var stepInfo = document.getElementById('quizStepInfo');
    var result = document.getElementById('quizResult');
    var resultCard = document.getElementById('quizResultCard');
    var restartBtn = document.getElementById('quizRestartBtn');
    function showStep(step) {
        document.querySelectorAll('.quiz-step').forEach(function (s) {
            s.classList.remove('active');
        });
        var target = document.querySelector('.quiz-step[data-step="' + step + '"]');
        if (target)
            target.classList.add('active');
        progressFill.style.width = (step / totalSteps * 100) + '%';
        stepInfo.textContent = 'Шаг ' + step + ' из ' + totalSteps;
    }
    function showResult() {
        document.querySelectorAll('.quiz-step').forEach(function (s) {
            s.classList.remove('active');
        });
        progressFill.style.width = '100%';
        stepInfo.textContent = 'Готово!';
        result.classList.add('visible');
        var isElite = answers[1] === 'compete' || answers[3] === 'high';
        if (isElite) {
            resultCard.innerHTML =
                '<h3>ДЛЯ СОРЕВНОВАНИЙ</h3>' +
                    '<div class="result-price">10 000₽ <span style="font-size:0.9rem;color:#aaa;">/месяц</span></div>' +
                    '<p class="result-desc">Исходя из ваших ответов, вам подойдёт программа для серьёзных результатов и подготовки к соревнованиям.</p>' +
                    '<ul class="result-features">' +
                    '<li>Полная подготовка к соревнованиям</li>' +
                    '<li>Индивидуальные тренировки 5 дней в неделю</li>' +
                    '<li>Специализированное питание</li>' +
                    '<li>Анализ техники и видеоразборы</li>' +
                    '<li>Поддержка на самих соревнованиях</li>' +
                    '</ul>' +
                    '<a href="#contacts" class="btn-primary" style="display:inline-block;margin-top:20px;text-decoration:none;text-align:center;" onclick="document.getElementById(\'contacts\').scrollIntoView({behavior:\'smooth\'});return false;">Записаться на эту программу →</a>';
        }
        else {
            resultCard.innerHTML =
                '<h3>ВСЁ ВКЛЮЧЕНО</h3>' +
                    '<div class="result-price">5 000₽ <span style="font-size:0.9rem;color:#aaa;">/месяц</span></div>' +
                    '<p class="result-desc">Для ваших целей идеально подойдёт комплексный пакет с персональными тренировками и поддержкой.</p>' +
                    '<ul class="result-features">' +
                    '<li>Персональные тренировки онлайн</li>' +
                    '<li>Индивидуальная программа питания</li>' +
                    '<li>Ежедневная поддержка в чате</li>' +
                    '<li>Коррекция программы каждые 2 недели</li>' +
                    '<li>Доступ к закрытому чату</li>' +
                    '</ul>' +
                    '<a href="#contacts" class="btn-primary" style="display:inline-block;margin-top:20px;text-decoration:none;text-align:center;" onclick="document.getElementById(\'contacts\').scrollIntoView({behavior:\'smooth\'});return false;">Записаться на эту программу →</a>';
        }
    }
    document.querySelectorAll('.quiz-option').forEach(function (option) {
        option.addEventListener('click', function () {
            var step = parseInt(this.closest('.quiz-step').dataset.step);
            answers[step] = this.dataset.value;
            this.closest('.quiz-options').querySelectorAll('.quiz-option').forEach(function (o) {
                o.classList.remove('selected');
            });
            this.classList.add('selected');
            var self = this;
            setTimeout(function () {
                if (step < totalSteps) {
                    currentStep = step + 1;
                    showStep(currentStep);
                }
                else {
                    showResult();
                }
            }, 300);
        });
    });
    if (restartBtn) {
        restartBtn.addEventListener('click', function () {
            answers = {};
            currentStep = 1;
            result.classList.remove('visible');
            document.querySelectorAll('.quiz-option').forEach(function (o) {
                o.classList.remove('selected');
            });
            showStep(1);
        });
    }
})();
