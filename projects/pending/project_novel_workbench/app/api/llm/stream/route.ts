const BASE_URL = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export async function POST(req: Request) {
  const { task } = await req.json();
  const upstream = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: MODEL, stream: true, messages: [{ role: "user", content: task }] })
  });

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return controller.close();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const payload = line.replace("data: ", "").trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(new TextEncoder().encode(delta));
          } catch {}
        }
      }
      controller.close();
    }
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
