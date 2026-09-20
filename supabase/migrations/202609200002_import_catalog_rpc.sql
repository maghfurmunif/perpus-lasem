-- Pastikan RPC impor katalog tersedia pada database yang sudah menjalankan
-- migration sebelumnya sebagian atau belum memuat fungsi ke schema cache.
begin;

alter table public.books add column if not exists file_url text;
create unique index if not exists books_isbn_unique on public.books (isbn) where isbn is not null;

create or replace function public.import_catalog(p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r jsonb;
  n integer := 0;
begin
  if not public.is_superadmin() then
    raise exception 'Hanya superadmin boleh impor masal';
  end if;
  if jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) not between 1 and 1000 then
    raise exception 'Jumlah baris tidak valid';
  end if;

  for r in select * from jsonb_array_elements(p_rows) loop
    if coalesce(trim(r->>'title'), '') = '' or coalesce(trim(r->>'author'), '') = '' then
      raise exception 'Judul dan penulis wajib';
    end if;
    if (r->>'available_copies')::int > (r->>'total_copies')::int then
      raise exception 'Stok tersedia melebihi total';
    end if;

    update public.books set
      title=r->>'title', author=r->>'author', category=r->>'category', format=r->>'format',
      access_type=r->>'access_type', pages=(r->>'pages')::int, file_size=r->>'file_size',
      description=r->>'description', year=(r->>'year')::int, publisher=r->>'publisher',
      cover_image=r->>'cover_image', file_url=nullif(r->>'file_url',''),
      tags=array(select jsonb_array_elements_text(coalesce(r->'tags', '[]'::jsonb))),
      total_copies=(r->>'total_copies')::int, available_copies=(r->>'available_copies')::int,
      is_featured=(r->>'is_featured')::boolean, is_popular=(r->>'is_popular')::boolean,
      is_new=(r->>'is_new')::boolean
    where isbn = nullif(r->>'isbn', '');

    if not found then
      insert into public.books (
      title, author, category, format, access_type, pages, file_size,
      description, isbn, year, publisher, cover_image, file_url, tags,
      total_copies, available_copies, is_featured, is_popular, is_new
      ) values (
      r->>'title', r->>'author', r->>'category', r->>'format', r->>'access_type',
      (r->>'pages')::int, r->>'file_size', r->>'description', nullif(r->>'isbn', ''),
      (r->>'year')::int, r->>'publisher', r->>'cover_image', nullif(r->>'file_url', ''),
      array(select jsonb_array_elements_text(coalesce(r->'tags', '[]'::jsonb))),
      (r->>'total_copies')::int, (r->>'available_copies')::int,
      (r->>'is_featured')::boolean, (r->>'is_popular')::boolean, (r->>'is_new')::boolean
      );
    end if;
    n := n + 1;
  end loop;
  return n;
end;
$$;

revoke all on function public.import_catalog(jsonb) from public, anon;
grant execute on function public.import_catalog(jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;
