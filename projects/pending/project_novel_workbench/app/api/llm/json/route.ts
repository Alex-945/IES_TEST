import { qaSchema } from "@/lib/schemas";

const BASE_URL = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === "qa") {
    const prompt = `請對以下章節做 QA，回傳 JSON：${body.content}`;
    const resp = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } })
    });
    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = qaSchema.parse(JSON.parse(text));
    return Response.json(parsed);
  }
  return Response.json({ error: "unsupported" }, { status: 400 });
}
