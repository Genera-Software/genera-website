import "server-only";

/**
 * A minimal client for any OpenAI-compatible Chat Completions endpoint.
 *
 * Nearly every provider speaks this dialect, so switching model is an env var
 * change rather than a code change:
 *
 *   OpenAI      https://api.openai.com/v1                                (default)
 *   Anthropic   https://api.anthropic.com/v1
 *   Gemini      https://generativelanguage.googleapis.com/v1beta/openai
 *   OpenRouter  https://openrouter.ai/api/v1
 *   Ollama      http://localhost:11434/v1
 */

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export type ChatMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

export type ToolSpec = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

const DEFAULT_BASE_URL = "https://api.openai.com/v1";

/** One model turn has to fit inside a serverless request, with room to save. */
const REQUEST_TIMEOUT_MS = 25_000;

export function isLlmConfigured(): boolean {
  return Boolean(
    process.env.SUPPORT_LLM_API_KEY && process.env.SUPPORT_LLM_MODEL,
  );
}

export async function chat(
  messages: ChatMessage[],
  tools: ToolSpec[],
  { forceAnswer = false }: { forceAnswer?: boolean } = {},
): Promise<Extract<ChatMessage, { role: "assistant" }>> {
  const apiKey = process.env.SUPPORT_LLM_API_KEY;
  const model = process.env.SUPPORT_LLM_MODEL;
  if (!apiKey || !model) {
    throw new Error("SUPPORT_LLM_API_KEY and SUPPORT_LLM_MODEL must be set.");
  }
  const baseUrl = (process.env.SUPPORT_LLM_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/+$/,
    "",
  );

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      // OpenAI's reasoning models reject `max_tokens`; most other providers
      // only understand it. Reasoning also spends from this budget.
      ...(new URL(baseUrl).hostname === "api.openai.com"
        ? { max_completion_tokens: 16000 }
        : { max_tokens: 4000 }),
      // Tools stay declared even when forcing an answer: some providers reject
      // a transcript containing tool calls if the request declares no tools.
      ...(tools.length
        ? { tools, tool_choice: forceAnswer ? "none" : "auto" }
        : {}),
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: {
      message?: { content?: string | null; tool_calls?: ToolCall[] };
    }[];
  };
  const message = data.choices?.[0]?.message;
  if (!message) throw new Error("LLM returned no message.");

  return {
    role: "assistant",
    content: message.content ?? null,
    ...(message.tool_calls?.length ? { tool_calls: message.tool_calls } : {}),
  };
}
