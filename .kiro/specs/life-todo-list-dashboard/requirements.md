# Requirements Document

## Introduction

Life To-Do List Dashboard adalah dasbor pribadi berbasis browser yang berjalan sepenuhnya di sisi klien tanpa backend. Semua data persisten disimpan di `localStorage`. Proyek terdiri dari tiga file: `index.html`, `css/style.css`, dan `js/script.js`. Dokumen ini mendokumentasikan fitur dan perilaku yang sudah ada sebagai referensi proyek.

## Requirements

### 1. Salam, Jam & Tanggal

#### Acceptance Criteria

- 1.1 Jam digital ditampilkan dalam format `HH:MM:SS` (24 jam) dan diperbarui setiap detik.
- 1.2 Tanggal ditampilkan dalam format panjang bahasa Indonesia (contoh: "Senin, 14 Juli 2025").
- 1.3 Teks salam disesuaikan dengan waktu: "Selamat Pagi" (sebelum pukul 11.00), "Selamat Siang" (11.00–14.59), "Selamat Sore" (15.00–17.59), "Selamat Malam" (18.00 ke atas).
- 1.4 Nama pengguna yang tersimpan ditampilkan di belakang teks salam (contoh: "Selamat Pagi, Rizki").
- 1.5 Tombol "Atur nama" membuka dialog `prompt` untuk mengubah nama; nama kosong diterima dan menghilangkan bagian nama dari salam.
- 1.6 Nama pengguna disimpan di `localStorage` dengan kunci `userName` dan dimuat kembali saat halaman dibuka.

---

### 2. Pengatur Waktu Fokus (Pomodoro Timer)

#### Acceptance Criteria

- 2.1 Timer ditampilkan dalam format `MM:SS` dan mulai dari durasi yang telah dikonfigurasi.
- 2.2 Tombol "Mulai" memulai hitung mundur; jika timer sudah berjalan atau waktu habis, tombol tidak melakukan apa-apa.
- 2.3 Tombol "Berhenti" menghentikan hitung mundur tanpa mengatur ulang sisa waktu.
- 2.4 Tombol "Atur Ulang" menghentikan hitung mundur dan mengembalikan sisa waktu ke durasi yang dikonfigurasi.
- 2.5 Saat hitung mundur mencapai nol, timer berhenti otomatis dan notifikasi `alert` ditampilkan.
- 2.6 Input durasi menerima nilai antara 1 hingga 180 menit; nilai di luar rentang ini dikoreksi otomatis ke batas terdekat.
- 2.7 Mengubah input durasi secara otomatis mengatur ulang timer ke durasi baru.
- 2.8 Durasi yang dipilih pengguna disimpan di `localStorage` dengan kunci `timerMinutes` dan dimuat kembali saat halaman dibuka.

---

### 3. Daftar Tugas (To-Do List)

#### Acceptance Criteria

- 3.1 Pengguna dapat menambah tugas baru melalui form; input kosong tidak diproses.
- 3.2 Setiap tugas ditampilkan dengan: kotak centang status selesai, teks tugas, dan tombol "Hapus".
- 3.3 Mencentang kotak menandai tugas sebagai selesai; teks tugas ditampilkan dengan garis coret dan warna muted.
- 3.4 Klik pada teks tugas mengaktifkan mode edit inline; Enter atau blur menyimpan perubahan, Escape membatalkan.
- 3.5 Teks edit yang dikosongkan tidak disimpan; nilai lama dipertahankan.
- 3.6 Tombol "Hapus" menghapus tugas dari daftar secara permanen.
- 3.7 Saat tidak ada tugas, pesan placeholder "Belum ada tugas. Tambahkan satu di atas." ditampilkan.
- 3.8 Seluruh daftar tugas disimpan di `localStorage` dengan kunci `tasks` dalam format array JSON.

---

### 4. Tautan Cepat

#### Acceptance Criteria

- 4.1 Tautan cepat ditampilkan sebagai tombol/kartu yang membuka URL di tab baru dengan atribut `rel="noopener noreferrer"`.
- 4.2 Pengguna dapat menambah tautan baru dengan mengisi nama dan URL; kedua field wajib diisi.
- 4.3 URL yang dimasukkan tanpa awalan `http://` atau `https://` secara otomatis ditambahkan awalan `https://`.
- 4.4 Tombol "✕" di pojok kartu tautan menghapus tautan tersebut secara permanen.
- 4.5 Tiga tautan default (Google, Gmail, Calendar) dimuat jika belum ada data di `localStorage`.
- 4.6 Daftar tautan disimpan di `localStorage` dengan kunci `links` dalam format array JSON.

---

### 5. Mode Terang / Gelap

#### Acceptance Criteria

- 5.1 Ikon bulan (🌙) di header menunjukkan mode terang aktif; klik mengaktifkan mode gelap.
- 5.2 Ikon matahari (☀️) menunjukkan mode gelap aktif; klik mengaktifkan mode terang.
- 5.3 Perubahan tema diterapkan secara instan ke seluruh halaman melalui atribut `data-theme` pada elemen `<html>`.
- 5.4 Tema yang dipilih pengguna disimpan di `localStorage` dengan kunci `theme` dan dimuat kembali saat halaman dibuka; default-nya adalah mode terang.

---

### 6. Responsivitas

#### Acceptance Criteria

- 6.1 Di layar dengan lebar lebih dari 700px, layout menggunakan grid dua kolom.
- 6.2 Di layar dengan lebar 700px atau kurang, layout beralih ke satu kolom.
- 6.3 Semua elemen interaktif (tombol, input, form) tetap dapat digunakan di layar mobile.

---

### 7. Persistensi Data

#### Acceptance Criteria

- 7.1 Semua data pengguna (nama, tema, durasi timer, tugas, tautan) dipertahankan saat tab ditutup dan dibuka kembali.
- 7.2 Jika `localStorage` tidak tersedia atau gagal, aplikasi tetap berfungsi dengan nilai default (tidak crash).
