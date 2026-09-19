-- Jalankan setelah schema.sql di Supabase SQL Editor.
-- Aman diulang (idempotent) dan tidak memerlukan service_role di browser.

-- Compatibility helper: diperlukan bila migration dijalankan pada database
-- yang schema.sql-nya belum selesai.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('superadmin','admin','pustakawan','kepala_desa') and aktif); $$;

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'superadmin' and aktif); $$;

-- Jadikan akun awal superadmin berdasarkan UID dan email yang diberikan.
insert into public.profiles (id, nama_lengkap, email, role, aktif)
select id, coalesce(raw_user_meta_data->>'nama_lengkap','Nara'), email, 'superadmin', true
from auth.users where id = 'a40d78f4-1e89-4cfe-b27d-be7fab9824ba'
on conflict (id) do update set role = 'superadmin', aktif = true, email = excluded.email;

update public.profiles
set role = 'superadmin', aktif = true
where id = 'a40d78f4-1e89-4cfe-b27d-be7fab9824ba'
  and email = 'nara@naracode.id';

create or replace function public.create_admin_profile(
  p_user_id uuid, p_email text, p_nama_lengkap text, p_nomor_wa text default null, p_alamat text default null
) returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare result public.profiles;
begin
  if not public.is_superadmin() then raise exception 'Hanya superadmin yang dapat membuat akun admin'; end if;
  insert into public.profiles(id,email,nama_lengkap,nomor_wa,alamat,role,aktif)
  values(p_user_id,p_email,p_nama_lengkap,p_nomor_wa,p_alamat,'admin',true)
  on conflict(id) do update set email=excluded.email,nama_lengkap=excluded.nama_lengkap,nomor_wa=excluded.nomor_wa,alamat=excluded.alamat,role='admin',aktif=true
  returning * into result;
  return result;
end; $$;

revoke all on function public.create_admin_profile(uuid,text,text,text,text) from public;
grant execute on function public.create_admin_profile(uuid,text,text,text,text) to authenticated;

drop policy if exists "profil hanya superadmin kelola" on public.profiles;
create policy "profil hanya superadmin kelola" on public.profiles for update
using (public.is_superadmin() or auth.uid() = id)
with check (public.is_superadmin() or auth.uid() = id);

-- UPSERT bulk memakai ISBN sebagai kunci natural; ISBN wajib unik bila diisi.
create unique index if not exists books_isbn_unique on public.books(isbn) where isbn is not null and isbn <> '';

grant execute on function public.is_superadmin() to authenticated;
