import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPrompt } from "@/lib/prompts";
import { callDeepSeekJson } from "@/lib/llm";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { count } = await req.json();

  const [bible, outline, latest] = await Promise.all([
    prisma.bibleVersion.findFirst({ where: { projectId: id }, orderBy: { version: "desc" } }),
    prisma.outlineVersion.findFirst({ where: { projectId: id }, orderBy: { version: "desc" } }),
    prisma.chapterPlanVersion.findFirst({ where: { projectId: id }, orderBy: { version: "desc" } })
  ]);

  const prompt = buildPrompt({
    role: "planning",
    context: { bibleSummary: JSON.stringify(bible?.json || {}), storySummary: "", chapterCard: {} },
    task: `請輸出 ${count || 10} 章的 chapter cards JSON，欄位：chapterNo,title,goal,hook。並遵循 outline：${JSON.stringify(outline?.json || {})}`
  });

  const ai = await callDeepSeekJson({ system: prompt.system, user: prompt.user, temperature: 0.7 });
  let json: any;
  try {
    json = JSON.parse(ai.text);
  } catch {
    json = { chapters: Array.from({ length: count || 10 }).map((_, i) => ({ chapterNo: i + 1, title: `第${i + 1}章`, goal: "推進主線", hook: "章尾留鉤子" })) };
  }

  if (!json.chapters) {
    json = { chapters: Array.from({ length: count || 10 }).map((_, i) => ({ chapterNo: i + 1, title: `第${i + 1}章`, goal: "推進主線", hook: "章尾留鉤子" })) };
  }

  const nextVersion = (latest?.version || 0) + 1;

  const record = await prisma.chapterPlanVersion.create({
    data: { projectId: id, version: nextVersion, json }
  });

  await prisma.generationLog.create({
    data: {
      projectId: id,
      task: "chapter_plan",
      promptHash: ai.promptHash,
      model: ai.model,
      params: { temperature: 0.7 },
      refs: { bibleVersion: bible?.version, outlineVersion: outline?.version }
    }
  });

  await prisma.project.update({ where: { id }, data: { stage: "DRAFT" } });

  return NextResponse.json({ record });
}
