import { hashPrompt } from "./hash";

function getBaseUrl() {
  return process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
}

function getModel() {
  return process.env.DEEPSEEK_MODEL || "deepseek-chat";
}

function getApiKey() {
  return process.env.DEEPSEEK_API_KEY;
}

export async function callDeepSeekJson(params: {
  system: string;
  user: string;
  temperature?: number;
}) {
  const apiKey = getApiKey();
  const model = getModel();
  const promptHash = hashPrompt(`${params.system}\n${params.user}`);

  if (!apiKey) {
    return {
      ok: true,
      model,
      promptHash,
      text: "{\"mock\":true,\"note\":\"DEEPSEEK_API_KEY not set\"}"
    };
  }

  const resp = await fetch(`${getBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: params.temperature ?? 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user }
      ]
    })
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      ok: false,
      model,
      promptHash,
      text: JSON.stringify(data)
    };
  }

  return {
    ok: true,
    model,
    promptHash,
    text: data?.choices?.[0]?.message?.content ?? "{}"
  };
}

export async function callDeepSeekText(params: {
  system: string;
  user: string;
  temperature?: number;
}) {
  const apiKey = getApiKey();
  const model = getModel();
  const promptHash = hashPrompt(`${params.system}\n${params.user}`);

  if (!apiKey) {
    return {
      ok: true,
      model,
      promptHash,
      text: "[mock draft] 未設定 DEEPSEEK_API_KEY，這是本機示範文本。"
    };
  }

  const resp = await fetch(`${getBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: params.temperature ?? 0.85,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user }
      ]
    })
  });

  const data = await resp.json();

  return {
    ok: resp.ok,
    model,
    promptHash,
    text: data?.choices?.[0]?.message?.content ?? ""
  };
}
