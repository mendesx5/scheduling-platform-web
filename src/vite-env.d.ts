/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ADVANCED_PRICING_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
