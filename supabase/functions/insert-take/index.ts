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
  const processedUrl = params.get("processedUrl") ?? null;
  const rawUrls = params.get("rawUrls")?.split(",");
  if (!rawUrls) return new Response("need rawUrls parameter", { status: 400 });
  const templateId = params.get("templateId") ?? null;
  const instanceId = params.get("instanceId");
  if (!instanceId) {
    return new Response("need instanceId parameter", { status: 400 });
  }

  const update = await supabase.from("take").insert({
    processed_url: processedUrl,
    raw_urls: rawUrls,
    template: templateId,
    instance: instanceId,
  }).select("id").single();

  if (update.error) {
    return new Response(JSON.stringify(update.error), { status: 400 });
  }

  return new Response(
    JSON.stringify({
      ...update.data,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
