import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("instance-data has started serving with Deno");

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const params = new URL(req.url).searchParams;
  const id = params.get("id");
  if (!id) return new Response("need id parameter", { status: 400 });

  const instance = await supabase.from("instance").select(
    "*, template(id, name)",
  ).eq("id", id)
    .single();

  if (instance.error) {
    return new Response(JSON.stringify(instance.error), { status: 400 });
  }

  return new Response(
    JSON.stringify({
      ...instance.data,
      template: undefined,
      templates: instance.data.template,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
