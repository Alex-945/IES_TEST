import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildPrompt } from "@/lib/prompts";
import { callDeepSeekJson } from "@/lib/llm";
import { schemaMap, SchemaName } from "@/lib/json-schemas";

const inputSchema = z.object({
  schemaName: z.enum(["planning", "bible", "outline", "chapter_plan", "qa"]),
  projectId: z.string(),
  task: z.string(),
  role: z.enum(["planning", "author", "editor"]).default("planning")
});

function parseTextToJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const matched = text.match(/\{[\s\S]*\}/);
    if (!matched) throw new Error("無法解析為 JSON");
    return JSON.parse(matched[0]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = inputSchema.parse(await req.json());

    const [bible, summary] = await Promise.all([
      prisma.bibleVersion.findFirst({ where: { projectId: body.projectId }, orderBy: { version: "desc" } }),
      prisma.chapterSummary.findFirst({ where: { projectId: body.projectId }, orderBy: { createdAt: "desc" } })
    ]);

    const prompt = buildPrompt({
      role: body.role,
      context: {
        bibleSummary: JSON.stringify(bible?.json || {}),
        storySummary: summary?.summary || "",
        chapterCard: {}
      },
      task: body.task
    });

    const zodSchema = schemaMap[body.schemaName as SchemaName];

    const first = await callDeepSeekJson({ system: prompt.system, user: prompt.user, temperature: 0.5 });
    let parsed: any = null;
    let lastError: Error | null = null;

    for (let i = 0; i < 2; i++) {
      try {
        const source = i === 0 ? first.text : (await callDeepSeekJson({ system: prompt.system, user: `${prompt.user}\n\n請只輸出符合 schema 的 JSON，不要任何多餘文字。`, temperature: 0.2 })).text;
        const json = parseTextToJson(source);
        parsed = zodSchema.parse(json);
        lastError = null;
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (lastError) {
      return NextResponse.json({ error: `JSON 驗證失敗：${lastError.message}` }, { status: 422 });
    }

    return NextResponse.json({
      json: parsed,
      meta: {
        promptHash: first.promptHash,
        model: first.model,
        params: { temperature: 0.5 },
        refs: { bibleVersion: bible?.version, summaryVersion: summary?.version },
        created_at: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid request" }, { status: 400 });
  }
}
