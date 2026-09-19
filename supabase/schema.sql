-- ============================================================
-- PERPUSTAKAAN LASEM SIDAYU - SCHEMA LENGKAP (Phase 1-5)
-- Jalankan seluruh file ini di Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- PHASE 1: PROFILES & ROLES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama_lengkap text not null default 'Warga Desa',
  email text,
  nomor_wa text,
  alamat text,
  role text not null default 'anggota'
    check (role in ('superadmin','admin','pustakawan','anggota','kepala_desa')),
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper dideklarasikan sebelum policy yang menggunakannya.
-- Penting: PostgreSQL harus sudah mengenal fungsi saat CREATE POLICY dijalankan.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('superadmin','admin','pustakawan','kepala_desa')
      and aktif
  );
$$;

drop policy if exists "profile sendiri lihat" on public.profiles;
create policy "profile sendiri lihat"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profile sendiri update" on public.profiles;
create policy "profile sendiri update"
on public.profiles for update
using (auth.uid() = id or public.is_admin());

-- Trigger: buat profile otomatis saat user baru registrasi
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nama_lengkap, email, nomor_wa, alamat)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama_lengkap', 'Warga Desa'),
    new.email,
    new.raw_user_meta_data->>'nomor_wa',
    new.raw_user_meta_data->>'alamat'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Helper: apakah user punya role pengelola? (dipakai RLS)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('superadmin','admin','pustakawan','kepala_desa')
      and aktif
  );
$$;

-- Helper: apakah user anggota aktif? (boleh meminjam & menulis forum)
create or replace function public.is_member_active()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and aktif
  );
$$;

-- ============================================================
-- PHASE 2: BUKU (KOLEKSI + COVER CLOUDINARY)
-- ============================================================
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  author text not null default 'Anonim',
  category text not null default 'Edukasi'
    check (category in ('Edukasi','Pertanian','UMKM','Budaya Desa','Fiksi & Populer')),
  cover_image text,
  format text not null default 'PDF' check (format in ('PDF','EPUB','Buku Fisik')),
  access_type text not null default 'Akses Terbuka' check (access_type in ('Akses Terbuka','Lisensi Terbatas')),
  pages int not null default 0,
  file_size text default '-',
  description text not null default '',
  isbn text,
  year int not null default 2026,
  publisher text default 'Perpustakaan Lasem Sidayu',
  tags text[] not null default '{}',
  sample_chapters jsonb not null default '[]',
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_new boolean not null default true,
  -- PHASE 3: STOCK MANAGEMENT
  total_copies int not null default 1,
  available_copies int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "buku dibaca semua" on public.books
for select using (true);

create policy "buku tulis pengelola" on public.books
for insert with check (public.is_admin());

create policy "buku update pengelola" on public.books
for update using (public.is_admin());

create policy "buku hapus pengelola" on public.books
for delete using (public.is_admin());

-- ============================================================
-- PHASE 3: PEMINJAMAN NYATA + STOK OTOMATIS
-- ============================================================
create table if not exists public.borrowings (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  borrower_id uuid not null references public.profiles(id) on delete cascade,
  borrow_date timestamptz not null default now(),
  due_date date not null,
  returned_at timestamptz,
  status text not null default 'active' check (status in ('active','extended','returned','overdue')),
  extended boolean not null default false,
  notes text
);

alter table public.borrowings enable row level security;

create policy "pinjaman lihat sendiri atau pengelola" on public.borrowings
for select using (borrower_id = auth.uid() or public.is_admin());

create policy "pinjaman buat oleh anggota aktif" on public.borrowings
for insert with check (borrower_id = auth.uid() and public.is_member_active());

create policy "pinjaman update pengelola atau pemilik" on public.borrowings
for update using (public.is_admin() or borrower_id = auth.uid());

-- Trigger stok: pinjam = stok -1, kembali = stok +1
create or replace function public.handle_borrow_stock()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    if new.status in ('active','extended') then
      update public.books
        set available_copies = greatest(0, available_copies - 1)
        where id = new.book_id;
    end if;
  elsif (tg_op = 'UPDATE') then
    if (old.status not in ('active','extended')) and (new.status in ('active','extended')) then
      update public.books
        set available_copies = greatest(0, available_copies - 1)
        where id = new.book_id;
    elsif (old.status <> 'returned') and (new.status = 'returned') then
      update public.books
        set available_copies = least(total_copies, available_copies + 1),
            updated_at = now()
        where id = new.book_id;
      new.returned_at := now();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_borrow_stock on public.borrowings;
create trigger on_borrow_stock
before insert or update on public.borrowings
for each row execute function public.handle_borrow_stock();

-- ============================================================
-- PHASE 2/5: ULASAN BUKU
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  user_name text not null default 'Warga Desa',
  user_role text,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "ulasan dibaca semua" on public.reviews
for select using (true);

create policy "ulasan tulis anggota aktif" on public.reviews
for insert with check (user_id = auth.uid() and public.is_member_active());

create policy "ulasan hapus pengelola atau pemilik" on public.reviews
for delete using (public.is_admin() or user_id = auth.uid());

-- ============================================================
-- PHASE 5: AGENDA / PENGUMUMAN (WARTA DESA)
-- ============================================================
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Pemerintahan Desa',
  summary text not null default '',
  author text not null default 'Pemerintah Desa Lasem Sidayu',
  badge text not null default 'Agenda',
  event_date date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "warta dibaca semua" on public.announcements
for select using (true);

create policy "warta tulis pengelola" on public.announcements
for insert with check (public.is_admin());

create policy "warta hapus pengelola" on public.announcements
for delete using (public.is_admin());

-- ============================================================
-- USULAN BUKU DARI WARGA
-- ============================================================
create table if not exists public.book_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  category text not null default 'Edukasi'
    check (category in ('Edukasi','Pertanian','UMKM','Budaya Desa','Fiksi & Populer')),
  reason text not null default '',
  requester_id uuid references public.profiles(id) on delete set null,
  requester_name text not null default 'Warga Desa',
  requester_dusun text,
  requester_phone text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','fulfilled')),
  budget_estimated text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.book_requests enable row level security;

create policy "usulan dibaca semua" on public.book_requests
for select using (true);

create policy "usulan tulis anggota aktif" on public.book_requests
for insert with check (public.is_member_active());

create policy "usulan update pengelola" on public.book_requests
for update using (public.is_admin());

-- ============================================================
-- PHASE 5: KOMUNITAS - FORUM WARGA
-- ============================================================
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null default 'Warga Desa',
  category text not null default 'Umum',
  title text not null,
  content text not null,
  likes int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.forum_posts enable row level security;

create policy "forum dibaca semua" on public.forum_posts
for select using (true);

create policy "forum tulis anggota aktif" on public.forum_posts
for insert with check (user_id = auth.uid() and public.is_member_active());

create policy "forum hapus pengelola atau pemilik" on public.forum_posts
for delete using (public.is_admin() or user_id = auth.uid());

-- ============================================================
-- PHASE 5: STATISTIK (VIEWS)
-- ============================================================
create or replace view public.library_stats as
select
  (select count(*) from public.books) as total_books,
  (select coalesce(sum(total_copies),0) from public.books) as total_copies,
  (select coalesce(sum(available_copies),0) from public.books) as available_copies,
  (select count(*) from public.profiles where aktif) as total_members,
  (select count(*) from public.borrowings where status in ('active','extended')) as active_borrows,
  (select count(*) from public.borrowings) as total_borrows,
  (select count(*) from public.borrowings where status = 'returned') as returned_borrows,
  (select count(*) from public.book_requests where status = 'pending') as pending_requests,
  (select count(*) from public.forum_posts) as total_forum_posts;

-- Buku terpopuler berdasarkan jumlah peminjaman
create or replace view public.popular_books as
select
  b.id, b.title, b.author, b.category, b.cover_image,
  count(br.id) as borrow_count
from public.books b
left join public.borrowings br on br.book_id = b.id
group by b.id, b.title, b.author, b.category, b.cover_image
order by borrow_count desc
limit 10;

grant select on public.library_stats to anon, authenticated;
grant select on public.popular_books to anon, authenticated;

-- ============================================================
-- SEED: KOLEKSI BUKU AWAL (dari katalog prototype)
-- ============================================================
insert into public.books
  (title, author, category, cover_image, format, access_type, pages, file_size, description, isbn, year, publisher, tags, total_copies, available_copies, is_featured, is_popular, is_new)
values
  ('Panduan Praktis Budidaya Sayur Organik di Pekarangan Rumah', 'Ir. H. Sudirman & Tim Balai Tani', 'Pertanian',
   'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
   'PDF', 'Akses Terbuka', 148, '2.4 MB',
   'Buku panduan langkah-demi-langkah memanfaatkan lahan sempit dan pekarangan desa untuk menanam cabai, terong, sawi, dan tomat menggunakan pupuk kompos alami buatan sendiri.',
   '978-602-8491-12-4', 2024, 'Pustaka Tani Makmur', '{Organik,Pekarangan,Pupuk Kompos}', 12, 8, true, true, false),
  ('Manajemen Keuangan Sederhana untuk Warung & UMKM Desa', 'Dra. Nur Indahsari, M.Ak', 'UMKM',
   'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
   'EPUB', 'Akses Terbuka', 112, '820 KB',
   'Cara mudah memisahkan uang belanja dapur dengan kas modal usaha dagang. Dilengkapi contoh buku kas harian dan strategi penetapan harga jual.',
   '978-623-7182-03-9', 2025, 'Literasi Usaha Desa', '{Buku Kas,Warung Sembako,Modal Usaha}', 15, 11, true, true, false),
  ('Sukses Beternak Kambing Gibas & Etawa Sistem Modern Mandiri Pakan', 'Drh. Bambang Triyono', 'Pertanian',
   'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=80',
   'PDF', 'Lisensi Terbatas', 186, '3.1 MB',
   'Kunci efisiensi peternakan kambing adalah fermentasi silase hijauan dan pembuatan konsentrat mandiri. Menjelaskan desain kandang panggung bersih dan manajemen reproduksi indukan.',
   '978-602-9912-77-1', 2024, 'AgriDesa Press', '{Kambing,Silase Pakan,Peternakan}', 6, 2, false, true, true),
  ('Ensiklopedia Cilik: Rahasia Alam Semesta & Sains Menakjubkan', 'Tim Sains Sahabat Belajar', 'Edukasi',
   'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
   'PDF', 'Akses Terbuka', 96, '4.5 MB',
   'Buku sains bergambar penuh warna untuk anak sekolah dasar. Menjelaskan siklus air, pelangi, metamorfosis kupu-kupu, hingga tata surya dengan eksperimen rumah sederhana.',
   '978-602-1294-81-0', 2025, 'Balai Pustaka Ramah Anak', '{Sains Anak,Eksperimen,Sekolah Dasar}', 20, 16, true, false, true),
  ('Kumpulan Cerita Rakyat & Kearifan Lokal Nusantara untuk Generasi Muda', 'Ki Anom Suwito & Lembaga Adat Desa', 'Budaya Desa',
   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
   'EPUB', 'Akses Terbuka', 130, '740 KB',
   'Antologi cerita lisan kakek nenek moyang, dongeng fabel satwa bijak, tradisi gotong royong sambatan, dan pitutur luhur yang mengajarkan sopan santun.',
   '978-623-8801-44-2', 2023, 'Pustaka Tradisi Desa', '{Cerita Rakyat,Kearifan Lokal}', 10, 9, false, false, false),
  ('Lentera di Balik Bukit Kapur: Novel Perjuangan Guru Pengabdi', 'Ahmad Fauzi & Nurlaila', 'Fiksi & Populer',
   'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
   'EPUB', 'Lisensi Terbatas', 240, '980 KB',
   'Kisah menyentuh tentang sarjana muda yang memilih pulang kampung mendirikan rumah baca, melawan keputusasaan, dan membangkitkan harapan anak-anak buruh tani.',
   '978-602-0331-50-6', 2024, 'Bentang Kata Semesta', '{Novel Inspiratif,Pendidikan Desa}', 8, 3, true, true, false),
  ('Strategi Pemasaran Digital & Foto Produk Pakai HP untuk Pengrajin Desa', 'Fajar Nugraha, S.Kom', 'UMKM',
   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
   'PDF', 'Akses Terbuka', 124, '3.2 MB',
   'Solusi memasarkan anyaman bambu, batik lurik, dan kopi lokal ke luar kota lewat WhatsApp Bisnis dan toko online cukup dengan ponsel pintar.',
   '978-623-0199-22-8', 2025, 'Desa Digital Madani', '{Foto Produk HP,WhatsApp Bisnis}', 14, 10, false, false, true),
  ('Teknik Budidaya Ikan Nila & Lele Bioflok Hemat Air untuk Kolam Rumahan', 'Ir. Hendra Saputra', 'Pertanian',
   'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&auto=format&fit=crop&q=80',
   'PDF', 'Lisensi Terbatas', 140, '2.8 MB',
   'Panduan lengkap budidaya ikan air tawar hemat air dengan sistem bioflok, cocok untuk pekarangan kering dan padat tebar tinggi.',
   '978-602-7721-39-5', 2024, 'Pustaka Bahari Tani', '{Perikanan,Nila Bioflok}', 7, 4, false, false, false),
  ('Budidaya Bandeng & Udang Vaname Pesisir Sidayu: Manajemen Tambak Tradisional-Modern', 'H. Abdul Ghofur & Balai Penyuluhan Pesisir Sidayu', 'Pertanian',
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
   'PDF', 'Akses Terbuka', 165, '3.4 MB',
   'Panduan komprehensif bagi petambak Desa Lasem Sidayu dalam mengelola air tambak payau, pencegahan penyakit udang berak putih, hingga siklus panen berkesinambungan.',
   '978-623-9081-12-8', 2025, 'Pustaka Pesisir Gresik', '{Tambak Bandeng,Udang Vaname,Lasem Sidayu}', 14, 10, true, true, true),
  ('Sejarah Peradaban Kadipaten Sidayu, Jejak Santri & Kearifan Pesisir Gresik', 'Drs. H. M. Zainuri, M.Hum & Lembaga Sejarah Sidayu', 'Budaya Desa',
   'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
   'EPUB', 'Akses Terbuka', 210, '1.2 MB',
   'Menelusuri sejarah kebesaran Kadipaten Sidayu, peran para ulama dan santri dalam perjuangan kemerdekaan, serta nilai-nilai tradisi keagamaan yang luhur.',
   '978-602-5431-88-3', 2024, 'Pustaka Santri Sedayu', '{Sejarah Sidayu,Pesantren}', 10, 8, true, true, false)
on conflict do nothing;

-- Seed: agenda awal
insert into public.announcements (title, category, summary, author, badge, event_date)
values
  ('Musyawarah Literasi Desa Lasem: Alokasi Dana Desa 2027 untuk Ruang Baca Anak', 'Pemerintahan Desa',
   'Pemerintah Desa Lasem Sidayu bersama BPD mengundang warga dalam pemaparan program pojok baca digital serta pengadaan 250 buku budidaya tambak & pelajaran sekolah.',
   'Pemerintah Desa Lasem & BPD', 'Penting', '2026-09-24'),
  ('Kelas Bedah Buku: Sukses Tambak Bandeng & Udang Bersama Dinas Perikanan', 'Pelatihan Warga',
   'Diadakan di Aula Balai Desa Lasem Sidayu pukul 09.00 WIB. Gratis untuk seluruh petambak dan warga. Disediakan modul PDF dan e-sertifikat.',
   'Pengurus Perpusdes Lasem & PPL Perikanan', 'Agenda', '2026-09-20'),
  ('Layanan Pinjam Buku Khusus Lansia & Santri Pondok di Lasem Sidayu', 'Layanan Desa',
   'Relawan perpustakaan desa membuka layanan pengantaran buku bacaan ke rumah warga lanjut usia dan pondok pesantren setiap akhir pekan.',
   'Relawan Literasi Lasem Sidayu', 'Layanan', null)
on conflict do nothing;

-- ============================================================
-- SEED: AKUN SUPERADMIN
-- 1. Daftar user di Supabase Dashboard (Authentication > Users)
--    dengan email admin Anda.
-- 2. Jalankan query berikut, ganti email-nya:
-- ============================================================
-- update public.profiles set role = 'superadmin' where email = 'admin@lasemsidayu.id';
