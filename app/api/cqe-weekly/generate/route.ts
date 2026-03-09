import { cqeWeeklyAiSchema } from "@/lib/schemas";
import { buildTemplateCatalogText, getTemplateById } from "@/lib/cqeWeeklyTemplates";

const BASE_URL = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input || typeof input !== "string") {
    return Response.json({ error: "input is required" }, { status: 400 });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json(
      { error: "DEEPSEEK_API_KEY is not configured for CQE weekly generation." },
      { status: 503 }
    );
  }

  const systemPrompt = [
    "You are an expert CQE weekly report assistant.",
    "Your job is to convert messy engineer notes, customer messages, meeting notes, or complaint descriptions into one selected reporting template and structured field values.",
    "Choose the single best templateId from the catalog below.",
    "Return strict JSON only.",
    "Do not invent precise facts when missing. Use an empty string for unknown values.",
    "Prefer concise engineering wording suitable for a weekly summary.",
    "Template catalog:",
    buildTemplateCatalogText(),
    'Required JSON shape: {"templateId":"...","values":{"fieldKey":"value"},"confidence":0.0,"notes":["short note"]}'
  ].join("\n\n");

  const upstream = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      temperature: 0.1,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ]
    })
  });

  if (!upstream.ok) {
    const message = await upstream.text();
    return Response.json(
      { error: `Upstream AI request failed: ${message || upstream.statusText}` },
      { status: 502 }
    );
  }

  const data = await upstream.json();
  const text = data?.choices?.[0]?.message?.content ?? "{}";
  const parsed = cqeWeeklyAiSchema.parse(JSON.parse(text));
  const template = getTemplateById(parsed.templateId);
  const allowedKeys = new Set(template.fields.map((field) => field.key));
  const values = Object.fromEntries(
    Object.entries(parsed.values).filter(([key]) => allowedKeys.has(key))
  );

  return Response.json({
    templateId: template.id,
    values,
    confidence: parsed.confidence,
    notes: parsed.notes
  });
}
