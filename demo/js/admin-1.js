let _users = [], _applications = [], _progress = [], _workoutPlans = [], _nutritionPlans = [];
let _appsFilter = 'all';
let _progressFilterUser = '';
function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.className = 'toast'; }, 3000);
}
function adminLogin() {
    sessionStorage.setItem('adminAuth', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAll();
}
function adminLogout() {
    sessionStorage.removeItem('adminAuth');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}
if (sessionStorage.getItem('adminAuth') === '1') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}
let currentTab = 'dashboard';
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});
function switchTab(name) {
    currentTab = name;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + name));
    if (name === 'applications')
        renderApplicationsTable();
    if (name === 'clients')
        renderClientsTable();
    if (name === 'progress')
        renderProgressTable();
    if (name === 'dashboard')
        renderDashboard();
    if (name === 'programs')
        populateUserSelects();
}
function refreshCurrent() {
    loadAll().then(() => showToast('Данные обновлены'));
}
async function loadAll() {
    try {
        [_users, _applications, _progress] = await Promise.all([
            getAllUsers(),
            getAllApplications(),
            getAllProgress()
        ]);
        try {
            const db = await openDB();
            _workoutPlans = await new Promise((res, rej) => {
                const req = db.transaction('workout_plans').objectStore('workout_plans').getAll();
                req.onsuccess = () => res(req.result);
                req.onerror = () => rej(req.error);
            });
            _nutritionPlans = await new Promise((res, rej) => {
                const req = db.transaction('nutrition_plans').objectStore('nutrition_plans').getAll();
                req.onsuccess = () => res(req.result);
                req.onerror = () => rej(req.error);
            });
        }
        catch (e) {
            _workoutPlans = [];
            _nutritionPlans = [];
        }
        const newApps = _applications.filter(a => a.status === 'new').length;
        const badge = document.getElementById('appsBadge');
        if (newApps > 0) {
            badge.style.display = 'inline';
            badge.textContent = newApps;
        }
        else
            badge.style.display = 'none';
        if (currentTab === 'dashboard')
            renderDashboard();
        if (currentTab === 'applications')
            renderApplicationsTable();
        if (currentTab === 'clients')
            renderClientsTable();
        if (currentTab === 'progress')
            renderProgressTable();
        if (currentTab === 'programs')
            populateUserSelects();
    }
    catch (e) {
        showToast('Ошибка загрузки данных', true);
        console.error(e);
    }
}
function renderDashboard() {
    const today = new Date().toLocaleDateString('ru-RU');
    const todayRegs = _users.filter(u => new Date(u.createdAt).toLocaleDateString('ru-RU') === today).length;
    const newApps = _applications.filter(a => a.status === 'new').length;
    document.getElementById('statUsers').textContent = _users.length;
    document.getElementById('statApps').textContent = _applications.length;
    document.getElementById('statAppsNew').textContent = newApps;
    document.getElementById('statProgress').textContent = _progress.length;
    document.getElementById('statToday').textContent = todayRegs;
    const recent5apps = _applications.slice(0, 5);
    const rtbody = document.getElementById('recentAppsTable');
    rtbody.innerHTML = recent5apps.length
        ? recent5apps.map(a => `
            <tr>
              <td style="color:#555">${a.id}</td>
              <td><strong>${esc(a.name)}</strong></td>
              <td>${esc(a.phone)}</td>
              <td>${esc(a.goal)}</td>
              <td>${fmtDate(a.date)}</td>
              <td>${statusTag(a.status)}</td>
            </tr>
          `).join('')
        : '<tr class="empty-row"><td colspan="6">Заявок пока нет</td></tr>';
    const recent5users = [..._users].reverse().slice(0, 5);
    const rutbody = document.getElementById('recentUsersTable');
    rutbody.innerHTML = recent5users.length
        ? recent5users.map(u => `
            <tr>
              <td style="color:#555">${u.id}</td>
              <td><strong>${esc(u.name)}</strong></td>
              <td>${esc(u.email)}</td>
              <td>${new Date(u.createdAt).toLocaleString('ru-RU')}</td>
            </tr>
          `).join('')
        : '<tr class="empty-row"><td colspan="4">Нет зарегистрированных пользователей</td></tr>';
}
document.getElementById('appsFilter').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn)
        return;
    document.querySelectorAll('#appsFilter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _appsFilter = btn.dataset.status;
    renderApplicationsTable();
});
function renderApplicationsTable() {
    const apps = _appsFilter === 'all'
        ? _applications
        : _applications.filter(a => a.status === _appsFilter);
    document.getElementById('appsCount').textContent = _applications.length;
    const tbody = document.getElementById('applicationsTable');
    if (!apps.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Нет заявок</td></tr>';
        return;
    }
    tbody.innerHTML = apps.map(a => `
        <tr id="app-row-${a.id}">
          <td style="color:#555">${a.id}</td>
          <td><strong>${esc(a.name)}</strong></td>
          <td>${esc(a.phone)}</td>
          <td>${esc(a.email || '—')}</td>
          <td>${esc(a.goal)}</td>
          <td style="font-size:12px;color:#888">${fmtDate(a.date)}</td>
          <td>${statusTag(a.status)}</td>
          <td>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${a.status !== 'processing' ? `<button class="btn-sm btn-sm-blue" onclick="setAppStatus(${a.id},'processing')">В работу</button>` : ''}
              ${a.status !== 'done' ? `<button class="btn-sm btn-sm-green" onclick="setAppStatus(${a.id},'done')">Закрыть</button>` : ''}
              ${a.status !== 'rejected' ? `<button class="btn-sm btn-sm-gray" onclick="setAppStatus(${a.id},'rejected')">Отклонить</button>` : ''}
              <button class="btn-sm btn-sm-red" onclick="deleteApp(${a.id})">✕</button>
            </div>
          </td>
        </tr>
      `).join('');
}
async function setAppStatus(id, status) {
    try {
        await updateApplicationStatus(id, status);
        const app = _applications.find(a => a.id === id);
        if (app)
            app.status = status;
        renderApplicationsTable();
        const newApps = _applications.filter(a => a.status === 'new').length;
        const badge = document.getElementById('appsBadge');
        if (newApps > 0) {
            badge.style.display = 'inline';
            badge.textContent = newApps;
        }
        else
            badge.style.display = 'none';
        showToast('Статус обновлён');
    }
    catch (e) {
        showToast('Ошибка обновления', true);
    }
}
async function deleteApp(id) {
    if (!confirm('Удалить заявку?'))
        return;
    try {
        await deleteApplication(id);
        _applications = _applications.filter(a => a.id !== id);
        renderApplicationsTable();
        renderDashboard();
        showToast('Заявка удалена');
    }
    catch (e) {
        showToast('Ошибка удаления', true);
    }
}
function renderClientsTable() {
    document.getElementById('clientsCount').textContent = _users.length;
    const tbody = document.getElementById('clientsTable');
    if (!_users.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Нет зарегистрированных пользователей</td></tr>';
        return;
    }
    const progressCount = {};
    _progress.forEach(p => { progressCount[p.userId] = (progressCount[p.userId] || 0) + 1; });
    tbody.innerHTML = [..._users].reverse().map(u => {
        const hasPlan = _workoutPlans.some(p => p.userId === u.id);
        const hasNut = _nutritionPlans.some(p => p.userId === u.id);
        return `
          <tr>
            <td style="color:#555">${u.id}</td>
            <td><strong>${esc(u.name)}</strong></td>
            <td>${esc(u.email)}</td>
            <td style="font-size:12px;color:#888">${new Date(u.createdAt).toLocaleString('ru-RU')}</td>
            <td><span class="tag ${(progressCount[u.id] || 0) > 0 ? 'tag-orange' : 'tag-gray'}">${progressCount[u.id] || 0}</span></td>
            <td><span class="tag ${hasPlan ? 'tag-green' : 'tag-gray'}">${hasPlan ? 'Назначена' : '—'}</span></td>
            <td><span class="tag ${hasNut ? 'tag-blue' : 'tag-gray'}">${hasNut ? 'Назначен' : '—'}</span></td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn-sm btn-sm-blue" onclick="openProgramFor(${u.id})">Программа</button>
                <button class="btn-sm btn-sm-green" onclick="openNutritionFor(${u.id})">Питание</button>
                <button class="btn-sm btn-sm-red" onclick="confirmDeleteUser(${u.id},'${esc(u.name)}')">✕</button>
              </div>
            </td>
          </tr>
        `;
    }).join('');
}
async function confirmDeleteUser(id, name) {
    if (!confirm(`Удалить пользователя «${name}» и все его данные?`))
        return;
    try {
        await deleteUser(id);
        _users = _users.filter(u => u.id !== id);
        renderClientsTable();
        renderDashboard();
        showToast('Пользователь удалён');
    }
    catch (e) {
        showToast('Ошибка удаления', true);
    }
}
function openProgramFor(userId) {
    switchTab('programs');
    document.getElementById('programUserId').value = userId;
    loadProgramForUser();
}
function openNutritionFor(userId) {
    switchTab('programs');
    document.getElementById('nutritionUserId').value = userId;
    loadNutritionForUser();
}
function populateUserSelects() {
    const opts = _users.map(u => `<option value="${u.id}">${esc(u.name)} (${esc(u.email)})</option>`).join('');
    ['programUserId', 'nutritionUserId'].forEach(id => {
        const sel = document.getElementById(id);
        const val = sel.value;
        sel.innerHTML = '<option value="">— Выберите клиента —</option>' + opts;
        if (val)
            sel.value = val;
    });
}
function addExerciseRow(day = '', name = '', sets = '') {
    const wrap = document.getElementById('exercisesList');
    const row = document.createElement('div');
    row.className = 'exercise-row';
    row.innerHTML = `
        <input type="text" placeholder="Пн" value="${esc(day)}" class="ex-day" />
        <input type="text" placeholder="Жим штанги лёжа" value="${esc(name)}" class="ex-name" />
        <input type="text" placeholder="4×10" value="${esc(sets)}" class="ex-sets" />
        <button class="btn-rm-ex" onclick="this.closest('.exercise-row').remove()">×</button>
      `;
    wrap.appendChild(row);
}
async function loadProgramForUser() {
    const userId = parseInt(document.getElementById('programUserId').value);
    if (!userId)
        return;
    document.getElementById('exercisesList').innerHTML = '';
    try {
        const plan = await getWorkoutPlan(userId);
        if (plan) {
            document.getElementById('programName').value = plan.name || '';
            (plan.exercises || []).forEach(ex => addExerciseRow(ex.day, ex.name, ex.sets));
        }
        else {
            document.getElementById('programName').value = '';
            addExerciseRow('Пн', 'Жим штанги лёжа', '4×10');
            addExerciseRow('Пн', 'Разводка гантелей', '3×12');
            addExerciseRow('Ср', 'Тяга штанги', '4×10');
            addExerciseRow('Пт', 'Приседания', '4×10');
        }
    }
    catch (e) {
        console.error(e);
    }
}
async function saveProgramForm() {
    const userId = parseInt(document.getElementById('programUserId').value);
    if (!userId) {
        showToast('Выберите клиента', true);
        return;
    }
    const name = document.getElementById('programName').value.trim() || 'Индивидуальная программа';
    const rows = document.querySelectorAll('#exercisesList .exercise-row');
    const exercises = [];
    rows.forEach(row => {
        const day = row.querySelector('.ex-day').value.trim();
        const exName = row.querySelector('.ex-name').value.trim();
        const sets = row.querySelector('.ex-sets').value.trim();
        if (exName)
            exercises.push({ day, name: exName, sets });
    });
    try {
        await saveWorkoutPlan(userId, name, exercises);
        const existing = _workoutPlans.findIndex(p => p.userId === userId);
        const record = { userId, name, exercises: JSON.stringify(exercises) };
        if (existing >= 0)
            _workoutPlans[existing] = record;
        else
            _workoutPlans.push(record);
        showToast('Программа сохранена!');
        renderClientsTable();
    }
    catch (e) {
        showToast('Ошибка сохранения', true);
        console.error(e);
    }
}
async function deleteProgramForUser() {
    const userId = parseInt(document.getElementById('programUserId').value);
    if (!userId) {
        showToast('Выберите клиента', true);
        return;
    }
    if (!confirm('Удалить программу для этого клиента?'))
        return;
    try {
        await deleteWorkoutPlan(userId);
        _workoutPlans = _workoutPlans.filter(p => p.userId !== userId);
        document.getElementById('exercisesList').innerHTML = '';
        document.getElementById('programName').value = '';
        showToast('Программа удалена');
        renderClientsTable();
    }
    catch (e) {
        showToast('Ошибка', true);
    }
}
async function deleteNutritionForm() {
    const userId = parseInt(document.getElementById('nutritionUserId').value);
    if (!userId) {
        showToast('Выберите клиента', true);
        return;
    }
    if (!confirm('Удалить план питания для этого клиента?'))
        return;
    try {
        await deleteNutritionPlan(userId);
        _nutritionPlans = _nutritionPlans.filter(p => p.userId !== userId);
        ['nutCalories', 'nutProtein', 'nutFat', 'nutCarbs', 'nutNotes'].forEach(id => {
            document.getElementById(id).value = '';
        });
        showToast('План питания удалён');
        renderClientsTable();
    }
    catch (e) {
        showToast('Ошибка', true);
    }
}
async function loadNutritionForUser() {
    const userId = parseInt(document.getElementById('nutritionUserId').value);
    if (!userId)
        return;
    try {
        const plan = await getNutritionPlan(userId);
        if (plan) {
            document.getElementById('nutCalories').value = plan.calories || '';
            document.getElementById('nutProtein').value = plan.protein || '';
            document.getElementById('nutFat').value = plan.fat || '';
            document.getElementById('nutCarbs').value = plan.carbs || '';
            document.getElementById('nutNotes').value = plan.notes || '';
        }
        else {
            ['nutCalories', 'nutProtein', 'nutFat', 'nutCarbs', 'nutNotes'].forEach(id => {
                document.getElementById(id).value = '';
            });
        }
    }
    catch (e) {
        console.error(e);
    }
}
async function saveNutritionForm() {
    const userId = parseInt(document.getElementById('nutritionUserId').value);
    if (!userId) {
        showToast('Выберите клиента', true);
        return;
    }
    const data = {
        calories: parseInt(document.getElementById('nutCalories').value) || 0,
        protein: parseInt(document.getElementById('nutProtein').value) || 0,
        fat: parseInt(document.getElementById('nutFat').value) || 0,
        carbs: parseInt(document.getElementById('nutCarbs').value) || 0,
        notes: document.getElementById('nutNotes').value.trim()
    };
    if (!data.calories) {
        showToast('Укажите калории', true);
        return;
    }
    try {
        await saveNutritionPlan(userId, data);
        const existing = _nutritionPlans.findIndex(p => p.userId === userId);
        if (existing >= 0)
            _nutritionPlans[existing] = { ..._nutritionPlans[existing], ...data, userId };
        else
            _nutritionPlans.push({ ...data, userId });
        showToast('План питания сохранён!');
        renderClientsTable();
    }
    catch (e) {
        showToast('Ошибка сохранения', true);
        console.error(e);
    }
}
function renderProgressTable() {
    const userSel = document.getElementById('progressFilterUser');
    const curVal = userSel.value;
    userSel.innerHTML = '<option value="">Все клиенты</option>' +
        _users.map(u => `<option value="${u.id}">${esc(u.name)}</option>`).join('');
    if (curVal)
        userSel.value = curVal;
    const filterUserId = parseInt(userSel.value) || 0;
    const data = filterUserId ? _progress.filter(p => p.userId === filterUserId) : _progress;
    document.getElementById('progressCount').textContent = _progress.length;
    const tbody = document.getElementById('progressTable');
    if (!data.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Нет записей прогресса</td></tr>';
        return;
    }
    const userMap = {};
    _users.forEach(u => userMap[u.id] = u.name);
    tbody.innerHTML = [...data].reverse().map(p => `
        <tr>
          <td style="color:#555">${p.id}</td>
          <td>${esc(userMap[p.userId] || '—')}</td>
          <td style="font-size:12px;color:#aaa">${p.date || '—'}</td>
          <td>${p.weight ? `<strong>${p.weight}</strong>` : '—'}</td>
          <td>${p.chest || '—'}</td>
          <td>${p.waist || '—'}</td>
          <td>${p.hips || '—'}</td>
          <td>
            <button class="btn-sm btn-sm-red" onclick="deleteProgressEntry(${p.id})">✕</button>
          </td>
        </tr>
      `).join('');
}
async function deleteProgressEntry(id) {
    if (!confirm('Удалить запись прогресса?'))
        return;
    try {
        await deleteProgress(id);
        _progress = _progress.filter(p => p.id !== id);
        renderProgressTable();
        renderDashboard();
        showToast('Запись удалена');
    }
    catch (e) {
        showToast('Ошибка', true);
    }
}
function esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function fmtDate(iso) {
    try {
        return new Date(iso).toLocaleString('ru-RU');
    }
    catch (e) {
        return iso || '—';
    }
}
function statusTag(status) {
    const map = {
        new: ['tag-orange', 'Новая'],
        processing: ['tag-blue', 'В работе'],
        done: ['tag-green', 'Закрыта'],
        rejected: ['tag-red', 'Отклонена']
    };
    const [cls, label] = map[status] || ['tag-gray', status];
    return `<span class="tag ${cls}">${label}</span>`;
}
if (sessionStorage.getItem('adminAuth') === '1')
    loadAll();
