/* eslint-disable import/no-extraneous-dependencies */
import { PluginOption } from "vite";

/**
 * Injects Axe into `client/index.tsx`.
 */
export default function reactAxe(): PluginOption {
  return {
    name: "react-axe",
    transform: (source, id) => {
      if (!/client\/index.tsx/.test(id)) return source;
      const regex =
        /^((?:import(?:[ \n\t]*(?:[^ \n\t{}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'{}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*(?:['"])(?:[^'"\n]+)(?:['"]);?\W*)*)([^]*)/.exec(
          source
        );
      if (!regex) throw new Error("Cannot find imports in file.");
      return `${regex[1]}
import ReactDOM from "react-dom/client";
import axe from "@axe-core/react";

axe(React, ReactDOM, 1000);
${regex[2]}`;
    },
    apply: "serve",
  };
}
