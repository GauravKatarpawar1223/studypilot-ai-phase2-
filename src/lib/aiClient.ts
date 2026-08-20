/**
 * Thin client for a server-side AI proxy endpoint.
 *
 * IMPORTANT: No API key is ever referenced here. This module only knows how
 * to POST a JSON payload to VITE_AGENT_ENDPOINT (a serverless function or
 * backend route that itself holds the provider key) and parse a JSON
 * response. If VITE_AGENT_ENDPOINT is not configured, or the request fails
 * or times out, this throws — callers in lib/agent.ts are expected to catch
 * that and fall back to deterministic logic so the app never breaks.
 */

const ENDPOINT = import.meta.env.VITE_AGENT_ENDPOINT;
const TIMEOUT_MS = 8000;

export interface AgentRequestPayload {
  task: 'generate_plan' | 'adapt_plan';
  [key: string]: unknown;
}

export async function callAgent<T>(payload: AgentRequestPayload): Promise<T> {
  if (!ENDPOINT) {
    throw new Error('Agent endpoint not configured (VITE_AGENT_ENDPOINT unset)');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Agent request failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
