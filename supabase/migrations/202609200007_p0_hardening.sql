-- P0 hardening: published content, borrowing integrity, and catalog validation.
begin;

drop policy if exists announcements_read on public.announcements;
create policy announcements_read
on public.announcements
for select
using (published = true or public.is_admin());

revoke insert, update, delete on public.borrowings from anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.books'::regclass
      and conname = 'books_stock_nonnegative'
  ) then
    alter table public.books
      add constraint books_stock_nonnegative
      check (total_copies >= 0 and available_copies >= 0 and available_copies <= total_copies) not valid;
  end if;
end $$;

alter table public.books validate constraint books_stock_nonnegative;

create or replace function public.handle_borrow_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.status in ('active', 'extended', 'overdue') then
    update public.books
    set available_copies = available_copies - 1,
        updated_at = now()
    where id = new.book_id and available_copies > 0;

    if not found then
      raise exception 'Stok buku habis';
    end if;
  elsif tg_op = 'UPDATE' and old.status <> 'returned' and new.status = 'returned' then
    update public.books
    set available_copies = least(total_copies, available_copies + 1),
        updated_at = now()
    where id = old.book_id;
    new.returned_at = coalesce(new.returned_at, now());
  end if;

  return new;
end;
$$;

create or replace function public.import_catalog(p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  row_data jsonb;
  row_count integer := 0;
  isbn_value text;
  total_copies_value integer;
  available_copies_value integer;
begin
  if not public.is_superadmin() then
    raise exception 'Hanya superadmin boleh impor masal';
  end if;

  if jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) not between 1 and 1000 then
    raise exception 'Jumlah baris tidak valid';
  end if;

  for row_data in select value from jsonb_array_elements(p_rows) loop
    if jsonb_typeof(row_data) <> 'object'
      or coalesce(trim(row_data->>'title'), '') = ''
      or coalesce(trim(row_data->>'author'), '') = '' then
      raise exception 'Setiap baris harus memiliki judul dan penulis';
    end if;

    if coalesce(row_data->>'total_copies', '') !~ '^-?\d+$'
      or coalesce(row_data->>'available_copies', '') !~ '^-?\d+$' then
      raise exception 'Stok harus berupa bilangan bulat';
    end if;

    total_copies_value := (row_data->>'total_copies')::integer;
    available_copies_value := (row_data->>'available_copies')::integer;
    if total_copies_value < 0
      or available_copies_value < 0
      or available_copies_value > total_copies_value then
      raise exception 'Stok tidak valid';
    end if;

    isbn_value := nullif(trim(row_data->>'isbn'), '');
    update public.books
    set title = trim(row_data->>'title'),
        author = trim(row_data->>'author'),
        category = coalesce(nullif(row_data->>'category', ''), 'Edukasi'),
        format = coalesce(nullif(row_data->>'format', ''), 'PDF'),
        access_type = coalesce(nullif(row_data->>'access_type', ''), 'Akses Terbuka'),
        pages = coalesce(nullif(row_data->>'pages', '')::integer, 0),
        file_size = coalesce(row_data->>'file_size', '-'),
        description = coalesce(row_data->>'description', ''),
        year = coalesce(nullif(row_data->>'year', '')::integer, extract(year from current_date)::integer),
        publisher = coalesce(row_data->>'publisher', 'Perpustakaan Lasem Sidayu'),
        cover_image = nullif(row_data->>'cover_image', ''),
        file_url = nullif(row_data->>'file_url', ''),
        tags = array(select jsonb_array_elements_text(coalesce(row_data->'tags', '[]'::jsonb))),
        total_copies = total_copies_value,
        available_copies = available_copies_value,
        is_featured = coalesce((row_data->>'is_featured')::boolean, false),
        is_popular = coalesce((row_data->>'is_popular')::boolean, false),
        is_new = coalesce((row_data->>'is_new')::boolean, true),
        updated_at = now()
    where isbn = isbn_value and isbn_value is not null;

    if not found then
      insert into public.books (
        title, author, category, format, access_type, pages, file_size,
        description, isbn, year, publisher, cover_image, file_url, tags,
        total_copies, available_copies, is_featured, is_popular, is_new
      ) values (
        trim(row_data->>'title'), trim(row_data->>'author'),
        coalesce(nullif(row_data->>'category', ''), 'Edukasi'),
        coalesce(nullif(row_data->>'format', ''), 'PDF'),
        coalesce(nullif(row_data->>'access_type', ''), 'Akses Terbuka'),
        coalesce(nullif(row_data->>'pages', '')::integer, 0),
        coalesce(row_data->>'file_size', '-'), coalesce(row_data->>'description', ''),
        isbn_value, coalesce(nullif(row_data->>'year', '')::integer, extract(year from current_date)::integer),
        coalesce(row_data->>'publisher', 'Perpustakaan Lasem Sidayu'),
        nullif(row_data->>'cover_image', ''), nullif(row_data->>'file_url', ''),
        array(select jsonb_array_elements_text(coalesce(row_data->'tags', '[]'::jsonb))),
        total_copies_value, available_copies_value,
        coalesce((row_data->>'is_featured')::boolean, false),
        coalesce((row_data->>'is_popular')::boolean, false),
        coalesce((row_data->>'is_new')::boolean, true)
      );
    end if;
    row_count := row_count + 1;
  end loop;

  return row_count;
end;
$$;

revoke all on function public.import_catalog(jsonb) from public, anon;
grant execute on function public.import_catalog(jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;
