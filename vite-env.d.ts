/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional URL of a server-side endpoint (e.g. a serverless function) that
   * proxies requests to an LLM provider. The API key must live server-side —
   * never in client code. If unset, the app runs entirely on the
   * deterministic fallback logic in src/lib/agent.ts.
   */
  readonly VITE_AGENT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
