/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Keep in sync with `.env` files
  readonly CLIENT_INSTANCE_ID?: string;
  readonly CLIENT_SUPABASE_URL?: string;
  readonly CLIENT_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* eslint-disable no-underscore-dangle */
// Keep in sync with `vite.config.ts`
declare const __BUILD_TIMESTAMP__: string;
declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;
declare const APP_VERSION: string;
declare const EMAIL_TEMPLATE: string;
/* eslint-enable no-underscore-dangle */
