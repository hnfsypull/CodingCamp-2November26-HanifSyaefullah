// ===== Helper Local Storage =====
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};
const $ = (id) => document.getElementById(id);

// ===== Tantangan 1: Mode Terang / Gelap =====
const themeBtn = $('theme-toggle');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}
applyTheme(store.get('theme', 'light'));
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  store.set('theme', next);
  applyTheme(next);
});

// ===== Salam, Waktu & Tanggal =====
// Tantangan 2: Nama khusus dalam ucapan salam
let userName = store.get('userName', '');
function greetingWord(hour) {
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}
function updateClock() {
  const now = new Date();
  $('clock').textContent = now.toLocaleTimeString('id-ID', { hour12: false }).replace(/\./g, ':');
  $('date').textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('greeting-text').textContent = greetingWord(now.getHours()) + (userName ? ', ' + userName : '');
}
$('edit-name').addEventListener('click', () => {
  const name = prompt('Siapa namamu?', userName);
  if (name !== null) {
    userName = name.trim();
    store.set('userName', userName);
    updateClock();
  }
});
updateClock();
setInterval(updateClock, 1000);

// ===== Pengatur Waktu Fokus =====
// Tantangan 3: Ubah durasi Pomodoro
let minutes = store.get('timerMinutes', 25);
let remaining = minutes * 60;
let timerId = null;
const minutesInput = $('timer-minutes');
minutesInput.value = minutes;

function renderTimer() {
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  $('timer-display').textContent = `${m}:${s}`;
}
function stopTimer() { clearInterval(timerId); timerId = null; }
function startTimer() {
  if (timerId || remaining <= 0) return;
  timerId = setInterval(() => {
    remaining--;
    renderTimer();
    if (remaining <= 0) { stopTimer(); alert('Waktu fokus selesai! Saatnya istirahat.'); }
  }, 1000);
}
function resetTimer() { stopTimer(); remaining = minutes * 60; renderTimer(); }

$('timer-start').addEventListener('click', startTimer);
$('timer-stop').addEventListener('click', stopTimer);
$('timer-reset').addEventListener('click', resetTimer);
minutesInput.addEventListener('change', () => {
  const v = Math.min(180, Math.max(1, parseInt(minutesInput.value, 10) || 25));
  minutes = v;
  minutesInput.value = v;
  store.set('timerMinutes', v);
  resetTimer();
});
renderTimer();

// ===== Daftar Tugas =====
let tasks = store.get('tasks', []);
const taskList = $('task-list');

function saveTasks() { store.set('tasks', tasks); }

function renderTasks() {
  taskList.innerHTML = '';
  if (!tasks.length) {
    taskList.innerHTML = '<li class="empty">Belum ada tugas. Tambahkan satu di atas.</li>';
    return;
  }
  tasks.forEach((task) => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.done;
    check.addEventListener('change', () => { task.done = check.checked; saveTasks(); renderTasks(); });

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = task.text;
    label.title = 'Klik untuk mengedit';
    label.addEventListener('click', () => startEdit(task, li, label));

    const del = document.createElement('button');
    del.className = 'btn danger';
    del.textContent = 'Hapus';
    del.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks(); renderTasks();
    });

    li.append(check, label, del);
    taskList.appendChild(li);
  });
}

function startEdit(task, li, label) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;
  li.replaceChild(input, label);
  input.focus();
  const finish = (save) => {
    const v = input.value.trim();
    if (save && v) { task.text = v; saveTasks(); }
    renderTasks();
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));
}

$('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = $('task-input').value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  $('task-input').value = '';
  renderTasks();
});
renderTasks();

// ===== Tautan Cepat =====
let links = store.get('links', [
  { id: 1, name: 'Google', url: 'https://www.google.com' },
  { id: 2, name: 'Gmail', url: 'https://mail.google.com' },
  { id: 3, name: 'Calendar', url: 'https://calendar.google.com' }
]);

function renderLinks() {
  const box = $('link-list');
  box.innerHTML = '';
  links.forEach((link) => {
    const wrap = document.createElement('div');
    wrap.className = 'link-item';
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = link.name;
    const x = document.createElement('button');
    x.textContent = '✕';
    x.setAttribute('aria-label', 'Hapus tautan ' + link.name);
    x.addEventListener('click', () => {
      links = links.filter((l) => l.id !== link.id);
      store.set('links', links); renderLinks();
    });
    wrap.append(a, x);
    box.appendChild(wrap);
  });
}

$('link-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('link-name').value.trim();
  let url = $('link-url').value.trim();
  if (!name || !url) return;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  links.push({ id: Date.now(), name, url });
  store.set('links', links);
  $('link-name').value = '';
  $('link-url').value = '';
  renderLinks();
});
renderLinks();
