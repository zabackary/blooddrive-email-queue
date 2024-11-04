import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(
      null,
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
  if (req.method !== "POST") {
    return new Response("must use POST", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const params = await req.json();
  const instanceId = params["instanceId"];
  if (!instanceId) {
    return new Response(
      JSON.stringify({ ok: false, msg: "need instanceId in json body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const { error } = await supabase.from("instance").update({
    paid_is_unlocked: true,
  }).eq("id", instanceId).single();
  if (error) {
    return new Response(
      JSON.stringify({ ok: false, msg: "db error", error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
