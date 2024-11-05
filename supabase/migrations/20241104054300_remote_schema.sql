alter table "public"."print_queue_item" drop column "fulfilled";

alter table "public"."take" alter column "processed_url" drop not null;

create policy "Enable read access for all users"
on "public"."print_queue_item"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."take"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."take"
as permissive
for update
to public
using (true);



