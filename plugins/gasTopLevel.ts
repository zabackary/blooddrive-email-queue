/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import _generate from "@babel/generator";
import { parse, ParserOptions } from "@babel/parser";
import _traverse from "@babel/traverse";
import * as t from "@babel/types";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PluginOption, ResolvedConfig } from "vite";

// @ts-expect-error See https://github.com/babel/babel/issues/13855
const traverse: typeof _traverse = _traverse.default;

// @ts-expect-error See https://github.com/babel/babel/issues/13855
const generate: typeof _generate = _generate.default;

export interface GasTopLevelOptions {
  entry: RegExp;
  distEntry: RegExp;
  sideEffect: string;
  parserOptions: ParserOptions;
}

export default function gasTopLevel(
  userOptions: Partial<GasTopLevelOptions>
): PluginOption {
  const options: GasTopLevelOptions = {
    entry: /.^/,
    distEntry: /.^/,
    parserOptions: {},
    sideEffect: "",
    ...userOptions,
  };
  let banner = "";
  let used = false;
  let viteConfig: ResolvedConfig | undefined;
  return {
    name: "gas-top-level",
    apply: "build",
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    async writeBundle(_options, bundle) {
      if (!viteConfig) throw new Error("Config not resolved!");
      // From https://github.com/chengpeiquan/vite-plugin-banner/blob/main/src/main.ts
      for (const file of Object.entries(bundle)) {
        const { root } = viteConfig;
        const outDir = viteConfig.build.outDir || "dist";
        const filePath: string = resolve(root, outDir, file[0]);

        if (options.distEntry.test(file[0])) {
          const sideEffectContent = options.sideEffect
            ? `(function(){${options.sideEffect}})();`
            : "";
          const content = (
            await readFile(filePath, {
              encoding: "utf8",
            })
          ).trimEnd();
          await writeFile(
            filePath,
            `${banner}${sideEffectContent}(function(){${content}})();\n`
          );
        }
      }
    },
    transform(source, id) {
      if (options.entry.test(id)) {
        if (used) {
          console.warn(
            `Only one entry is allowed per gas-top-level invocation. ` +
              `Create another plugin instance. Ignoring: ${id}`
          );
          return source;
        }
        used = true;
        const ast = parse(source, {
          ...options.parserOptions,
          sourceType: "unambiguous",
        });
        traverse(ast, {
          AssignmentExpression({ node }) {
            if (
              node.left.type === "MemberExpression" &&
              node.left.object.type === "Identifier" &&
              node.left.object.name === "topLevelFunction" &&
              node.left.property.type === "Identifier"
            ) {
              node.left.object = t.identifier("globalThis");
              banner += `function ${node.left.property.name}(){}`;
            }
          },
        });
        return generate(ast);
      }
      return source;
    },
  };
}
