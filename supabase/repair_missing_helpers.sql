-- Jalankan ini jika schema.sql sebelumnya berhenti pada error is_admin().
-- Setelah itu jalankan ulang schema.sql dari awal.
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

create or replace function public.is_member_active()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and aktif);
$$;
