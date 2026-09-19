# 📚 Perpustakaan Lasem-Sidayu

![Status](https://img.shields.io/badge/status-development-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

Platform perpustakaan digital berbasis **mobile-first Progressive Web App (PWA)** untuk mendukung literasi masyarakat Lasem-Sidayu.

Project ini dikembangkan sebagai transformasi perpustakaan desa menjadi pusat literasi digital yang mudah diakses melalui perangkat mobile.

---

## 🎯 Tujuan Project

Perpustakaan Lasem-Sidayu bertujuan untuk:

- Mempermudah masyarakat mengakses koleksi buku digital
- Mendukung budaya membaca masyarakat desa
- Menyediakan sistem peminjaman buku modern
- Mendokumentasikan pengetahuan lokal
- Menjadi pusat informasi dan komunitas warga

---

# 🚀 Teknologi

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Lucide React
- Motion Animation

## Backend (Development Roadmap)

- Supabase Authentication
- Supabase PostgreSQL Database
- Row Level Security (RLS)

## Storage

- Cloudinary untuk:
  - Cover buku
  - Foto kegiatan
  - File digital

## Deployment

- Cloudflare Pages

---

# ✨ Fitur Saat Ini

## 📚 Katalog Buku

- Koleksi buku digital
- Pencarian buku
- Detail buku
- Kategori koleksi

## 📖 Digital Reader

- Membaca buku digital
- Mode membaca nyaman
- Dukungan mobile device

## 👤 Profil Anggota

- Data anggota
- Riwayat aktivitas
- Koleksi pribadi

## 📱 Mobile Interface

- Mobile-first design
- Bottom navigation
- Tampilan seperti aplikasi Android

---

# 🛠️ Fitur Pengembangan

## 🔐 Sistem Anggota

- Login menggunakan Supabase Auth
- Profil anggota
- Kartu anggota digital
- QR anggota

---

## 📦 Manajemen Buku

- Tambah koleksi
- Edit buku
- Manajemen kategori
- Stok buku

---

## 🔄 Sistem Peminjaman

- Pengajuan peminjaman
- Persetujuan pustakawan
- Status buku
- Riwayat peminjaman

---

## 📊 Dashboard Statistik

Informasi yang akan tersedia:

- Jumlah anggota
- Buku terpopuler
- Statistik peminjaman
- Aktivitas membaca

---

## 🌐 PWA Offline

Target:

- Install seperti aplikasi Android
- Membaca tanpa koneksi internet
- Sinkronisasi data otomatis

---

## 💬 Komunitas

Fitur:

- Forum warga
- Diskusi buku
- Berbagi informasi
- Cerita lokal

---

## 📅 Agenda

- Kegiatan perpustakaan
- Pelatihan masyarakat
- Event literasi

---

# 📂 Struktur Project

```
src
│
├── components
│   ├── BookDetailModal
│   ├── ReaderModal
│   ├── AdminDashboard
│   ├── BottomNav
│   └── ...
│
├── data
│   └── mockBooks.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

# 💻 Instalasi Development

Clone repository:

```bash
git clone https://github.com/maghfurmunif/perpus-lasem.git
```

Masuk folder:

```bash
cd perpus-lasem
```

Install dependency:

```bash
npm install
```

Jalankan:

```bash
npm run dev
```

Aplikasi berjalan:

```
http://localhost:3000
```

---

# 🔑 Environment Variable

Buat file:

```
.env
```

Isi:

```env
VITE_SUPABASE_URL=

VITE_SUPABASE_ANON_KEY=

VITE_CLOUDINARY_CLOUD_NAME=

VITE_CLOUDINARY_UPLOAD_PRESET=
```

---

# 🗺️ Roadmap

## Phase 1 - Foundation

✅ React + Vite setup  
✅ Mobile interface  
✅ Prototype katalog buku  


## Phase 2 - Backend

⬜ Supabase Authentication  
⬜ Database buku  
⬜ Sistem anggota  


## Phase 3 - Library System

⬜ Peminjaman nyata  
⬜ Stock management  
⬜ Dashboard admin  


## Phase 4 - Digital Library

⬜ PWA Offline  
⬜ Download buku  
⬜ Sinkronisasi  


## Phase 5 - Community

⬜ Forum warga  
⬜ Agenda desa  
⬜ Statistik literasi  


---

# 🤝 Kontribusi

Project ini masih dalam tahap pengembangan.

Kontribusi, ide, dan masukan sangat terbuka untuk membangun perpustakaan digital yang bermanfaat bagi masyarakat.

---

# 📜 License

MIT License

---

Dibangun untuk mendukung transformasi digital perpustakaan Lasem-Sidayu.