-- Sprint 2: hardening produksi. Jalankan setelah schema.sql dan migration_superadmin_bulk.sql.
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.books add column if not exists file_url text;
alter table public.books add column if not exists file_public_id text;
alter table public.books add column if not exists file_size_bytes bigint;
alter table public.books add column if not exists is_published boolean not null default true;

create or replace function public.set_updated_at() returns trigger
language plpgsql security definer set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at before update on public.books for each row execute function public.set_updated_at();

-- User tidak dapat mengubah role/aktif miliknya sendiri.
create or replace function public.current_profile_role() returns text
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid(); $$;
create or replace function public.current_profile_active() returns boolean
language sql stable security definer set search_path = public
as $$ select aktif from public.profiles where id = auth.uid(); $$;
drop policy if exists "profile sendiri update" on public.profiles;
create policy "profile sendiri update" on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (
  public.is_superadmin()
  or (auth.uid() = id and role = public.current_profile_role() and aktif = public.current_profile_active())
);

create or replace view public.published_books as select * from public.books where is_published = true;
grant select on public.published_books to anon, authenticated;
