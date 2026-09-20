# Aktivasi refaktor routing dan admin

Frontend memerlukan migrasi baru sebelum operasi pinjam, impor, dan pembuatan admin digunakan di produksi.

1. Pada database lama yang sudah menjalankan schema.sql, migration_superadmin_bulk.sql, dan migration_production_hardening.sql, jalankan supabase/migrations/202609200001_routes_rls.sql melalui SQL Editor. Jangan menjalankan ulang schema.sql karena mengandung seed.
2. Deploy Edge Function: supabase functions deploy create-admin --project-ref jnhquzslunrurtuxbciu
3. Function memvalidasi token pengguna dengan Auth server dan memeriksa role superadmin aktif. SUPABASE_SERVICE_ROLE_KEY hanya tersedia di environment function, tidak di frontend.
4. Login sebagai superadmin dan uji Pengaturan Admin; gunakan akun uji yang Anda izinkan untuk dibuat.

## Route

Semua path di bawah diawali /app/:username. Username dinormalisasi dari email akun login; identitas dan izin tetap memakai UID Supabase.

- Beranda: path kosong
- Koleksi: koleksi; detail: koleksi/:bookSlug
- Anggota: peminjaman, unduhan, profil, komunitas
- Admin: admin, katalog-buku, katalog-buku/upload-buku, katalog-buku/edit/:bookId, unggah-artikel, sirkulasi, usulan-buku, laporan
- Superadmin: pengaturan-admin, katalog-buku/unggah-masal

## Verifikasi yang telah dijalankan

- TypeScript dan build Vite lulus.
- Migrasi dijalankan pada database Docker terpisah lasem_route_audit_20260920.
- tests/sql/rls.sql lulus: eskalasi role ditolak, privasi profil, write katalog anggota ditolak, impor anggota ditolak, pinjam/perpanjang/pengembalian admin.
- Browser tanpa sesi diarahkan dari pengaturan-admin ke login.
- Pengujian login dan submit form ke produksi belum dijalankan; migrasi dan Edge Function belum dideploy ke produksi.

Database audit tidak berisi salinan data produksi. Data sintetis pengujian memakai rollback.

## Audit policy

Migrasi mengganti policy lama pada tujuh tabel aplikasi untuk mencegah gabungan OR dari policy permisif. Role dan aktif tidak dapat diubah client. Kontak usulan buku dibatasi ke pemilik/pengelola. Peminjaman memakai RPC; stok diperbarui atomik dan perpanjangan dibatasi sekali. Pengembalian dikonfirmasi pengelola. Views menggunakan security_invoker.

Periksa duplikasi ISBN sebelum migrasi: unique index sengaja gagal bila ada data ganda, tanpa menghapus data.
