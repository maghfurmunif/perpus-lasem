begin;
alter table public.announcements add column if not exists content_type text not null default 'artikel';
alter table public.announcements add column if not exists published boolean not null default false;
alter table public.announcements add column if not exists published_at timestamptz;
update public.announcements set content_type='artikel' where content_type is null or content_type in ('berita','warta');
notify pgrst, 'reload schema';
commit;
