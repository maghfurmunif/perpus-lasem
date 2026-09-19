# Perbaikan & Implementasi Fase 1-5 — Perpustakaan Lasem Sidayu

## Ringkasan Perbaikan

### Bug yang diperbaiki
1. **`App.tsx` rusak (Phase 1D)** — file hanya 22 baris dan merender `<HomeTab />` tanpa props
   sehingga aplikasi gagal kompilasi. Shell aplikasi lengkap (550 baris) direkonstruksi dari
   git history ke `src/LibraryApp.tsx` dan kini tersambung ke Supabase Auth + Database.
2. **Modal crash (React Hooks violation)** — `if (!book) return null` dipanggil sebelum
   `useState` di BookDetailModal, ReaderModal, BookRequestModal, LoginModal, dan WhatsAppModal.
   Ini melanggar aturan Hooks dan membuat aplikasi crash saat modal dibuka. Semua sudah diperbaiki.
3. **RoleGuard & AuthContext** — kini typed, punya helper `isAdmin`, `role`, dan `refreshProfile`.
4. **`supabase.ts`** — tidak lagi mengebar log ke console; ada flag `hasSupabase` untuk mode demo.

---

## Urutan Implementasi Sesuai Permintaan

### ✅ PHASE 1 — Supabase setup, Login anggota, Role user, Database schema
- `supabase/schema.sql`: tabel `profiles` + constraint role
  (`superadmin / admin / pustakawan / anggota / kepala_desa`), trigger `handle_new_user`,
  fungsi RLS helper `is_admin()` & `is_member_active()`.
- `AuthContext` typed lengkap: login, register, logout, refreshProfile, role, isAdmin.
- `Login.tsx` & `Register.tsx` baru: validasi, error message bahasa Indonesia,
  link reset password, redirect per status verifikasi email.
- `AppRouter`: `/login`, `/register` publik; selain itu dilindungi `ProtectedRoute`.
- Gerbang Portal Desa: hanya role pengelola yang bisa membuka tab admin.

### ✅ PHASE 2 — Koleksi buku dari database, Upload cover Cloudinary, Detail buku
- Tabel `books` + seed 10 buku katalog desa.
- `src/lib/db.ts`: fetch/insert/update/delete buku + agregat rating dari tabel `reviews`.
- Detail buku: ulasan warga disimpan ke tabel `reviews` (bukan lagi local state).
- **Cloudinary**: form tambah/edit buku kini punya tombol "📷 Upload Cover"
  (`src/lib/cloudinary.ts`, unsigned upload, folder `perpus-lasem/covers`).

### ✅ PHASE 3 — Stock management, Peminjaman nyata, Dashboard pustakawan
- Kolom stok `total_copies` / `available_copies` di tabel books.
- **Trigger stok otomatis** `handle_borrow_stock()`: pinjam = stok −1, kembali = stok +1.
- Tabel `borrowings` dengan RLS: anggota hanya melihat peminjamannya sendiri;
  pengelola (pustakawan/admin) melihat semua.
- Peminjaman nyata: tombol "Ajukan Pinjaman" membuat baris di `borrowings`,
  jatuh tempo 14 hari, perpanjang +7 hari sekali, verifikasi pengembalian.
- Dashboard pustakawan (Portal Desa): katalog CRUD, sirkulasi, usulan buku,
  warta desa — semua tersimpan ke database.

### ✅ PHASE 4 — PWA, Offline cache, Offline reader
- `public/manifest.webmanifest` + ikon 192/512 → bisa di-install seperti aplikasi Android.
- `public/sw.js`: service worker strategi cache-first (asset), network-first (Supabase API &
  navigasi) dengan fallback offline.
- **Offline reader**: buku yang diunduh disimpan ke localStorage
  (`src/lib/offline.ts`) dan tetap bisa dibaca lewat ReaderModal saat offline.
- Registrasi SW otomatis di `index.html`.

### ✅ PHASE 5 — Komunitas, Agenda, Statistik
- Tabel `forum_posts` + tab **Komunitas** baru (forum warga: kategori, suka, agenda).
- Agenda/warta dari tabel `announcements` (seed 3 agenda desa).
- Statistik: SQL view `library_stats` & `popular_books`; KPI dashboard admin
  kini live dari database (jumlah anggota, sirkulasi aktif, total peminjaman).

---

## Langkah Setup di Supabase (WAJIB)

1. Buka Supabase Dashboard project Anda.
2. **SQL Editor** → paste seluruh isi `supabase/schema.sql` → Run.
3. **Authentication → Providers → Email**: sesuaikan (aktif/nonaktif konfirmasi email).
4. Buat user admin pertama via **Authentication → Users → Add user**,
   lalu jalankan di SQL Editor:
   ```sql
   update public.profiles set role = 'superadmin' where email = 'email-anda@contoh.id';
   ```
5. Pastikan `.env` berisi:
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_CLOUDINARY_CLOUD_NAME=xxxx
   VITE_CLOUDINARY_UPLOAD_PRESET=perpus_lasem
   ```
6. Di Cloudinary: buat **Upload preset** bernama `perpus_lasem` (mode Unsigned).
7. Jalankan `npm run dev` → daftar akun → login.

> Tanpa `.env` Supabase, aplikasi tetap berjalan dalam **Mode Demo** (data contoh lokal,
> peminjaman/forum dimatikan) sehingga UI tetap bisa diuji.
