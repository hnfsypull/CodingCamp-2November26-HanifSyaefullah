# Design Document

## Overview

Life To-Do List Dashboard adalah single-page application (SPA) tanpa framework yang sepenuhnya berjalan di browser. Tidak ada proses build, bundler, atau dependency eksternal — semua logika ada di `js/script.js` dan semua gaya ada di `css/style.css`. Arsitektur ini dipilih agar aplikasi dapat dibuka langsung dari sistem file atau server statis mana pun.

---

## Architecture

### File Structure

```
life-dashboard/
├── index.html          # Markup halaman tunggal
├── css/
│   └── style.css       # Semua gaya termasuk variabel tema
└── js/
    └── script.js       # Semua logika aplikasi
```

### Data Flow

```
Browser Load → script.js inisialisasi
    ↓
localStorage.getItem() → state awal (tema, nama, timer, tasks, links)
    ↓
Render ke DOM
    ↓
Event pengguna → mutasi state → localStorage.setItem() → re-render
```

Tidak ada state global terpusat; setiap modul (timer, tasks, links, theme) mengelola state-nya sendiri dalam variabel module-level di `script.js`.

---

## Components and Interfaces

### 1. `store` — Helper localStorage

**Lokasi:** `js/script.js` (baris paling atas)

Objek dengan dua metode:
- `store.get(key, fallback)` — membaca dan mem-parse JSON dari `localStorage`; mengembalikan `fallback` jika kunci tidak ada atau JSON tidak valid.
- `store.set(key, value)` — meng-serialize nilai ke JSON dan menyimpannya; error diabaikan secara diam-diam.

Semua modul menggunakan helper ini sehingga akses `localStorage` terpusat dan aman dari exception.

---

### 2. Theme Toggle

**Elemen HTML:** `<button id="theme-toggle" class="icon-btn">`

**State:** `localStorage['theme']` — `'light'` | `'dark'`

**Cara kerja:**
- `applyTheme(theme)` menulis nilai ke `document.documentElement.dataset.theme` dan memperbarui ikon tombol.
- CSS menggunakan selector `[data-theme="dark"]` untuk mengganti CSS custom properties (variabel warna).
- Click handler membaca tema saat ini, membaliknya, menyimpan ke `localStorage`, lalu memanggil `applyTheme`.

**CSS Variables yang diubah per tema:**

| Variabel | Light | Dark |
|---|---|---|
| `--bg1`, `--bg2` | ungu terang | biru-ungu gelap |
| `--card` | `#ffffff` | `#252839` |
| `--text` | `#1f2430` | `#eceef8` |
| `--accent` | `#667eea` | `#8b9bff` |

---

### 3. Greeting, Clock & Date

**Elemen HTML:** `#clock`, `#date`, `#greeting-text`, `#edit-name`

**State:** variabel `userName` (string), dimuat dari `localStorage['userName']`

**Cara kerja:**
- `updateClock()` dipanggil saat inisialisasi dan setiap 1 detik via `setInterval`.
- `greetingWord(hour)` mengembalikan string salam berdasarkan jam.
- Click pada `#edit-name` memunculkan `prompt()` native browser; nilai baru (termasuk string kosong) disimpan ke `localStorage`.

---

### 4. Focus Timer

**Elemen HTML:** `#timer-display`, `#timer-start`, `#timer-stop`, `#timer-reset`, `#timer-minutes`

**State:**
- `minutes` — durasi yang dikonfigurasi (integer, 1–180), dari `localStorage['timerMinutes']`
- `remaining` — sisa detik (integer)
- `timerId` — ID interval atau `null`

**Cara kerja:**
- `renderTimer()` memformat `remaining` ke `MM:SS` dan menulis ke `#timer-display`.
- `startTimer()` membuat interval 1 detik; idempoten — tidak membuat interval baru jika sudah berjalan atau waktu habis.
- `stopTimer()` membersihkan interval dan mengatur `timerId` ke `null`.
- `resetTimer()` memanggil `stopTimer()` lalu mengatur ulang `remaining` ke `minutes * 60`.
- Perubahan input durasi memvalidasi rentang (clamp 1–180), menyimpan ke `localStorage`, lalu memanggil `resetTimer()`.

---

### 5. To-Do List

**Elemen HTML:** `#task-form`, `#task-input`, `#task-list`

**State:** array `tasks`, setiap item `{ id: number, text: string, done: boolean }`; dimuat dari `localStorage['tasks']`

**Cara kerja:**

- **Tambah:** `submit` pada `#task-form` membuat objek task baru dengan `id: Date.now()`, lalu memanggil `saveTasks()` dan `renderTasks()`.
- **Render:** `renderTasks()` mengosongkan `#task-list` dan membangun ulang DOM dari array `tasks`. Menampilkan pesan placeholder jika array kosong.
- **Selesaikan:** checkbox `change` event membalik `task.done` dan menyimpan.
- **Edit inline:** klik pada `<span.label>` mengganti span dengan `<input>` sementara. Enter/blur menyimpan; Escape membatalkan. Teks kosong tidak disimpan.
- **Hapus:** filter array berdasarkan `task.id`, simpan, render ulang.

**Struktur DOM setiap item:**
```
<li [class="done"]>
  <input type="checkbox">
  <span class="label">teks tugas</span>
  <button class="btn danger">Hapus</button>
</li>
```

---

### 6. Quick Links

**Elemen HTML:** `#link-form`, `#link-name`, `#link-url`, `#link-list`

**State:** array `links`, setiap item `{ id: number, name: string, url: string }`; default tiga entri jika `localStorage` kosong.

**Cara kerja:**

- **Tambah:** `submit` pada `#link-form` menambahkan `https://` ke URL jika tidak ada awalan protokol, lalu menyimpan dan render ulang.
- **Render:** `renderLinks()` mengosongkan `#link-list` dan membangun kartu per tautan. Setiap kartu berisi anchor `target="_blank" rel="noopener noreferrer"` dan tombol hapus.
- **Hapus:** filter array berdasarkan `link.id`, simpan ke `localStorage`, render ulang.

**Struktur DOM setiap kartu:**
```
<div class="link-item">
  <a href="..." target="_blank" rel="noopener noreferrer">nama</a>
  <button aria-label="Hapus tautan ...">✕</button>
</div>
```

---

## Styling & Layout

### Grid Layout

CSS Grid dua kolom (`grid-template-columns: 1fr 1fr`) pada `.dashboard`. Header salam dan bagian tautan cepat masing-masing memiliki `grid-column: 1 / -1` dan `1 / 2` secara berurutan.

Breakpoint responsif di `700px` mengubah grid ke satu kolom (`grid-template-columns: 1fr`).

### Tema

Semua warna didefinisikan sebagai CSS custom properties di `:root` (mode terang) dan di-override pada `[data-theme="dark"]`. JavaScript hanya mengubah `data-theme` — tidak ada manipulasi warna langsung di JS.

### Typography

Font stack: `"Inter", "Segoe UI", system-ui, sans-serif`. Tidak ada font eksternal yang di-load; Inter akan digunakan jika sudah terinstal di sistem, fallback ke font sistem.

---

## Data Models

| Kunci | Tipe | Default | Deskripsi |
|---|---|---|---|
| `theme` | `string` | `'light'` | Tema aktif: `'light'` atau `'dark'` |
| `userName` | `string` | `''` | Nama yang ditampilkan di salam |
| `timerMinutes` | `number` | `25` | Durasi fokus timer (1–180 menit) |
| `tasks` | `array` | `[]` | Daftar tugas |
| `links` | `array` | 3 tautan default | Daftar tautan cepat |

---

## Correctness Properties

#### Property 1: Timer Idempoten
Memanggil `startTimer()` beberapa kali berturut-turut tidak membuat lebih dari satu interval aktif — dijamin oleh guard `if (timerId || remaining <= 0) return`.

#### Property 2: Persistensi Aman
Semua operasi `localStorage` dibungkus try-catch; kegagalan tidak menyebabkan crash aplikasi — dijamin oleh wrapper `store.get` dan `store.set`.

#### Property 3: URL Aman
Tautan yang ditambahkan selalu memiliki awalan protokol `https://` atau `http://`; regex `!/^https?:\/\//i.test(url)` memastikan tidak ada tautan `javascript:` atau protokol berbahaya lainnya.

#### Property 4: Edit Tugas Nondestruktif
Edit inline yang menghasilkan teks kosong tidak disimpan; teks asli dipertahankan — dijamin oleh guard `if (save && v)` di fungsi `finish`.

#### Property 5: Tema Konsisten
Tema selalu disinkronkan antara `document.documentElement.dataset.theme` dan `localStorage['theme']` melalui satu fungsi `applyTheme` — tidak pernah ada inkonsistensi antara tampilan dan nilai yang tersimpan.
