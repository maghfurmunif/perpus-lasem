begin;

create index if not exists borrowings_borrower_status_idx
  on public.borrowings (borrower_id, status);
create index if not exists borrowings_book_status_idx
  on public.borrowings (book_id, status);
create index if not exists reviews_book_created_idx
  on public.reviews (book_id, created_at desc);
create index if not exists announcements_published_created_idx
  on public.announcements (published, created_at desc);
create index if not exists books_published_at_idx
  on public.books (is_published, published_at desc);
create index if not exists forum_posts_published_created_idx
  on public.forum_posts (published, created_at desc);
create index if not exists book_requests_requester_status_idx
  on public.book_requests (requester_id, status);

create or replace view public.book_rating_summary
with (security_invoker = true)
as
select
  book_id,
  round(avg(rating)::numeric, 1)::double precision as rating,
  count(*)::integer as rating_count
from public.reviews
group by book_id;

grant select on public.book_rating_summary to anon, authenticated;
notify pgrst, 'reload schema';
commit;
