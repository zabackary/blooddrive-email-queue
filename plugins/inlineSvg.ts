/* eslint-disable import/no-extraneous-dependencies */
import _generate from "@babel/generator";
import templateBuilder from "@babel/template";
import * as t from "@babel/types";
import { readFile } from "node:fs/promises";
import { PluginOption } from "vite";

// @ts-expect-error See https://github.com/babel/babel/issues/13855
const generate: typeof _generate = _generate.default;

export default function inlineSvg(): PluginOption {
  const buildExport = templateBuilder.statement(`
    export default %%source%%;
  `);
  return {
    name: "inline-svg",
    apply: "build",
    async transform(code, id) {
      if (id.endsWith(".svg")) {
        const content = await readFile(id, "utf8");
        const ast = buildExport({
          source: t.stringLiteral(
            `data:image/svg+xml,${encodeURIComponent(content)}`
          ),
        });
        return generate(ast).code;
      }
      return code;
    },
    generateBundle(_, bundle) {
      for (const key in bundle) {
        if (key.endsWith(".svg")) {
          // eslint-disable-next-line no-param-reassign
          delete bundle[key];
        }
      }
    },
  };
}
