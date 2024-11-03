declare const topLevelFunction: Record<string, (...args: never[]) => unknown>;

interface GlobalAppConfig {
  // Keep in sync with `vite.config.ts`
  baseURL: string;
  versionType: "dev" | "nightly" | "beta" | "stable";
  alert: string;
}

declare const APP_CONFIG: GlobalAppConfig;
