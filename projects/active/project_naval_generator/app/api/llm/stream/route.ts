import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPrompt } from "@/lib/prompts";
import { callDeepSeekText } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const projectId = String(body.projectId);
  const chapterNo = Number(body.chapterNo);

  const [bible, lastSummary, latestDraft] = await Promise.all([
    prisma.bibleVersion.findFirst({ where: { projectId }, orderBy: { version: "desc" } }),
    prisma.chapterSummary.findFirst({ where: { projectId }, orderBy: { createdAt: "desc" } }),
    prisma.chapterDraft.findFirst({ where: { projectId, chapterNo }, orderBy: { version: "desc" }, select: { version: true } })
  ]);

  const prompt = buildPrompt({
    role: "author",
    context: {
      bibleSummary: JSON.stringify(bible?.json || {}),
      storySummary: lastSummary?.summary || "",
      chapterCard: body.chapterCard || {}
    },
    task: body.task || "生成章節草稿"
  });

  const ai = await callDeepSeekText({ system: prompt.system, user: prompt.user, temperature: 0.85 });

  const text = ai.text || "";
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const chunkSize = 24;
      for (let i = 0; i < text.length; i += chunkSize) {
        const delta = text.slice(i, i + chunkSize);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "token", delta })}\n\n`));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    }
  });

  const draftVersion = (latestDraft?.version || 0) + 1;

  await prisma.chapterDraft.create({
    data: {
      projectId,
      chapterNo,
      version: draftVersion,
      text,
      params: { temperature: 0.85, streamed: true },
      promptHash: ai.promptHash,
      refs: { bibleVersion: bible?.version, summaryVersion: lastSummary?.version }
    }
  });

  const summaryAi = await callDeepSeekText({
    system: "你是小說摘要編輯，請在 300 字內總結章節，保留核心衝突與章尾鉤子。",
    user: `請總結以下章節（300字內）：\n${text}`,
    temperature: 0.3
  });

  const latestSummary = await prisma.chapterSummary.findFirst({ where: { projectId, chapterNo }, orderBy: { version: "desc" }, select: { version: true } });

  await prisma.chapterSummary.create({
    data: {
      projectId,
      chapterNo,
      version: (latestSummary?.version || 0) + 1,
      summary: summaryAi.text.slice(0, 300)
    }
  });

  await prisma.generationLog.create({
    data: {
      projectId,
      task: "draft_stream",
      promptHash: ai.promptHash,
      model: ai.model,
      params: { temperature: 0.85 },
      refs: { chapterNo, bibleVersion: bible?.version, summaryVersion: lastSummary?.version }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
