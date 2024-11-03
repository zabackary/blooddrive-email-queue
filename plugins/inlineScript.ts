/* eslint-disable import/no-extraneous-dependencies */
import { unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PluginOption, ResolvedConfig } from "vite";

export default function inlineScript(): PluginOption {
  let viteConfig: ResolvedConfig | undefined;
  return {
    name: "inline-script",
    enforce: "post",
    apply: "build",
    configResolved(config) {
      viteConfig = config;
    },
    async writeBundle(_, bundle) {
      if (!viteConfig) throw new Error("Config not resolved!");
      const { root } = viteConfig;
      const outDir = viteConfig.build.outDir || "dist";
      const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"));
      const bundlesToDelete: string[] = [];
      for (const name of htmlFiles) {
        const chunk = bundle[name];
        if (!chunk) throw new Error("what has this world come to?!?");
        if (chunk.type === "asset" && typeof chunk.source === "string") {
          const filePath = resolve(root, outDir, name);
          await writeFile(
            filePath,
            chunk.source.replaceAll(
              /<script([\s\S]*?) src=["']([\s\S]*?)["']([\s\S]*?)>[\s\S]*?<\/script>/gi,
              (_, beforeSrc: string, src: string, afterSrc: string) => {
                const source = bundle[src.slice(1)];
                if (!source || source.type !== "chunk")
                  throw new Error("Cannot find script chunk");
                bundlesToDelete.push(src.slice(1));
                return `<script${beforeSrc}${afterSrc}>${source.code}</script>`;
              }
            )
          );
        }
      }
      for (const name of bundlesToDelete) {
        const filePath = resolve(root, outDir, name);
        await unlink(filePath);
      }
    },
  };
}
