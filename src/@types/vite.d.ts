/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Keep in sync with `.env` files
  readonly CLIENT_FILE_UPLOAD_LIMIT: string;
  readonly CLIENT_IMAGE_ANY_URL: string;
  readonly CLIENT_BACKEND_MODE: string;
  readonly CLIENT_SUPABASE_URL?: string;
  readonly CLIENT_SUPABASE_ANON_KEY?: string;
  readonly CLIENT_FEEDBACK_EMAIL?: string;
  readonly CLIENT_PRIVACY_POLICY_URL?: string;
  readonly CLIENT_TOS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* eslint-disable no-underscore-dangle */
// Keep in sync with `vite.config.ts`
declare const __BUILD_TIMESTAMP__: string;
declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;
/* eslint-enable no-underscore-dangle */
