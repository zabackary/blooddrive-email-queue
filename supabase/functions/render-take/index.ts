import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("render-take has started serving with Deno");

Deno.serve(async (req) => {
  const start = Date.now();
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const url = new URL(req.url);
    const templateId = url.searchParams.get("templateId");
    if (!templateId) {
      return new Response("no template provided (templateId)", { status: 400 });
    }
    let rawUrls = url.searchParams.get("rawUrl")?.split(",");
    if (!rawUrls) {
      const takeId = url.searchParams.get("takeId");
      if (!takeId) {
        return new Response("no frames provided (rawUrl/takeId)", {
          status: 400,
        });
      }
      const { data, error } = await supabase.from("take").select("raw_urls").eq(
        "id",
        takeId,
      ).single();
      if (error || !Array.isArray(data.raw_urls)) {
        return new Response(JSON.stringify(error), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        rawUrls = data.raw_urls;
      }
    }
    if (!rawUrls) throw new Error("can't happen");

    const template = await supabase.from("template").select("*").eq(
      "id",
      templateId,
    ).maybeSingle();
    if (!template.data) {
      return new Response("template doesn't exist", { status: 400 });
    }

    const metadata = template.data.metadata as {
      base: string;
      frames: {
        x: number;
        y: number;
        width: number;
        height: number;
      }[];
    };

    if (rawUrls.length !== metadata.frames.length) {
      return new Response("given frame count doesn't match template", {
        status: 400,
      });
    }

    const templateBaseImageRes = await fetch(metadata.base);
    const templateBaseImage = await templateBaseImageRes
      .bytes();
    const images = await Promise.all(
      rawUrls.map((url) => fetch(url).then((res) => res.bytes())),
    );

    const templateImg = await decode(templateBaseImage) as Image;
    const img = new Image(templateImg.width, templateImg.height);
    for (const [i, frame] of metadata.frames.entries()) {
      let frameImg = await decode(images[i]) as Image;
      frameImg = frameImg.resize(frame.width, frame.height);
      img.composite(frameImg, frame.x, frame.y);
    }
    img.composite(templateImg);
    const result = await img.encode();

    console.log(`took ${Date.now() - start}ms`);
    return new Response(
      result,
      { headers: { "Content-Type": templateBaseImageRes.type.toString() } },
    );
    // deno-lint-ignore no-explicit-any
  } catch (err: any) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 400 });
  }
});
