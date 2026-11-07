# Implementation Plan: Life To-Do List Dashboard

## Overview

Dokumen ini berisi daftar tugas verifikasi untuk mendokumentasikan bahwa implementasi yang sudah ada memenuhi semua acceptance criteria. Tidak ada kode baru yang perlu ditulis — setiap task adalah pemeriksaan terhadap kode yang sudah ada di `index.html`, `css/style.css`, dan `js/script.js`.

## Task Dependency Graph

```
1 (markup) → 2, 3, 4, 5, 6, 7
8 (independen)
```

Semua task verifikasi fungsional (2–7) bergantung pada kebenaran markup (task 1). Task 8 berdiri sendiri karena menguji wrapper `localStorage` secara terpisah.

```json
{
  "waves": [
    { "wave": 1, "tasks": [1, 8] },
    { "wave": 2, "tasks": [2, 3, 4, 5, 6, 7] }
  ]
}
```

## Relevant Files

- `life-dashboard/index.html` — markup halaman utama
- `life-dashboard/css/style.css` — semua gaya dan variabel tema
- `life-dashboard/js/script.js` — semua logika aplikasi

## Tasks

- [ ] 1. Verifikasi struktur markup `index.html`
  - Pastikan semua elemen memiliki `id` yang sesuai: `theme-toggle`, `clock`, `date`, `greeting-text`, `edit-name`, `timer-display`, `timer-start`, `timer-stop`, `timer-reset`, `timer-minutes`, `task-form`, `task-input`, `task-list`, `link-form`, `link-name`, `link-url`, `link-list`
  - Pastikan `<html lang="id">` dan `<meta charset="UTF-8">` sudah ada
  - Pastikan `<link rel="stylesheet">` mengarah ke `css/style.css` dan `<script src>` mengarah ke `js/script.js`
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 2. Verifikasi modul Theme Toggle (`js/script.js`)
  - Pastikan `applyTheme()` menulis ke `document.documentElement.dataset.theme`
  - Pastikan ikon tombol diperbarui (`☀️` / `🌙`) sesuai tema aktif
  - Pastikan tema dimuat dari `localStorage` saat inisialisasi dengan default `'light'`
  - Pastikan klik toggle menyimpan tema baru ke `localStorage`
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3. Verifikasi modul Greeting, Clock & Date (`js/script.js`)
  - Pastikan `updateClock()` dipanggil setiap 1 detik
  - Pastikan format jam `HH:MM:SS` (24 jam) dan tanggal panjang bahasa Indonesia
  - Pastikan `greetingWord()` mengembalikan salam yang tepat sesuai rentang jam
  - Pastikan nama pengguna ditambahkan ke salam jika tersedia
  - Pastikan `edit-name` prompt menyimpan hasil ke `localStorage['userName']`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 4. Verifikasi modul Focus Timer (`js/script.js`)
  - Pastikan `startTimer()` tidak membuat interval baru jika sudah berjalan (`timerId` guard)
  - Pastikan `stopTimer()` hanya menghentikan interval tanpa mengatur ulang `remaining`
  - Pastikan `resetTimer()` mengembalikan `remaining` ke `minutes * 60`
  - Pastikan alert muncul saat `remaining` mencapai nol
  - Pastikan input durasi di-clamp ke rentang 1–180
  - Pastikan durasi disimpan ke `localStorage['timerMinutes']`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 5. Verifikasi modul To-Do List (`js/script.js`)
  - Pastikan task baru dibuat dengan `{ id: Date.now(), text, done: false }`
  - Pastikan `renderTasks()` menampilkan placeholder saat array kosong
  - Pastikan checkbox mengubah `task.done` dan menyimpan ke `localStorage`
  - Pastikan edit inline menyimpan saat Enter/blur dan membatalkan saat Escape
  - Pastikan edit dengan teks kosong tidak mengubah teks asli
  - Pastikan hapus memfilter array berdasarkan `task.id`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 6. Verifikasi modul Quick Links (`js/script.js`)
  - Pastikan tautan baru mendapat awalan `https://` jika tidak ada protokol
  - Pastikan anchor dibuat dengan `target="_blank"` dan `rel="noopener noreferrer"`
  - Pastikan tiga tautan default dimuat jika `localStorage['links']` kosong
  - Pastikan tombol hapus memfilter array berdasarkan `link.id`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 7. Verifikasi CSS dan layout responsif (`css/style.css`)
  - Pastikan variabel warna tema ada di `:root` dan di-override di `[data-theme="dark"]`
  - Pastikan `.dashboard` menggunakan `grid-template-columns: 1fr 1fr` di atas 700px
  - Pastikan breakpoint `@media (max-width: 700px)` mengubah grid ke satu kolom
  - Pastikan elemen interaktif tetap dapat digunakan di lebar kecil
  - _Requirements: 5.3, 6.1, 6.2, 6.3_

- [ ] 8. Verifikasi ketahanan `localStorage` (`js/script.js`)
  - Pastikan `store.get` mengembalikan nilai `fallback` jika JSON tidak valid atau kunci tidak ada
  - Pastikan `store.set` tidak melempar exception jika `localStorage` tidak tersedia
  - _Requirements: 7.1, 7.2_
