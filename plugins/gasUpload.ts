/* eslint-disable import/no-extraneous-dependencies */
import { spawn } from "node:child_process";
import { PluginOption } from "vite";
import which from "which";

export default function gasUpload(): PluginOption {
  let cancel: () => void = () => {
    // noop
  };
  return {
    name: "gas-upload",
    enforce: "post",
    async writeBundle() {
      cancel();
      console.log("Uploading...");
      const pnpmProcess = spawn(await which("pnpm"), ["run", "upload"], {
        stdio: [process.stdin, "pipe", process.stderr],
        cwd: process.cwd(),
      });
      cancel = pnpmProcess.kill.bind(pnpmProcess);
      pnpmProcess.stdout.on("data", (chunk) => {
        if (String(chunk)[0] === "?") process.stdout.write(chunk);
      });
      pnpmProcess.on("close", (code) => {
        if (code !== 0) {
          console.log(`Failed to upload: process exited with code ${code}`);
        } else {
          console.log("Uploaded");
        }
      });
    },
    apply: "build",
  };
}
