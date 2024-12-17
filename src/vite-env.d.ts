/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AIRTABLE_PAT: string
  readonly VITE_AIRTABLE_BASE_ID: string
  readonly VITE_JWT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
