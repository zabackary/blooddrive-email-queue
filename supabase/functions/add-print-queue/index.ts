import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("add-print-queue has started serving with Deno");

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("must use POST", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const params = new URL(req.url).searchParams;
  const id = params.get("takeId");
  if (!id) return new Response("need takeId parameter", { status: 400 });

  const update = await supabase.from("print_queue_item").insert({
    take: id,
  });

  if (update.error) {
    return new Response(JSON.stringify(update.error), { status: 400 });
  }

  return new Response(
    JSON.stringify({
      ...update,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
