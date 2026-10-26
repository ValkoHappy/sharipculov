const DB_NAME = 'SuitTrainerPortfolioDemo';
const DB_VERSION = 2;
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
            const db = e.target.result;
            const old = e.oldVersion;
            if (old < 1) {
                const users = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                users.createIndex('email', 'email', { unique: true });
                const progress = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
                progress.createIndex('userId', 'userId', { unique: false });
                progress.createIndex('date', 'date', { unique: false });
                const workouts = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
                workouts.createIndex('userId', 'userId', { unique: false });
                workouts.createIndex('date', 'date', { unique: false });
            }
            if (old < 2) {
                const apps = db.createObjectStore('applications', { keyPath: 'id', autoIncrement: true });
                apps.createIndex('status', 'status', { unique: false });
                apps.createIndex('date', 'date', { unique: false });
                apps.createIndex('email', 'email', { unique: false });
                const wplans = db.createObjectStore('workout_plans', { keyPath: 'id', autoIncrement: true });
                wplans.createIndex('userId', 'userId', { unique: true });
                const nplans = db.createObjectStore('nutrition_plans', { keyPath: 'id', autoIncrement: true });
                nplans.createIndex('userId', 'userId', { unique: true });
            }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e.target.error);
    });
}
function dbGet(storeName, key) {
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction(storeName).objectStore(storeName).get(key);
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    }));
}
function dbGetAll(storeName) {
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction(storeName).objectStore(storeName).getAll();
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    }));
}
function dbGetByIndex(storeName, indexName, value) {
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction(storeName).objectStore(storeName)
            .index(indexName).getAll(value);
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    }));
}
function dbAdd(storeName, data) {
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction(storeName, 'readwrite').objectStore(storeName).add(data);
        req.onsuccess = () => res({ ok: true, id: req.result });
        req.onerror = () => rej(req.error);
    }));
}
function dbPut(storeName, data) {
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction(storeName, 'readwrite').objectStore(storeName).put(data);
        req.onsuccess = () => res({ ok: true, id: req.result });
        req.onerror = () => rej(req.error);
    }));
}
function dbDelete(storeName, key) {
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction(storeName, 'readwrite').objectStore(storeName).delete(key);
        req.onsuccess = () => res({ ok: true });
        req.onerror = () => rej(req.error);
    }));
}
async function hashPassword(password) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}
async function registerUser(name, email, password) {
    const hash = await hashPassword(password);
    return dbAdd('users', {
        name,
        email: email.toLowerCase().trim(),
        passwordHash: hash,
        createdAt: new Date().toISOString()
    }).catch(() => { throw new Error('Email уже зарегистрирован'); });
}
async function loginUser(email, password) {
    const hash = await hashPassword(password);
    return openDB().then(db => new Promise((res, rej) => {
        const req = db.transaction('users').objectStore('users')
            .index('email').get(email.toLowerCase().trim());
        req.onsuccess = () => {
            const u = req.result;
            if (!u)
                rej(new Error('Пользователь не найден'));
            else if (u.passwordHash !== hash)
                rej(new Error('Неверный пароль'));
            else
                res(u);
        };
        req.onerror = () => rej(new Error('Ошибка базы данных'));
    }));
}
function getUserById(id) { return dbGet('users', id); }
function getAllUsers() { return dbGetAll('users'); }
function deleteUser(id) { return dbDelete('users', id); }
async function updateUser(id, fields) {
    const user = await getUserById(id);
    if (!user)
        throw new Error('Пользователь не найден');
    return dbPut('users', { ...user, ...fields });
}
function saveProgress(userId, data) {
    return dbAdd('progress', {
        userId,
        date: new Date().toLocaleDateString('ru-RU'),
        isoDate: new Date().toISOString(),
        weight: data.weight || null,
        chest: data.chest || null,
        waist: data.waist || null,
        hips: data.hips || null
    });
}
function getProgress(userId) {
    return dbGetByIndex('progress', 'userId', userId)
        .then(r => r.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate)));
}
function getAllProgress() {
    return dbGetAll('progress').then(r => r.sort((a, b) => b.id - a.id));
}
function deleteProgress(id) { return dbDelete('progress', id); }
function logWorkout(userId, type, notes) {
    return dbAdd('workouts', {
        userId, type, notes: notes || '',
        date: new Date().toISOString()
    });
}
function getWorkouts(userId) {
    return dbGetByIndex('workouts', 'userId', userId)
        .then(r => r.sort((a, b) => new Date(b.date) - new Date(a.date)));
}
function getAllWorkouts() {
    return dbGetAll('workouts').then(r => r.sort((a, b) => new Date(b.date) - new Date(a.date)));
}
function saveApplication(data) {
    return dbAdd('applications', {
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        goal: data.goal || '',
        message: data.message || '',
        date: new Date().toISOString(),
        status: 'new'
    });
}
function getAllApplications() {
    return dbGetAll('applications').then(r => r.sort((a, b) => new Date(b.date) - new Date(a.date)));
}
async function updateApplicationStatus(id, status) {
    const app = await dbGet('applications', id);
    if (!app)
        throw new Error('Заявка не найдена');
    return dbPut('applications', { ...app, status });
}
function deleteApplication(id) { return dbDelete('applications', id); }
async function saveWorkoutPlan(userId, name, exercises) {
    const existing = await dbGetByIndex('workout_plans', 'userId', userId);
    const record = {
        userId,
        name: name || 'Индивидуальная программа',
        exercises: JSON.stringify(exercises || []),
        updatedAt: new Date().toISOString()
    };
    if (existing.length > 0) {
        return dbPut('workout_plans', { ...existing[0], ...record });
    }
    return dbAdd('workout_plans', record);
}
async function getWorkoutPlan(userId) {
    const plans = await dbGetByIndex('workout_plans', 'userId', userId);
    if (!plans.length)
        return null;
    const p = plans[0];
    return { ...p, exercises: JSON.parse(p.exercises || '[]') };
}
function deleteWorkoutPlan(userId) {
    return dbGetByIndex('workout_plans', 'userId', userId)
        .then(plans => plans.length ? dbDelete('workout_plans', plans[0].id) : null);
}
async function saveNutritionPlan(userId, data) {
    const existing = await dbGetByIndex('nutrition_plans', 'userId', userId);
    const record = {
        userId,
        calories: data.calories || 0,
        protein: data.protein || 0,
        fat: data.fat || 0,
        carbs: data.carbs || 0,
        notes: data.notes || '',
        updatedAt: new Date().toISOString()
    };
    if (existing.length > 0) {
        return dbPut('nutrition_plans', { ...existing[0], ...record });
    }
    return dbAdd('nutrition_plans', record);
}
async function getNutritionPlan(userId) {
    const plans = await dbGetByIndex('nutrition_plans', 'userId', userId);
    return plans.length ? plans[0] : null;
}
function deleteNutritionPlan(userId) {
    return dbGetByIndex('nutrition_plans', 'userId', userId)
        .then(plans => plans.length ? dbDelete('nutrition_plans', plans[0].id) : null);
}
