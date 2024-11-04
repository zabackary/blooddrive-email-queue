/* eslint-disable import/no-extraneous-dependencies */
import { inline } from "@css-inline/css-inline";
import react from "@vitejs/plugin-react";
import { exec as nodeExec } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { defineConfig, loadEnv } from "vite";
import packageJson from "./package.json";
import gasTopLevel from "./plugins/gasTopLevel";
import inlineScript from "./plugins/inlineScript";
import inlineSvg from "./plugins/inlineSvg";

const exec = promisify(nodeExec);

const DEV_URL = new URL("http://localhost:5173");

export default defineConfig(async ({ command, mode, ssrBuild: _ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __BUILD_TIMESTAMP__: `"${new Date().toISOString()}"`,
      __VERSION__: `"${packageJson.version}"`,
      __COMMIT_HASH__: `"${
        (
          await exec("git rev-parse --short HEAD")
        ).stdout.trim()
      }"`,
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
      EMAIL_TEMPLATE: JSON.stringify(
        inline(
          await readFile("./src/server/email.html", { encoding: "utf-8" }),
        ),
      ),
    },
    envPrefix: "CLIENT_",
    server: {
      port: parseInt(DEV_URL.port, 10),
    },
    build: {
      // Relative to the root
      outDir: "dist",
      emptyOutDir: !env.VITE_SECONDPASS,
      assetsDir: "",
      rollupOptions: {
        output: {
          chunkFileNames: "[name].js",
          entryFileNames: "[name].js",
        },
        input: {
          ...(env.VITE_ONLYCLIENT ? {} : {
            server: fileURLToPath(
              new URL("./src/server/index.ts", import.meta.url),
            ),
          }),
          ...(env.VITE_ONLYSERVER ? {} : {
            client: fileURLToPath(new URL("./index.html", import.meta.url)),
          }),
        },
      },
      chunkSizeWarningLimit: Infinity,
      assetsInlineLimit: Infinity,
      // Disable minification of the server code since load times don't matter
      // and for easier debugging
      minify: !env.VITE_ONLYSERVER,
    },
    plugins: [
      react({
        include: "**/*.{jsx,tsx}",
      }),
      gasTopLevel({
        entry: /src\/server\/index.ts/,
        distEntry: /server/,
        sideEffect: "globalThis.setTimeout=(a)=>{a()};",
      }),
      inlineScript(),
      inlineSvg(),
    ],
  };
});
