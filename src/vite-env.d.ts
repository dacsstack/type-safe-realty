/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PHOTO_URL: string;
  readonly VITE_UPLOADS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
