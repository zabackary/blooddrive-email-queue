import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("add-queue has started serving with Deno");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
  if (req.method !== "POST") {
    return new Response("must use POST", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const params = await req.json();
  const email = params["email"];
  const instanceId = Number(params["instanceId"]);
  const japanese = params["japanese"];
  if (!email) return new Response("need email parameter", { status: 400 });
  if (!instanceId)
    return new Response("need instanceId parameter", { status: 400 });
  if (japanese === undefined)
    return new Response("need japanese parameter", { status: 400 });

  const { data, error } = await supabase
    .from("instance")
    .select("current_ticket_number")
    .eq("id", instanceId)
    .single();
  if (error) {
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
  const { error: updateError } = await supabase
    .from("instance")
    .update({
      current_ticket_number: data.current_ticket_number + 1,
    })
    .eq("id", instanceId)
    .single();
  if (updateError) {
    return new Response(JSON.stringify(updateError), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const update = await supabase.from("queue_item").insert({
    serial_num: data.current_ticket_number + 1,
    email,
    instance: instanceId,
    japanese,
  });

  if (update.error) {
    return new Response(JSON.stringify(update.error), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  return new Response(
    JSON.stringify({
      ...update,
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
});
