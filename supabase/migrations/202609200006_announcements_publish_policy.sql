begin;
grant select, insert, update, delete on public.announcements to authenticated;
drop policy if exists announcements_admin_write on public.announcements;
create policy announcements_admin_write
on public.announcements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
notify pgrst, 'reload schema';
commit;
