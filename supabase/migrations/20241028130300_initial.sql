create table "public"."instance" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "paid_information" text,
    "paid_information_alt" text,
    "contact_name" text not null,
    "contact_email" text not null,
    "paid_is_unlocked" boolean
);


alter table "public"."instance" enable row level security;

create table "public"."print_queue_item" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "fulfilled" boolean not null default false,
    "take" uuid not null
);


alter table "public"."print_queue_item" enable row level security;

create table "public"."take" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "processed_url" text not null,
    "template" uuid,
    "instance" uuid not null
);


alter table "public"."take" enable row level security;

create table "public"."template" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "metadata" jsonb not null
);


alter table "public"."template" enable row level security;

CREATE UNIQUE INDEX instances_pkey ON public.instance USING btree (id);

CREATE UNIQUE INDEX print_queue_item_pkey ON public.print_queue_item USING btree (id);

CREATE UNIQUE INDEX take_2_pkey ON public.take USING btree (id);

CREATE UNIQUE INDEX template_pkey ON public.template USING btree (id);

alter table "public"."instance" add constraint "instances_pkey" PRIMARY KEY using index "instances_pkey";

alter table "public"."print_queue_item" add constraint "print_queue_item_pkey" PRIMARY KEY using index "print_queue_item_pkey";

alter table "public"."take" add constraint "take_2_pkey" PRIMARY KEY using index "take_2_pkey";

alter table "public"."template" add constraint "template_pkey" PRIMARY KEY using index "template_pkey";

alter table "public"."print_queue_item" add constraint "print_queue_item_take_fkey" FOREIGN KEY (take) REFERENCES take(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."print_queue_item" validate constraint "print_queue_item_take_fkey";

alter table "public"."take" add constraint "take_2_instance_fkey" FOREIGN KEY (instance) REFERENCES instance(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."take" validate constraint "take_2_instance_fkey";

alter table "public"."take" add constraint "take_2_template_fkey" FOREIGN KEY (template) REFERENCES template(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."take" validate constraint "take_2_template_fkey";

grant delete on table "public"."instance" to "anon";

grant insert on table "public"."instance" to "anon";

grant references on table "public"."instance" to "anon";

grant select on table "public"."instance" to "anon";

grant trigger on table "public"."instance" to "anon";

grant truncate on table "public"."instance" to "anon";

grant update on table "public"."instance" to "anon";

grant delete on table "public"."instance" to "authenticated";

grant insert on table "public"."instance" to "authenticated";

grant references on table "public"."instance" to "authenticated";

grant select on table "public"."instance" to "authenticated";

grant trigger on table "public"."instance" to "authenticated";

grant truncate on table "public"."instance" to "authenticated";

grant update on table "public"."instance" to "authenticated";

grant delete on table "public"."instance" to "service_role";

grant insert on table "public"."instance" to "service_role";

grant references on table "public"."instance" to "service_role";

grant select on table "public"."instance" to "service_role";

grant trigger on table "public"."instance" to "service_role";

grant truncate on table "public"."instance" to "service_role";

grant update on table "public"."instance" to "service_role";

grant delete on table "public"."print_queue_item" to "anon";

grant insert on table "public"."print_queue_item" to "anon";

grant references on table "public"."print_queue_item" to "anon";

grant select on table "public"."print_queue_item" to "anon";

grant trigger on table "public"."print_queue_item" to "anon";

grant truncate on table "public"."print_queue_item" to "anon";

grant update on table "public"."print_queue_item" to "anon";

grant delete on table "public"."print_queue_item" to "authenticated";

grant insert on table "public"."print_queue_item" to "authenticated";

grant references on table "public"."print_queue_item" to "authenticated";

grant select on table "public"."print_queue_item" to "authenticated";

grant trigger on table "public"."print_queue_item" to "authenticated";

grant truncate on table "public"."print_queue_item" to "authenticated";

grant update on table "public"."print_queue_item" to "authenticated";

grant delete on table "public"."print_queue_item" to "service_role";

grant insert on table "public"."print_queue_item" to "service_role";

grant references on table "public"."print_queue_item" to "service_role";

grant select on table "public"."print_queue_item" to "service_role";

grant trigger on table "public"."print_queue_item" to "service_role";

grant truncate on table "public"."print_queue_item" to "service_role";

grant update on table "public"."print_queue_item" to "service_role";

grant delete on table "public"."take" to "anon";

grant insert on table "public"."take" to "anon";

grant references on table "public"."take" to "anon";

grant select on table "public"."take" to "anon";

grant trigger on table "public"."take" to "anon";

grant truncate on table "public"."take" to "anon";

grant update on table "public"."take" to "anon";

grant delete on table "public"."take" to "authenticated";

grant insert on table "public"."take" to "authenticated";

grant references on table "public"."take" to "authenticated";

grant select on table "public"."take" to "authenticated";

grant trigger on table "public"."take" to "authenticated";

grant truncate on table "public"."take" to "authenticated";

grant update on table "public"."take" to "authenticated";

grant delete on table "public"."take" to "service_role";

grant insert on table "public"."take" to "service_role";

grant references on table "public"."take" to "service_role";

grant select on table "public"."take" to "service_role";

grant trigger on table "public"."take" to "service_role";

grant truncate on table "public"."take" to "service_role";

grant update on table "public"."take" to "service_role";

grant delete on table "public"."template" to "anon";

grant insert on table "public"."template" to "anon";

grant references on table "public"."template" to "anon";

grant select on table "public"."template" to "anon";

grant trigger on table "public"."template" to "anon";

grant truncate on table "public"."template" to "anon";

grant update on table "public"."template" to "anon";

grant delete on table "public"."template" to "authenticated";

grant insert on table "public"."template" to "authenticated";

grant references on table "public"."template" to "authenticated";

grant select on table "public"."template" to "authenticated";

grant trigger on table "public"."template" to "authenticated";

grant truncate on table "public"."template" to "authenticated";

grant update on table "public"."template" to "authenticated";

grant delete on table "public"."template" to "service_role";

grant insert on table "public"."template" to "service_role";

grant references on table "public"."template" to "service_role";

grant select on table "public"."template" to "service_role";

grant trigger on table "public"."template" to "service_role";

grant truncate on table "public"."template" to "service_role";

grant update on table "public"."template" to "service_role";


