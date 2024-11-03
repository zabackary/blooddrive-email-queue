create table "public"."available_template" (
    "instance_id" uuid not null,
    "template_id" uuid not null
);


alter table "public"."available_template" enable row level security;

CREATE UNIQUE INDEX available_template_pkey ON public.available_template USING btree (instance_id, template_id);

alter table "public"."available_template" add constraint "available_template_pkey" PRIMARY KEY using index "available_template_pkey";

alter table "public"."available_template" add constraint "available_template_instance_id_fkey" FOREIGN KEY (instance_id) REFERENCES instance(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."available_template" validate constraint "available_template_instance_id_fkey";

alter table "public"."available_template" add constraint "available_template_template_id_fkey" FOREIGN KEY (template_id) REFERENCES template(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."available_template" validate constraint "available_template_template_id_fkey";

grant delete on table "public"."available_template" to "anon";

grant insert on table "public"."available_template" to "anon";

grant references on table "public"."available_template" to "anon";

grant select on table "public"."available_template" to "anon";

grant trigger on table "public"."available_template" to "anon";

grant truncate on table "public"."available_template" to "anon";

grant update on table "public"."available_template" to "anon";

grant delete on table "public"."available_template" to "authenticated";

grant insert on table "public"."available_template" to "authenticated";

grant references on table "public"."available_template" to "authenticated";

grant select on table "public"."available_template" to "authenticated";

grant trigger on table "public"."available_template" to "authenticated";

grant truncate on table "public"."available_template" to "authenticated";

grant update on table "public"."available_template" to "authenticated";

grant delete on table "public"."available_template" to "service_role";

grant insert on table "public"."available_template" to "service_role";

grant references on table "public"."available_template" to "service_role";

grant select on table "public"."available_template" to "service_role";

grant trigger on table "public"."available_template" to "service_role";

grant truncate on table "public"."available_template" to "service_role";

grant update on table "public"."available_template" to "service_role";


