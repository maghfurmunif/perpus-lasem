begin;
insert into auth.users(id,email) values('11111111-1111-4111-8111-111111111111','member@example.test'),('22222222-2222-4222-8222-222222222222','admin@example.test');
update public.profiles set role='admin' where id='22222222-2222-4222-8222-222222222222';
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 begin update public.profiles set role='superadmin' where id=auth.uid(); raise exception 'FAIL role escalation'; exception when insufficient_privilege then null; end;
 begin insert into public.books(title,author) values('Forbidden','Forbidden'); raise exception 'FAIL member insert'; exception when insufficient_privilege then null; end;
 begin perform public.import_catalog('[{}]'::jsonb); raise exception 'FAIL member import'; exception when raise_exception then if sqlerrm='FAIL member import' then raise; end if; end;
 if (select count(*) from public.profiles)<>1 then raise exception 'FAIL profile privacy'; end if;
end $$;
select public.borrow_book((select id from public.books limit 1));
do $$ declare loan uuid; begin
 select id into loan from public.borrowings where borrower_id=auth.uid() limit 1;
 perform public.extend_loan(loan);
 begin perform public.extend_loan(loan); raise exception 'FAIL second extension'; exception when raise_exception then if sqlerrm='FAIL second extension' then raise; end if; end;
 begin update public.borrowings set due_date=current_date+100 where id=loan; raise exception 'FAIL direct loan edit'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
 if exists (select 1 from public.announcements where published = false) then
   raise exception 'FAIL draft announcement visible to anon';
 end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
select public.return_loan((select id from public.borrowings limit 1));
reset role;
rollback;
select 'PASS: role escalation, profile privacy, catalog writes, bulk permissions, borrowing and extension';
