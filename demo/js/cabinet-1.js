const userId = parseInt(sessionStorage.getItem('userId'));
const userName = sessionStorage.getItem('userName') || 'Пользователь';
if (!userId) {
    window.location.href = 'login.html';
}
document.getElementById('userName').textContent = userName;
document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = 'index.html';
});
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
function showNextWorkout(planExercises) {
    const dayMap = { 'Пн': 1, 'Вт': 2, 'Ср': 3, 'Чт': 4, 'Пт': 5, 'Сб': 6, 'Вс': 0 };
    let trainDays = [1, 3, 5];
    let dayExercisesMap = {};
    if (planExercises && planExercises.length > 0) {
        const grouped = {};
        planExercises.forEach(ex => {
            if (ex.day && dayMap[ex.day] !== undefined) {
                grouped[ex.day] = grouped[ex.day] || [];
                grouped[ex.day].push(ex);
            }
        });
        const days = Object.keys(grouped);
        if (days.length > 0) {
            trainDays = days.map(d => dayMap[d]).filter(n => n !== undefined);
            dayExercisesMap = grouped;
        }
    }
    const now = new Date();
    let nextDate = null;
    for (let i = 1; i <= 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        if (trainDays.includes(d.getDay())) {
            nextDate = d;
            break;
        }
    }
    if (!nextDate)
        nextDate = new Date(now.getTime() + 86400000);
    const revDayMap = { 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 0: 'Вс' };
    const dayKey = revDayMap[nextDate.getDay()];
    const exList = dayExercisesMap[dayKey];
    const name = exList ? exList.slice(0, 2).map(e => e.name).join(', ') + (exList.length > 2 ? '...' : '') : 'Тренировка по программе';
    const desc = exList ? `${exList.length} упражнений` : 'Следующий день по расписанию';
    document.getElementById('nextDay').textContent = nextDate.getDate();
    document.getElementById('nextMonth').textContent = months[nextDate.getMonth()];
    document.getElementById('nextType').textContent = 'СИЛОВАЯ';
    document.getElementById('nextName').textContent = name;
    document.getElementById('nextDesc').textContent = desc;
}
const defaultSchedule = [
    { day: 'Пн', exercises: [
            { name: 'Жим штанги лёжа', sets: '4 × 10' },
            { name: 'Разводка гантелей', sets: '3 × 12' },
            { name: 'Жим узким хватом', sets: '3 × 10' },
            { name: 'Трицепс на блоке', sets: '3 × 15' }
        ] },
    { day: 'Вт', rest: true },
    { day: 'Ср', exercises: [
            { name: 'Подтягивания широким', sets: '4 × 8' },
            { name: 'Тяга штанги в наклоне', sets: '4 × 10' },
            { name: 'Горизонтальная тяга', sets: '3 × 12' },
            { name: 'Подъём на бицепс', sets: '3 × 12' }
        ] },
    { day: 'Чт', rest: true },
    { day: 'Пт', exercises: [
            { name: 'Приседания со штангой', sets: '4 × 10' },
            { name: 'Жим ногами', sets: '3 × 12' },
            { name: 'Жим гантелей сидя', sets: '3 × 12' },
            { name: 'Тяга к подбородку', sets: '3 × 12' }
        ] },
    { day: 'Сб', rest: true },
    { day: 'Вс', rest: true }
];
function renderSchedule(schedule) {
    const tbody = document.getElementById('workoutTableBody');
    tbody.innerHTML = '';
    schedule.forEach(day => {
        if (day.rest) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="day-name">${day.day}</td><td class="rest-day" colspan="2">Отдых / Восстановление</td>`;
            tbody.appendChild(tr);
        }
        else {
            (day.exercises || []).forEach((ex, i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
              <td class="day-name">${i === 0 ? day.day : ''}</td>
              <td class="exercise">${ex.name}</td>
              <td class="sets">${ex.sets || ''}</td>
            `;
                tbody.appendChild(tr);
            });
        }
    });
}
async function loadWorkoutPlan() {
    try {
        const plan = await getWorkoutPlan(userId);
        if (plan && plan.exercises && plan.exercises.length > 0) {
            const cards = document.querySelectorAll('.cab-card');
            cards.forEach(c => {
                if (c.querySelector('#workoutTableBody')) {
                    const t = c.querySelector('.cab-card-title');
                    if (t)
                        t.textContent = plan.name || 'Ваша программа';
                }
            });
            const grouped = {};
            const dayOrder = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            plan.exercises.forEach(ex => {
                if (!grouped[ex.day])
                    grouped[ex.day] = [];
                grouped[ex.day].push({ name: ex.name, sets: ex.sets || '' });
            });
            const schedule = dayOrder.map(d => grouped[d]
                ? { day: d, exercises: grouped[d] }
                : { day: d, rest: true });
            renderSchedule(schedule);
            showNextWorkout(plan.exercises);
        }
        else {
            renderSchedule(defaultSchedule);
            showNextWorkout(null);
        }
    }
    catch (e) {
        renderSchedule(defaultSchedule);
        showNextWorkout(null);
    }
}
loadWorkoutPlan();
async function loadNutrition() {
    const block = document.getElementById('nutritionBlock');
    try {
        const plan = await getNutritionPlan(userId);
        if (plan && plan.calories) {
            block.innerHTML = `
            <div class="nutrition-grid">
              <div class="nutrition-card"><div class="value">${plan.calories}</div><div class="label">ккал</div></div>
              <div class="nutrition-card"><div class="value">${plan.protein}г</div><div class="label">Белки</div></div>
              <div class="nutrition-card"><div class="value">${plan.fat}г</div><div class="label">Жиры</div></div>
              <div class="nutrition-card"><div class="value">${plan.carbs}г</div><div class="label">Углеводы</div></div>
            </div>
            ${plan.notes ? `<p style="font-size:13px;color:#888;margin-top:10px">${plan.notes}</p>` : ''}
            <p style="font-size:11px;color:#555;margin-top:8px">Назначено тренером</p>
          `;
            return;
        }
    }
    catch (e) { }
    const calcResult = sessionStorage.getItem('calcResult') || localStorage.getItem('calcResult');
    if (calcResult) {
        try {
            const n = JSON.parse(calcResult);
            block.innerHTML = `
            <div class="nutrition-grid">
              <div class="nutrition-card"><div class="value">${n.calories}</div><div class="label">ккал</div></div>
              <div class="nutrition-card"><div class="value">${n.protein}г</div><div class="label">Белки</div></div>
              <div class="nutrition-card"><div class="value">${n.fat}г</div><div class="label">Жиры</div></div>
              <div class="nutrition-card"><div class="value">${n.carbs}г</div><div class="label">Углеводы</div></div>
            </div>
            <p style="font-size:11px;color:#555;margin-top:8px">По результатам калькулятора</p>
          `;
        }
        catch (e) { }
    }
}
loadNutrition();
async function loadLastProgress() {
    try {
        const log = await getProgress(userId);
        if (!log.length)
            return;
        const last = log[log.length - 1];
        if (last.weight)
            document.getElementById('inputWeight').value = last.weight;
        if (last.chest)
            document.getElementById('inputChest').value = last.chest;
        if (last.waist)
            document.getElementById('inputWaist').value = last.waist;
        if (last.hips)
            document.getElementById('inputHips').value = last.hips;
        drawChart(log);
    }
    catch (e) { }
}
loadLastProgress();
document.getElementById('saveProgressBtn').addEventListener('click', async function () {
    const data = {
        weight: document.getElementById('inputWeight').value,
        chest: document.getElementById('inputChest').value,
        waist: document.getElementById('inputWaist').value,
        hips: document.getElementById('inputHips').value
    };
    try {
        await saveProgress(userId, data);
        const saved = document.getElementById('progressSaved');
        saved.style.display = 'inline';
        setTimeout(() => saved.style.display = 'none', 2000);
        const log = await getProgress(userId);
        drawChart(log);
    }
    catch (e) {
        console.error(e);
    }
});
function drawChart(log) {
    const filtered = (log || []).filter(e => e.weight);
    const canvas = document.getElementById('weightChart');
    const empty = document.getElementById('chartEmpty');
    if (filtered.length < 2) {
        empty.style.display = 'flex';
        return;
    }
    empty.style.display = 'none';
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 400;
    const H = canvas.offsetHeight || 100;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    const weights = filtered.map(e => parseFloat(e.weight));
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const pts = weights.map((w, i) => ({
        x: (i / (weights.length - 1)) * (W - 40) + 20,
        y: H - 20 - ((w - minW) / (maxW - minW)) * (H - 40)
    }));
    ctx.beginPath();
    ctx.strokeStyle = '#ff5e00';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff5e00';
        ctx.fill();
    });
    ctx.fillStyle = '#aaa';
    ctx.font = '11px Arial';
    ctx.fillText(weights[0] + ' кг', pts[0].x + 6, pts[0].y - 6);
    ctx.fillText(weights[weights.length - 1] + ' кг', pts[pts.length - 1].x - 36, pts[pts.length - 1].y - 6);
}
