-- Apply after schema.sql and earlier migrations. Transactional; never deletes library data.
begin;
alter table public.books add column if not exists file_url text;
alter table public.books add column if not exists is_published boolean not null default true;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and aktif and role in ('superadmin','admin','pustakawan','kepala_desa')); $$;
create or replace function public.is_superadmin() returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and aktif and role='superadmin'); $$;
create or replace function public.is_member_active() returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and aktif); $$;

-- Remove ALL old permissive policies on this application's tables so OR-combined policies cannot bypass new rules.
do $$ declare p record; begin
 for p in select tablename,policyname from pg_policies where schemaname='public'
 and tablename in ('profiles','books','borrowings','reviews','announcements','book_requests','forum_posts')
 loop execute format('drop policy %I on public.%I',p.policyname,p.tablename); end loop;
end $$;
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.borrowings enable row level security;
alter table public.reviews enable row level security;
alter table public.announcements enable row level security;
alter table public.book_requests enable row level security;
alter table public.forum_posts enable row level security;

revoke all on public.profiles,public.books,public.borrowings,public.reviews,public.announcements,public.book_requests,public.forum_posts from anon,authenticated;
-- Role/active/email are deliberately not client-writable, including by admins.
grant select on public.profiles to authenticated;
grant update(nama_lengkap,nomor_wa,alamat) on public.profiles to authenticated;
create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
create policy profiles_edit on public.profiles for update to authenticated using(id=auth.uid() and public.is_member_active()) with check(id=auth.uid() and public.is_member_active());

grant select on public.books,public.announcements,public.reviews to anon,authenticated;
grant insert,update,delete on public.books,public.announcements to authenticated;
create policy books_read on public.books for select using(is_published or public.is_admin());
create policy books_write on public.books for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy announcements_read on public.announcements for select using(true);
create policy announcements_write on public.announcements for all to authenticated using(public.is_admin()) with check(public.is_admin());
grant insert,delete on public.reviews to authenticated;
create policy reviews_read on public.reviews for select using(true);
create policy reviews_insert on public.reviews for insert to authenticated with check(user_id=auth.uid() and public.is_member_active());
create policy reviews_delete on public.reviews for delete to authenticated using(public.is_admin() or (user_id=auth.uid() and public.is_member_active()));

grant select,insert,update on public.book_requests to authenticated;
alter table public.book_requests alter column requester_id set default auth.uid();
create policy requests_read on public.book_requests for select to authenticated using(public.is_admin() or (requester_id=auth.uid() and public.is_member_active()));
create policy requests_insert on public.book_requests for insert to authenticated with check(requester_id=auth.uid() and public.is_member_active() and status='pending' and notes is null and budget_estimated is null);
create policy requests_update on public.book_requests for update to authenticated using(public.is_admin()) with check(public.is_admin());
grant select on public.forum_posts to anon,authenticated;
grant insert,delete on public.forum_posts to authenticated;
create policy forum_read on public.forum_posts for select to anon,authenticated using(true);
create policy forum_insert on public.forum_posts for insert to authenticated with check(user_id=auth.uid() and public.is_member_active() and likes=0);
create policy forum_delete on public.forum_posts for delete to authenticated using(public.is_admin() or (user_id=auth.uid() and public.is_member_active()));

-- Borrower cannot change borrower_id, book_id, due_date or invent returned stock.
grant select on public.borrowings to authenticated;
create policy loans_read on public.borrowings for select to authenticated using(public.is_admin() or (borrower_id=auth.uid() and public.is_member_active()));
drop trigger if exists on_borrow_stock on public.borrowings;
create or replace function public.handle_borrow_stock() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if tg_op='INSERT' and new.status in ('active','extended','overdue') then
   update public.books set available_copies=available_copies-1 where id=new.book_id and available_copies>0;
   if not found then raise exception 'Stok buku habis'; end if;
 elsif tg_op='UPDATE' and old.status <> 'returned' and new.status='returned' then
   update public.books set available_copies=least(total_copies,available_copies+1) where id=old.book_id;
   new.returned_at=now();
 end if;
 return new;
end $$;
create trigger on_borrow_stock before insert or update on public.borrowings for each row execute function public.handle_borrow_stock();

create or replace function public.borrow_book(p_book_id uuid) returns uuid language plpgsql security definer set search_path=public as $$
declare result uuid; begin
 if not public.is_member_active() then raise exception 'Akun tidak aktif'; end if;
 -- Serialize requests by borrower; the stock update also locks the book row.
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if (select count(*) from public.borrowings where borrower_id=auth.uid() and status<>'returned')>=3 then raise exception 'Maksimal tiga pinjaman aktif'; end if;
 if exists(select 1 from public.borrowings where borrower_id=auth.uid() and book_id=p_book_id and status<>'returned') then raise exception 'Buku sudah dipinjam'; end if;
 if not exists(select 1 from public.books where id=p_book_id and is_published) then raise exception 'Buku tidak tersedia'; end if;
 insert into public.borrowings(book_id,borrower_id,due_date,status) values(p_book_id,auth.uid(),current_date+14,'active') returning id into result;
 return result;
end $$;
create or replace function public.extend_loan(p_loan_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare loan public.borrowings; begin
 if not public.is_member_active() then raise exception 'Akun tidak aktif'; end if;
 select * into loan from public.borrowings where id=p_loan_id for update;
 if not found or (loan.borrower_id<>auth.uid() and not public.is_admin()) then raise exception 'Akses ditolak'; end if;
 if loan.extended or loan.status<>'active' or loan.due_date<current_date then raise exception 'Pinjaman tidak dapat diperpanjang'; end if;
 update public.borrowings set extended=true,status='extended',due_date=loan.due_date+7 where id=p_loan_id;
end $$;
create or replace function public.return_loan(p_loan_id uuid) returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.is_admin() then raise exception 'Pengembalian harus dikonfirmasi pustakawan'; end if;
 update public.borrowings set status='returned' where id=p_loan_id and status<>'returned';
 if not found then raise exception 'Pinjaman sudah kembali atau tidak ditemukan'; end if;
end $$;

-- Partial ISBN index from old migration cannot satisfy ON CONFLICT(isbn).
-- NULL ISBNs are permitted; duplicate non-empty ISBNs abort rather than deleting data.
create unique index if not exists books_isbn_full_unique on public.books(isbn);
create or replace function public.import_catalog(p_rows jsonb) returns integer language plpgsql security definer set search_path=public as $$
declare r jsonb; n integer := 0; begin
 if not public.is_superadmin() then raise exception 'Hanya superadmin boleh impor masal'; end if;
 if jsonb_typeof(p_rows)<>'array' or jsonb_array_length(p_rows) not between 1 and 1000 then raise exception 'Jumlah baris tidak valid'; end if;
 for r in select * from jsonb_array_elements(p_rows) loop
   if coalesce(trim(r->>'title'),'')='' or coalesce(trim(r->>'author'),'')='' then raise exception 'Judul dan penulis wajib'; end if;
   if (r->>'total_copies')::int<0 or (r->>'available_copies')::int<0 or (r->>'available_copies')::int>(r->>'total_copies')::int then raise exception 'Stok tidak valid'; end if;
   insert into public.books(title,author,category,format,access_type,pages,file_size,description,isbn,year,publisher,cover_image,file_url,tags,total_copies,available_copies,is_featured,is_popular,is_new)
   values(r->>'title',r->>'author',r->>'category',r->>'format',r->>'access_type',(r->>'pages')::int,r->>'file_size',r->>'description',nullif(r->>'isbn',''),(r->>'year')::int,r->>'publisher',r->>'cover_image',nullif(r->>'file_url',''),array(select jsonb_array_elements_text(r->'tags')),(r->>'total_copies')::int,(r->>'available_copies')::int,(r->>'is_featured')::boolean,(r->>'is_popular')::boolean,(r->>'is_new')::boolean)
   on conflict(isbn) where isbn is not null do update set title=excluded.title,author=excluded.author,category=excluded.category,format=excluded.format,access_type=excluded.access_type,pages=excluded.pages,file_size=excluded.file_size,description=excluded.description,year=excluded.year,publisher=excluded.publisher,cover_image=excluded.cover_image,file_url=excluded.file_url,tags=excluded.tags,total_copies=excluded.total_copies,available_copies=excluded.available_copies,is_featured=excluded.is_featured,is_popular=excluded.is_popular,is_new=excluded.is_new;
   n=n+1;
 end loop;
 return n;
end $$;
-- Prevent clients from calling the old elevation RPC. Admin creation uses the server function below.
revoke execute on function public.create_admin_profile(uuid,text,text,text,text) from public,anon,authenticated;
revoke all on function public.borrow_book(uuid),public.extend_loan(uuid),public.return_loan(uuid),public.import_catalog(jsonb) from public,anon;
grant execute on function public.borrow_book(uuid),public.extend_loan(uuid),public.return_loan(uuid),public.import_catalog(jsonb) to authenticated;
alter view public.library_stats set(security_invoker=true);
alter view public.popular_books set(security_invoker=true);
alter view public.published_books set(security_invoker=true);
revoke all on public.library_stats from anon;
grant select on public.library_stats to authenticated;
commit;
