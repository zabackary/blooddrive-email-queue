import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("drive-proxy has started serving with Deno");

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const qUrl = url.searchParams.get("q");
  if (!qUrl) {
    return new Response("no url provided (q)", { status: 400 });
  }
  if (!qUrl.startsWith("https://drive.google.com")) {
    return new Response("url is not google drive (https://drive.google.com)", {
      status: 400,
    });
  }

  const response = await fetch(qUrl);

  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers.entries(),
      ...corsHeaders,
    },
  });
});
